const Table = require('cli-table3');

var indexMap = {};
var structMap = {};
var indexCounter = { currentIndex: 0 };
var structCounter = { currentIndex: 0 };
var bytesInSlot = 0;
var queue = [];

// structMap
// structMap[struct_id][{name, ref_id} of struct_element]
// ref_id는 element가 struct일때 존재

module.exports = function(nodes) {
  // enqueue struct definitions
  nodes.forEach(node =>
    node.nodes.forEach(function(variable) {
      checkStructDef(variable);
    })
  );

  // create structMap in order
  while (queue.length != 0) {
    k = queue.pop();
    checkStructDef(k);
  }

  // create indexMap
  nodes.forEach(node =>
    node.nodes.forEach(function(variable) {
      checkType(variable, 'normal', null);
    })
  );

  // create indexMap Table
  var table = new Table({
    head: ['VARIABLE', 'INDEX', 'VALUE'],
    colWidths: [25, 25, 25]
  });
  keys = Object.keys(indexMap);
  keys.forEach(function(k) {
    table.push([indexMap[k].toString(), k]);
  });

  return table;
};

function checkStructDef(variable) {
  if (variable.nodeType == 'StructDefinition') {
    hasStruct = true;

    // 스트럭트의 멤버들 중 스트럭트가 있나 확인
    for (i = 0; i < variable.members.length; i++) {
      var2 = variable.members[i];
      if (var2.typeDescriptions.typeString.indexOf('struct') != -1) {
        // 있으면 멤버 스트럭트가 스트럭트맵에 존재하는지 확인

        if (var2.typeName.nodeType == 'ArrayTypeName') {
          refid = var2.typeName.baseType.referencedDeclaration;
        } else if (var2.typeName.nodeType == 'UserDefinedTypeName') {
          refid = var2.typeName.referencedDeclaration;
        }

        if (structMap[refid] == null) {
          // 존재하지 않으면 큐에 넣고 이따가 진행
          queue.push(variable);
          hasStruct = false;
          return 0;
        }
      }
    }

    if (hasStruct) {
      // 존재하면 진행
      // 해당 struct의 객체 생성
      structMap[variable.id] = {};

      structCounter.currentIndex = 0;
      bytesInSlot = 0;

      variable.members.forEach(function(var2) {
        checkType(var2, 'structDef', variable.id);
      });
      // (index, name의 해쉬들을 집어넣어야됨)
      // struct인경우에는 레퍼런스id 집어넣자
    }
  }
}

// 변수 타입 별로 인덱싱
function checkType(variable, type, def_id) {
  if (variable.nodeType == 'VariableDeclaration') {
    if (variable.typeName.nodeType == 'ElementaryTypeName') {
      indexingElement(variable, type, def_id);
    } else if (variable.typeName.nodeType == 'ArrayTypeName') {
      indexingArray(variable, type, def_id);
    } else if (variable.typeName.nodeType == 'UserDefinedTypeName') {
      if (variable.typeDescriptions.typeString.split(' ')[0] == 'struct') {
        indexingStruct(variable, type, def_id);
        // enum, contract type
      } else {
        indexingElement(variable, type, def_id);
      }
    } else if (variable.typeName.nodeType == 'Mapping') {
      indexingMapping(variable, type, def_id);
    } else if (variable.typeName.nodeType == 'FunctionTypeName') {
      indexingElement(variable, type, def_id);
    }
  }
}

function getTypeSize(type) {
  var elementTypeSize = {
    bool: 1,
    address: 20,
    'address payable': 20,
    byte: 1,
    dynamicArray: 32,
    mapping: 32
  };

  if (type.indexOf('function') != -1) {
    size = 24;
    if (type.indexOf('external') != -1) {
      size = 8;
    }
  } else if (type.indexOf('int') != -1) {
    size = parseInt(type.split('t')[1]) / 8;
    if (isNaN(size)) {
      size = 32;
    }
  } else if (type.indexOf('bytes') != -1) {
    size = parseInt(type.split('s')[1]);
    if (isNaN(size)) {
      size = 'dynamicArray';
    }
  } else if (type.indexOf('fixed') != -1) {
    size = parseInt(type.split('d')[1].split('x')[0]) / 8;
    if (isNaN(size)) {
      size = 16;
    }
  } else if (type.indexOf('enum')) {
    size = 1;
  } else if (type.indexOf('contract')) {
    size = 20;
  } else {
    size = elementTypeSize[type];
  }
  return size;
}

