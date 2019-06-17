const Table = require('cli-table3');
const { ASTParser } = require('./astParser');

class VariableTracker {
  constructor(storageTable, web3) {
    this.storageTable = storageTable;
    this.web3 = web3;
  }

  getInfo(input) {
    var table = new Table({
      head: ['VARIABLE', 'TYPE', 'SIZE', 'INDEX', 'STARTBYTE', 'VALUE'],
      colWidths: [25, 25, 25]
    });

    // if variable exist in storageTable
    if (input in this.storageTable.get()) {
      // output is table contents
      var row = this.storageTable.get()[input];
      var type = row[0];
      var size = row[1];
      var index = row[3];
      var startByte = row[4];
      table.push([input, type, size, index, startByte]);

      // if variable doesn't exist in storageTable
    } else {
      var splitedList = input.split('[');
      var name = splitedList[0];
      var existVar = name in this.storageTable.get();

      for (var i = 1; i < splitedList.length; i++) {
        if (existVar == false) {
          name = name + '[' + splitedList[i];
          existVar = name in this.storageTable.get();
        }
      }
      // case that really doesn't exist
      if (existVar == false) {
        console.log('The variable does not exist.');
        return -1;

        // case of array, mapping variable
      } else {
        var row = this.storageTable.get()[name];
        var type = row[0];
        var index = row[3];
        if (type.indexOf('[]') != -1 || type.indexOf('mapping') != -1) {
          var row = this.parseSequentially(input, name, type, index);
          if (row == -1) {
            return -1;
          }
          table.push(row);
        } else {
          // case of input var[4] when real variable is var
          console.log('Invalid reference : It is not array nor mapping');
          return -1;
        }
      }
    }
    return table;
  }

  parseSequentially(input, name, type, index) {
    /*
    # Example
    input : mapdarray[1][235]['stringkey'][0][2][1]
    refSeq : [1, 235, stringkey, 0, 2, 1]
    mapdarray's type : mapping( int => mapping(string => int[2][3][]) )[2] 
    typeSeq : ([2], mapping, mapping, [], [3], [2])
    */
    var getTypeSize = new ASTParser().getTypeSize;
    var refSeq = this.getRefSeq(input.replace(name, ''));
    var typeSeq = this.getTypeSeq(type);
    var typeString = this.getTypeString(typeSeq, type);

    // error check
    if (refSeq.length > typeSeq.length) {
      console.log('Invalid reference: reference is too long');
      return -1;
    }
    for (var i = 0; i < refSeq.length; i++) {
      if (typeSeq[i].indexOf('[') == -1 && typeSeq.indexOf('mapping') == -1) {
        console.log('Invalid reference. : invalid type');
        return -1;
      } else if (typeSeq[i].indexOf('[') != -1) {
        if (isNaN(refSeq[i])) {
          console.log('Invalid reference : array cannot reference using NaN');
          return -1;
        }
      }
    }

    var startByte;
    var bytesInSlot = 0;
    var maxDim = [];
    var targetDim = [];
    // calculate index
    for (i = 0; i < refSeq.length; i++) {
      // case mapping
      // when x is mapping : x[3].index = Hash(x.index, 3)
      if (typeSeq[i].indexOf('mapping') != -1) {
        startByte = 0;
        bytesInSlot = 0;

        var key = refSeq[i];
        index = this.web3.utils.soliditySha3(String(key), String(index));
      } else if (typeSeq[i].indexOf('[') != -1) {
        var size = getTypeSize(typeString[i]);
        // case darray
        // when x is darray : x[3].index = HASH(x.index) + 3
        if (typeSeq[i].indexOf('[]') != -1) {
          var baseIndex = this.web3.utils.soliditySha3(String(index));
          var offset = parseInt((refSeq[i] * size) / 32);
          startByte = (refSeq[i] * size) % 32;
          bytesInSlot = 0;
          index = '0x' + (BigInt(baseIndex) + BigInt(offset)).toString(16);

          // case normal array (multi-dim)
        } else {
          // push current dim info during normal array
          maxDim.unshift(typeSeq[i].replace('[', '').replace(']', ''));
          targetDim.unshift(refSeq[i]);
          startByte = 0;

          // if next array is not normal array
          if (
            i == refSeq.length - 1 ||
            typeSeq[i + 1].indexOf('[') == -1 ||
            typeSeq[i + 1].indexOf('[]') != -1
          ) {
            // init current Dim for 0s
            var currentDim = [];
            for (var j = 0; j < targetDim.length; j++) {
              currentDim.push(0);
            }
            // add bytes In Slot
            var offset = 0;
            while (!this.compare(targetDim, currentDim)) {
              currentDim[0] += 1;
              bytesInSlot += size;
              if (bytesInSlot > 32) {
                bytesInSlot = size;
                offset++;
              }
              startByte = bytesInSlot - size;
              if (currentDim.length > 1) {
                // if second dimension increased, start in new index
                if (currentDim[0] >= maxDim[0]) {
                  if (bytesInSlot != 0) {
                    offset++;
                    bytesInSlot = 0;
                  }
                  startByte = 0;
                  currentDim[0] = 0;
                  currentDim[1] += 1;
                }
                // higher dimension carry
                for (var j = 1; j < currentDim.length; j++) {
                  if (currentDim[j] >= maxDim[j]) {
                    currentDim[j] = 0;
                    currentDim[j + 1] += 1;
                  }
                }
              }
            }

            // add bytes In Slot when targetDim == currentDim
            bytesInSlot += size;
            if (bytesInSlot > 32) {
              bytesInSlot = size;
              offset++;
            }
            startByte = bytesInSlot - size;

            // calculate index
            index = '0x' + (BigInt(baseIndex) + BigInt(offset)).toString(16);
          }
        }
      }
    }

    var endpointType = typeString[refSeq.length - 1];
    var row = [
      input,
      endpointType,
      getTypeSize(endpointType.split('[')[0]),
      index,
      startByte
    ];

    return row;
  }

