const Table = require('cli-table3');

class VariableTracker {
  constructor(storageTable) {
    this.storageTable = storageTable;
  }

  getInfo(input) {
    var table = new Table({
      head: ['VARIABLE', 'TYPE', 'SIZE', 'INDEX', 'STARTBYTE', 'VALUE'],
      colWidths: [25, 25, 25]
    });

    // variable exist in storageTable
    if (input in this.storageTable.get()) {
      var row = this.storageTable.get()[input];
      var type = row[0];

      if (type.indexOf('[]') != -1) {
        // If dynamic array, outputs are elements of array
        // TODO!!!!!!!!!!!!!!
      } else {
        // output is table contents
        table.push(row);
      }

      // variable doesn't exist in storageTable
    } else {
      var name = input.split('[')[0];
      console.log(name)
      // case that really doesn't exist
      if (!(name in this.storageTable.get())) {
        console.log('The variable does not exist.');
        return -1;

      // case of array, mapping variable
      } else {
        var row = this.storageTable.get()[name];
        var type = row[0];
        // []가 있으면 동적배열 (우선) mapping이 있으면 맵핑
        if (type.indexOf('[]') != -1 || type.indexOf('mapping') != -1) {
          this.parseSequentially(input, type);
        } else {
          // case of input var[4] when real variable is var
          console.log('Invalid reference.');
          return -1;
        }
      }
    }
    return table;
  }

  parseSequentially(input, type) {

    /*
    # Example
    input : var[3][key1][key2][2]
    dimensions : [2, key1, key2, 3]
    var's type : ( mapping => (mapping => int[2][3][]) )[]
    seqType : ([], mapping, mapping, [], [3], [2])
    */
   console.log(input)

    var getDimensions = new ASTParser().getDimensions;
    var dimensions = getDimensions(input);
    print(dimensions)

    var seqType;
    /* 계산 규칙 */

    // 순서대로 참조값이 일치하는지 확인
    //   - dimensions가 더 긴경우 에러
    if (dimensions.length > seqType.length) {
      console.log('Invalid reference:dimension is too long');
      return -1;
    }

    //   - 대응되는 놈들이 일반값들이어야함
    for (var i = 0; i < dimensions.length; i++) {
      if (seqType[i].indexOf('[]') == -1) {
        if (seqType.indexOf('mapping') == -1) {
          console.log('Invalid reference.');
          return -1;
        }
      } else {
        //   - []인데 key가 들어가면안됨
        if (dimensions[i] /* String 이면!! (NaN이면!!)*/) {
          console.log('Invalid reference.');
          return -1;
        }
      }
    }

    // 통과하면 이제 실제로 돌려보면서 값을 구한다.
    child.name = '';
    parent.name = name;
    parent.type = type;
    parent.size = row[1];
    child.name = child.name + diemnsions[i];
    child.type = seqType[i];
    for (i = 0; i < dimensions.length; i++) {
      //  중간값 처리 x[3]이 child / x가 parent

      switch (parent.type) {
        case darray:
          //    - x가 동적배열 : x[3]의 인덱스 = 해시(x의 인덱스) + 3
          var baseIndex = web3.utils.soliditySha3(String(index));
          baseIndex =
            '0x' + (BigInt(baseIndex) + BigInt(dimensions[i])).toString(16);
          break;

        case mapping:
          //    - x가 맵핑 : x[3]의 인덱스 = 해시(키 3+x의 인덱스)
          var key = dimensions[i];
          index = web3.utils.soliditySha3(String(key), String(index));
          break;

        case normal:
          //    - 일반변수 : 끝
          finalData = normal;
          break;

        case array:
          //    - x가 배열 : x[3]의 인덱스 = x+3
          //    - x가 다중배열 : x[3][3]의 인덱스 = x+9

          dimensionsnum = 0;

          for (var j = 0; j < dimensions.length; j++) {
            if (seqType == []) {
              break;
            }
            dimensionsnum++;
          }
          break;

        case struct:
          //    - x가 구조체 : x.k[]의 인덱스 = x의 구조체테이블안의 k의 인덱스
          finalData = struct;
          break;
      }

      parent.name = child.name;
      parent.type = child.type;
      parent.size = row[1];
      child.name = child.name + diemnsions[i];
      child.type = seqType[i];
    }

    //  최종값 처리

    switch (child.type) {
      case darray:
      //    - 동적배열 : 현재배열의 자식들 보여줌(선택사항)

      case mapping:
      case normal:
        //    - 맵핑, 일반변수 : 그냥 끝
        break;

      case array:
        //    - 배열 : 그냥 값하나만 보여주자

        break;

      case struct:
        //    - 구조체 : 안에있는값들 다보여주자
        break;
    }
  }
}

module.exports = VariableTracker;