function indexingMapping(variable, type, def_id) {
  // 스트럭트 정의인지, 변수선언인지에 따라 인덱스 저장할 맵 선택
  returnVal = selectMapCount(type, def_id);
  targetMap = returnVal[0];
  counter = returnVal[1];

  // element의 인덱스 지정
  setCounterIndex(counter, 'newIndex');
  setCounterIndex(counter, 'mapping');
  addVarToMap(variable.name, targetMap, counter);
}

// structMap, Counter와 indexMap, Counter 중 택1
function selectMapCount(type, def_id) {
  var targetMap;

  if (type == 'normal') {
    targetMap = indexMap;
    counter = indexCounter;
  } else if (type == 'structDef') {
    targetMap = structMap[def_id];
    counter = structCounter;
  }
  return [targetMap, counter];
}

// [일반변수]

function indexingElement(variable, type, def_id) {
  // 스트럭트 정의인지, 변수선언인지에 따라 인덱스 저장할 맵 선택
  returnVal = selectMapCount(type, def_id);
  targetMap = returnVal[0];
  counter = returnVal[1];

  // bytes, string인 경우 독립적인 인덱스 보유
  if (
    variable.typeDescriptions.typeString == 'bytes' ||
    variable.typeDescriptions.typeString == 'string'
  ) {
    setCounterIndex(counter, 'newIndex');
    setCounterIndex(counter, 'dynamicArray');
    addVarToMap(variable.name, targetMap, counter);
  } else {
    // element의 인덱스 지정
    setCounterIndex(counter, variable.typeDescriptions.typeString);
    addVarToMap(variable.name, targetMap, counter);
  }
}

function addVarToMap(var_name, targetMap, counter, type) {
  // 현재 인덱스에 값이 이미존재하면 -> 추가해서 배열형태로 저장 (packing)
  if (counter.currentIndex in targetMap) {
    tmpList = targetMap[counter.currentIndex];
    if (!Array.isArray(tmpList)) {
      tmpList = [tmpList];
    }

    tmpList.push(var_name);

    targetMap[counter.currentIndex] = tmpList;

    // 현재 위치 비어있으면 그냥 저장
  } else {
    targetMap[counter.currentIndex] = var_name;
  }
}

function setCounterIndex(counter, type) {
  // 어레이? -> 현재 뭐가들어있든 일단 넘겨
  // 현재 0인상황이면? 안념겨
  if (type == 'newIndex') {
    if (bytesInSlot != 0) {
      counter.currentIndex++;
      bytesInSlot = 0;
    }

    // 아닌경우 그냥 타입크기 계산
  } else {
    bytesInSlot += getTypeSize(type);
    if (bytesInSlot > 32) {
      bytesInSlot = getTypeSize(type);
      counter.currentIndex++;
    }
  }
}

