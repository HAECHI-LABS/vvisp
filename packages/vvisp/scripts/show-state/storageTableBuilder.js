const Table = require('cli-table3');
const { ASTParser, SymbolTable } = require('./astParser');

class StorageTableBuilder {
  constructor(nodes) {
    this.nodes = nodes;
    this.structTables = {};
    this.queue = [];
    this.bytesInSlot = 0;
    this.index = 0;
    this.storageTable = new SymbolTable();
  }

  build() {
    this.buildStructSymbolTables();
    this.storageTable = this.buildStorageTable();
    this.calculateIndex();
    var cliTable = this.buildCliTable();
    return cliTable;
  }

  buildStructSymbolTables() {
    var _this = this;

    // enqueue struct definitions
    this.nodes.forEach(node =>
      node.nodes.forEach(function(variable) {
        _this.parseStructDef(variable);
      })
    );

    // create structMap in order
    while (this.queue.length != 0) {
      var k = this.queue.shift();
      this.parseStructDef(k);
    }
  }

  parseStructDef(variable) {
    if (variable.nodeType == 'StructDefinition') {
      var processable = true;
      for (var i = 0; i < variable.members.length; i++) {
        var var2 = variable.members[i];
        // struct has the struct member
        if (var2.typeDescriptions.typeString.split(' ')[0] == 'struct') {
          // find id of the member
          var typeName;
          if (var2.typeName.nodeType == 'ArrayTypeName') {
            typeName = var2.typeName.baseType.name;
          } else if (var2.typeName.nodeType == 'UserDefinedTypeName') {
            typeName = var2.typeName.name;
          }

          // member is not in struct -> enqueue : process later
          if (this.structTables[typeName] == null) {
            this.queue.push(variable);
            processable = false;
            return 0;
          }
        }
      }

      if (processable) {
        // build symbol table of current struct
        this.structTables[variable.name] = new SymbolTable();
        var structAstParser = new ASTParser(
          this.structTables[variable.name],
          this.structTables
        );
        variable.members.forEach(function(var2) {
          structAstParser.parse(var2);
        });
      }
    }
  }

  buildStorageTable() {
    var astParser = new ASTParser(this.storageTable, this.structTables);
    this.nodes.forEach(node => {
      node.nodes.forEach(function(variable) {
        astParser.parse(variable);
      });
    });

    return astParser.symbolTable;
  }

  calculateIndex() {
    var isNewArray = false;
    var isNewStruct = false;
    var prevStructName = '';
    var prevArrayName = '';
    var getDimensions = new ASTParser().getDimensions;

    for (var i = 0; i < this.storageTable.num; i++) {
      var name = this.storageTable.get()[i];
      var row = this.storageTable.get()[name];
      var type = row[0];
      var size = row[1];
      var secondDimension;

      // check variable is new struct
      if (name.indexOf('.') != -1) {
        var tmpArray = name.split('.');
        if (prevStructName != tmpArray[tmpArray.length - 2]) {
          isNewStruct = true;
          prevStructName = tmpArray[tmpArray.length - 2];
        }
      }

      // check variable is new array
      if (name.indexOf('[') != -1) {
        var dimensions = getDimensions(name);
        // multi dimension array
        if (dimensions.length > 1) {
          if (secondDimension != dimensions[1]) {
            isNewArray = true;
          }
          secondDimension = dimensions[1];
          // one dimension array
        } else {
          var tmpArray = name.split('[');
          if (prevArrayName != tmpArray[0]) {
            isNewArray = true;
            prevArrayName = tmpArray[0];
          }
        }
      }

      this.setNewIndex(type, isNewStruct, isNewArray);
      isNewStruct = false;
      isNewArray = false;

      this.addIndex(size);

      var startByte = this.bytesInSlot - size;
      row.push(this.index);
      row.push(startByte);
    }
  }

  setNewIndex(type, isNewStruct, isNewArray) {
    if (
      type == 'mapping' ||
      type == 'bytes' ||
      type == 'string' ||
      type.indexOf('[]') != -1 ||
      isNewStruct == true ||
      isNewArray == true
    ) {
      if (this.bytesInSlot != 0) {
        this.index++;
        this.bytesInSlot = 0;
      }
    }
  }

  addIndex(size) {
    this.bytesInSlot += size;
    if (this.bytesInSlot > 32) {
      this.bytesInSlot = size;
      this.index++;
    }
  }

  buildCliTable() {
    var table = new Table({
      head: ['VARIABLE', 'TYPE', 'SIZE', 'INDEX', 'STARTBYTE', 'VALUE'],
      colWidths: [25, 25, 25]
    });

    for (var i = 0; i < this.storageTable.num; i++) {
      var name = this.storageTable.get()[i];
      var row = this.storageTable.get()[name];
      var type = row[0];
      var size = row[1];
      var index = row[3];
      var startByte = row[4];

      table.push([name, type, size, index, startByte]);
    }

    return table;
  }
}
module.exports = StorageTableBuilder;