  getTypeSeq(type) {
    var mappingSeq = type.split('(');

    if (mappingSeq.length > 1) {
      if (mappingSeq[0] != 'mapping') {
        console.log('input string is invalid (for mapping)');
        return -1;
      }
      for (var i = 1; i < mappingSeq.length - 1; i++) {
        var splitedList = mappingSeq[i].split('>');
        if (splitedList[splitedList.length - 1] != ' mapping') {
          console.log('input string is invalid (for mapping)');
          return -1;
        }
      }
    }
    var darraySeq = mappingSeq[mappingSeq.length - 1].split(')').reverse();
    var typeSeq = [];
    for (var i = 0; i < mappingSeq.length; i++) {
      // Prior darray than mapping in same position
      if (darraySeq[i].indexOf('[') != -1) {
        var splitedList = darraySeq[i].split('[');
        var tmpList = [];
        for (var j = 1; j < splitedList.length; j++) {
          tmpList.push('[' + splitedList[j]);
        }
        typeSeq = typeSeq.concat(tmpList.reverse());
      }

      var splitedList = mappingSeq[i].split('> ');
      var mappingString = splitedList[splitedList.length - 1];
      if (mappingString == 'mapping') {
        typeSeq.push(mappingString);
      }
    }
    return typeSeq;
  }

  getTypeString(typeSeq, type) {
    var currentTypeString = type;
    var typeString = [];
    for (var i = 0; i < typeSeq.length; i++) {
      if (typeSeq[i] == 'mapping') {
        var li1 = currentTypeString.indexOf('>');
        var li2 = currentTypeString.lastIndexOf(')');
        currentTypeString = currentTypeString.slice(li1 + 2, li2);
        typeString.push(currentTypeString);
      } else {
        var li = currentTypeString.lastIndexOf(typeSeq[i]);
        currentTypeString = currentTypeString.slice(0, li);
        typeString.push(currentTypeString);
      }
    }
    return typeString;
  }

  getRefSeq(refString) {
    var splitedList = refString.split(/[\[]/);
    var refSeq = [];
    for (var i = 1; i < splitedList.length; i++) {
      refSeq.push(splitedList[i].replace(']', ''));
    }
    return refSeq;
  }

  compare(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
      if (String(a[i]) !== String(b[i])) return false;
    }
    return true;
  }
}

module.exports = VariableTracker;