// [배열]
function indexingArray(variable, type, def_id) {
  // 스트럭트 정의인지, 변수선언인지에 따라 인덱스 저장할 맵 선택
  returnVal = selectMapCount(type, def_id);
  targetMap = returnVal[0];
  counter = returnVal[1];
  // 배열이니까 새로운 인덱스에서 시작
  setCounterIndex(counter, 'newIndex');

  // create len array
  var tmpstring = variable.typeDescriptions.typeString;
  tmpstring = tmpstring.split(/[\[]/);

  // Get Array Dimensions
  var dimensions = [];
  for (var i = 1; i < tmpstring.length; i++) {
    tmplen = tmpstring[i].replace(']', '');
    dimensions.push(tmplen);
  }

  var index = 0;
  string = variable.name;
  indexingInnerArray(variable, dimensions, string, index, type, def_id);
}

function indexingInnerArray(variable, dim, string, index, type, def_id) {
  // 스트럭트 정의인지, 변수선언인지에 따라 인덱스 저장할 맵 선택
  returnVal = selectMapCount(type, def_id);
  targetMap = returnVal[0];
  counter = returnVal[1];

  // case of dynamic array
  if (dim[index] == '') {
    tmpstring = string + '[]';
    setCounterIndex(counter, 'dynamicArray');
    addVarToMap(tmpstring, targetMap, counter);

    // case of normal array
  } else {
    for (var i = 0; i < dim[index]; i++) {
      tmpstring = string + '[' + i + ']';

      // 현재 원소의 타입이 배열
      if (index < dim.length - 1) {
        indexingInnerArray(variable, dim, tmpstring, index + 1, type, def_id);
      } else {
        // 현재원소의 타입이 구조체
        if (
          variable.typeName.baseType.typeDescriptions.typeString.split(
            ' '
          )[0] == 'struct'
        ) {
          // struct 정의인 경우
          if (type == 'normal') {
            indexingStruct(variable, 'normal_array', def_id, tmpstring);
          } else if (type == 'structDef') {
            indexingStruct(variable, 'structDef_array', def_id, tmpstring);
          }

          // 현재원소의 타입이 맵핑
        } else if (variable.typeName.baseType.nodeType == 'Mapping') {
          // element의 인덱스 지정
          setCounterIndex(counter, 'newIndex');
          setCounterIndex(counter, 'mapping');
          addVarToMap(tmpstring, targetMap, counter);
        }
        // 현재 원소의 타입이 일반변수 (그외변수)
        else {
          //targetMap[counter.currentIndex] = tmpstring;
          setCounterIndex(
            counter,
            variable.typeName.baseType.typeDescriptions.typeString
          );
          addVarToMap(tmpstring, targetMap, counter);
        }
      }
    }
  }
}

// [구조체]

function indexingStruct(variable, type, def_id, arrayName) {
  // def_id는 정의 스트럭트의 id

  // 변수선언 인경우 -> 스트럭트맵에서 받아와서 인덱싱맵에 저장
  // 스트럭트 id에 해당하는 객체획득
  // 인덱스 적힌대로 안에거 하나씩 집어넣음
  // 근데 스트럭트 id적힌애를 만나면?
  // 다시 스트럭트맵에서 받아와야함

  var prevStructIndex = 0;

  // 변수 선언 : 스트럭트 변수 선언
  if (type == 'normal') {
    var struct_id = variable.typeName.referencedDeclaration;
    var name = variable.name;
    returnVal = selectMapCount('normal', def_id);
    targetMap = returnVal[0];
    counter = returnVal[1];
  } // 타입이 구조체인 배열 변수선언인 경우
  else if (type == 'normal_array') {
    var struct_id = variable.typeName.baseType.referencedDeclaration;
    var name = arrayName;

    returnVal = selectMapCount('normal', def_id);
    targetMap = returnVal[0];
    counter = returnVal[1];
  }
  // 스트럭트 정의 : 스트럭트안의 스트럭트 s -> 스트럭트맵에서 스트럭트 s의 id로 내용 가져옴
  else if (type == 'structDef') {
    var struct_id = variable.typeName.referencedDeclaration;
    var name = variable.name;
    returnVal = selectMapCount('structDef', def_id);
    targetMap = returnVal[0];
    counter = returnVal[1];

    // 스트럭트 정의 : 스트럭트안의 스트럭트타입의 배열
  } else if (type == 'structDef_array') {
    var struct_id = variable.typeName.baseType.referencedDeclaration;
    var name = arrayName;

    returnVal = selectMapCount('structDef', def_id);
    targetMap = returnVal[0];
    counter = returnVal[1];
  }

  // 스트럭트니까 새로운 인덱스에서 시작
  setCounterIndex(counter, 'newIndex');

  // key : structmap에 존재하는 인덱스들
  for (var key in structMap[struct_id]) {
    indexDiff = key - prevStructIndex;
    counter.currentIndex += indexDiff;

    tmpList = [];

    // 인덱스에 존재하는값이 배열이면 풀어서 저장
    if (Array.isArray(structMap[struct_id][key])) {
      structMap[struct_id][key].forEach(function(val) {
        tmpList.push(name + '.' + val);
        prevStructIndex = key;
      });
      targetMap[counter.currentIndex] = tmpList;

      // 아니면 그냥 저장
    } else {
      targetMap[counter.currentIndex] = name + '.' + structMap[struct_id][key];
    }

    prevStructIndex = key;
  }
  // 스트럭트 끝나면 무조건1증가 (무조건 값있는상태)
  counter.currentIndex++;
}
