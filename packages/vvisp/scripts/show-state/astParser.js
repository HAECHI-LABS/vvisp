'use strict';
class SymbolTable {
  /*
    | var_name | type | size | seq_no | index | startByte |
    ------------------------------------------------------
    |                        ...                          |
    */
  constructor() {
    this.value = {};
    this.num = 0;
  }
  insertRow(var_name, type, size) {
    this.value[var_name] = [type, size, this.num];
    this.value[this.num] = var_name; // Variable names can be referenced by seq_no.
    this.num++;
  }

  get() {
    return this.value;
  }
}

class ASTParser {
  constructor(symbolTable, structsDefTable) {
    this.symbolTable = symbolTable;
    this.structsDefTable = structsDefTable;
  }

  parse(variable) {
    var type = this.checkType(variable);

    if (type == 'element') {
      this.parseElement(variable.name, variable.typeDescriptions.typeString);
    } else if (type == 'array') {
      this.parseArray(variable.typeName, variable.name);
    } else if (type == 'struct') {
      this.parseStruct(variable, 'normalStruct');
    }
  }

  checkType(variable) {
    if (variable.nodeType == 'VariableDeclaration') {
      if (
        variable.typeName.nodeType == 'ElementaryTypeName' ||
        variable.typeName.nodeType == 'Mapping' ||
        variable.typeName.nodeType == 'FunctionTypeName'
      ) {
        return 'element';
      } else if (variable.typeName.nodeType == 'ArrayTypeName') {
        return 'array';
      } else if (variable.typeName.nodeType == 'UserDefinedTypeName') {
        if (variable.typeDescriptions.typeString.split(' ')[0] == 'struct') {
          return 'struct';
        } else {
          return 'element';
        }
      }
    }
  }

  parseElement(name, type) {
    this.symbolTable.insertRow(name, type, this.getTypeSize(type));
  }

  parseArray(baseType, var_name) {
    var typeString = baseType.typeDescriptions.typeString;
    var dimensions = this.getDimensions(typeString);
    var index = 0;
    this.parseInnerArray(baseType, var_name, dimensions, index);
  }

  getDimensions(typeString) {
    var tmpString = typeString;

    // type of mapping array
    if (typeString.indexOf(')') != -1) {
      var splitedList = typeString.split(')');
      tmpString = splitedList[splitedList.length - 1];
    }

    tmpString = tmpString.split(/[\[]/);

    var dimensions = [];
    for (var i = 1; i < tmpString.length; i++) {
      var tmplen = tmpString[i].replace(']', '');
      dimensions.unshift(tmplen);
    }

    return dimensions;
  }

  parseInnerArray(baseType, string, dim, index) {
    var tmpstring = string;
    // case of dynamic array

    if (dim[index] == '') {
      var type = baseType.typeDescriptions.typeString;
      this.symbolTable.insertRow(tmpstring, type, this.getTypeSize(type));

      // case of normal array
    } else {
      for (var i = 0; i < dim[index]; i++) {
        var splited_front = string.split('[')[0];
        var splited_back = string.replace(splited_front, '');

        tmpstring = splited_front + splited_back + '[' + i + ']';

        // 현재 원소의 타입이 배열
        if (index < dim.length - 1) {
          this.parseInnerArray(baseType.baseType, tmpstring, dim, index + 1);
        } else {
          // 현재원소의 타입이 구조체
          if (baseType.typeDescriptions.typeString.split(' ')[0] == 'struct') {
            this.parseStruct(baseType, 'arrayOfStruct', tmpstring);
          }
          // 현재 원소의 타입이 일반변수 (그외변수, 맵핑)
          else {
            //targetMap[counter.currentIndex] = tmpstring;
            type = baseType.baseType.typeDescriptions.typeString;
            this.symbolTable.insertRow(tmpstring, type, this.getTypeSize(type));
          }
        }
      }
    }
  }

  parseStruct(variable, structType, arrayName) {
    if (structType == 'normalStruct') {
      var typeName = variable.typeName.name;
      var name = variable.name;
    } else if (structType == 'arrayOfStruct') {
      var typeName = variable.baseType.name;
      var name = arrayName;
    }

    this.addStructInfo(name, typeName);
  }

  addStructInfo(name, typeName) {
    var sourceTable = this.structsDefTable[typeName].get();
    for (var var_name in sourceTable) {
      if (isNaN(var_name)) {
        var type = sourceTable[var_name][0];
        var size = sourceTable[var_name][1];
        this.symbolTable.insertRow(name + '.' + var_name, type, size);
      }
    }
  }

  getTypeSize(type) {
    var elementTypeSize = {
      bool: 1,
      address: 20,
      'address payable': 20,
      byte: 1,
      bytes: 32,
      string: 32
    };
    var size = 0;

    if (type.indexOf('function') != -1) {
      size = 8;
      if (type.indexOf('external') != -1) {
        size = 24;
      }
    } else if (type.indexOf('mapping') != -1) {
      size = 32;
    } else if (type.indexOf('[]') != -1) {
      size = 32;
    } else if (type.indexOf('int') != -1) {
      size = parseInt(type.split('t')[1]) / 8;
      if (isNaN(size)) {
        size = 32;
      }
    } else if (type.indexOf('bytes') != -1) {
      size = parseInt(type.split('s')[1]);
      if (isNaN(size)) {
        size = 32;
      }
    } else if (type.indexOf('fixed') != -1) {
      size = parseInt(type.split('d')[1].split('x')[0]) / 8;
      if (isNaN(size)) {
        size = 16;
      }
    } else if (type.indexOf('enum') != -1) {
      size = 1;
    } else if (type.indexOf('contract') != -1) {
      size = 20;
    } else {
      size = elementTypeSize[type];
    }

    if (size == null) {
      throw 'invalidTypeException:' + type;
    }

    return size;
  }
}

/*
class DynamicArrayIndexer extends Indexer {
    constructor(map, dynamicLength) {
        super(map);
        this.dynamicLength = dynamicLength;
    }

    getDynamicLength() {
        return this.dynamicLength;
    }
}

Indexer.structMap = {};
DynamicArrayIndexer.structMap = Indexer.structMap;
*/
module.exports.ASTParser = ASTParser;
module.exports.SymbolTable = SymbolTable;
