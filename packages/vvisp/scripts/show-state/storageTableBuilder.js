const Table = require('cli-table3');
const { ASTParser, SymbolTable } = require('./astParser');
const ethers = require('ethers');
var indexerStack = [];

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

    for (var i = 0; i < this.storageTable.num; i++) {
      var name = this.storageTable.get()[i];
      var row = this.storageTable.get()[name];
      var type = row[0];
      var size = row[1];

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
        var tmpArray = name.split('[');
        if (prevArrayName != tmpArray[0]) {
          isNewArray = true;
          prevArrayName = tmpArray[0];
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

  buildMapping(input, web3) {
    var getDimensions = new ASTParser().getDimensions;
    var name = input.split('[')[0];
    var keys = getDimensions(input);

    if (!name in this.storageTable.get()) {
      console.log('The variable does not exist.');
      return -1;
    }

    var row = this.storageTable.get()[name];
    var type = row[0];

    var tmpstring = type.split('=>');
    var mappingTypeFlag = [];

    tmpstring.forEach(type => {
      if (type.indexOf('mapping') != -1) {
        mappingTypeFlag.push(1);
      } else {
        mappingTypeFlag.push(0);
      }
    });

    // calculate mapping index
    var index = row[3];

    var typeIndex = 0;
    for (var i = 0; i < keys.length; i++) {
      if (mappingTypeFlag[i] == 1) {
        var key = keys[i];
        index = web3.utils.soliditySha3(String(key), String(index));
        typeIndex++;
      } else {
        return -2;
      }
    }

    type = '';
    for (var i = typeIndex; i < tmpstring.length; i++) {
      type = type + '=>' + tmpstring[i];
    }
    type = type.substr(2, type.length - 1);

    var table = new Table({
      head: ['VARIABLE', 'TYPE', 'SIZE', 'INDEX', 'STARTBYTE', 'VALUE'],
      colWidths: [25, 25, 25]
    });
    table.push([name, type, 0, 'baseIndex', 0]);
    return [table, index];
  }

  async buildDynamicArray(input, address, web3) {
    var getDimensions = new ASTParser().getDimensions;
    var getTypeSize = new ASTParser().getTypeSize;

    // get name
    var name = input.split('[')[0];
    if (!name in this.storageTable.get()) {
      console.log('The variable does not exist.');
      return -1;
    }

    var row = this.storageTable.get()[name];

    var dimensions = getDimensions(input);

    // get type
    var type = row[0];
    if (type.indexOf('[]') == -1) {
      console.log("It's not dynamic variable.");
      return 0;
    }

    type = type.split('[')[0];

    // get index
    // get base index
    // base 인덱스를 계산한다.  (hash(index))
    var index = row[3];

    var baseIndex = web3.utils.soliditySha3(String(index));

    // get len
    // buildTable
    var len = await web3.eth.getStorageAt(address, index);
    var size = getTypeSize(type);
    var bytesInSlot = 0;
    var offset = 0;

    var table = new Table({
      head: ['VARIABLE', 'TYPE', 'SIZE', 'INDEX', 'STARTBYTE', 'VALUE'],
      colWidths: [25, 25, 25]
    });

    for (var i = 0; i < len; i++) {
      bytesInSlot += size;
      if (bytesInSlot > 32) {
        bytesInSlot = size;
        offset++;
      }
      var startByte = this.bytesInSlot - size;
      if (offset == 0) {
        table.push([name + '[' + i + ']', type, size, 'baseIndex', startByte]);
      } else {
        table.push([
          name + '[' + i + ']',
          type,
          size,
          'baseIndex+' + offset,
          startByte
        ]);
      }
    }

    return [table, baseIndex];
  }
}

/*
    const dynamicStorageTable = dynamicArrayParse(linearNodes, target, len);

    for (let i = 0;i < dynamicStorageTable.length;i++) {

      index = dynamicStorageTable[i][2];
      value = await web3.eth.getStorageAt(address, index)
      dynamicStorageTable[i].push(value);

      if (index == 0) {
        dynamicStorageTable[i][2] = 'baseIndex';
      } else {
        dynamicStorageTable[i][2] = 'baseIndex+' + index;
      }
    }
  */

/*

  dynamicArrayParse(nodes, name, len) {

    var emptyMap = {};
    var dynamicArrayIndexer = new ASTParser(emptyMap, len);


    var tmpArray = name.split('.');
    var arrayName = tmpArray[tmpArray.length - 1]

    var dimension = 0;
    var ref_id;
    while (arrayName.indexOf('[') != -1) {
      arrayName = arrayName.split('[')[0];
      dimension++;
    }

    if (tmpArray.length > 1) {
      var structName = tmpArray[tmpArray.length - 2].split('[')[0];
      nodes.forEach(node =>
        node.nodes.forEach(function (variable) {
          if (variable.name == structName) {
            ref_id = variable.typeName.referencedDeclaration
          }
        })
      );

      nodes.forEach(node =>
        node.nodes.forEach(function (variable) {
          if (variable.id == ref_id) {
            for (var i in variable.members) {
              var member = variable.members[i]


              indexingDynamicArray(member, arrayName, dimension, name, dynamicArrayIndexer)

            }
          }
        })
      );

    } else {

      // 일반배열인경우
      nodes.forEach(node =>
        node.nodes.forEach(function (variable) {
          indexingDynamicArray(variable, arrayName, dimension, name, dynamicArrayIndexer)
        })
      );

    }


    // create indexMap Table
    var table = new Table({
      head: ['VARIABLE', 'TYPE', 'INDEX', 'STARTBYTE', 'VALUE'],
      colWidths: [25, 25, 25]
    });
    var keys = Object.keys(dynamicArrayIndexer.indexMap);
    keys.forEach(function (k) {
      var row = [];
      row.push(k);
      row = row.concat(dynamicArrayIndexer.indexMap[k]);
      table.push(row);
    });

    return table;
  };

*/

/*
  indexingDynamicArray(variable, arrayName, dimension, name, dynamicArrayIndexer) {

    if (variable.name == arrayName) {
      var baseType = variable.typeName;
      while (dimension > 0) {
        baseType = baseType.baseType;
        dimension--;
      }
      dynamicArrayIndexer.indexingArray(baseType, name);
    }
  }
}

*/

module.exports = StorageTableBuilder;
//module.exports.dynamicArrayParse = dynamicArrayParse;
