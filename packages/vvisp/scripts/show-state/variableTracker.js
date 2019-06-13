const Table = require('cli-table3');
const { ASTParser} = require('./astParser');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // <-----To Do: set real url configured by user

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

      var splitedList = input.split('[');
      var name = splitedList[0]
      var existVar = name in this.storageTable.get()

      for(var i=1; i<splitedList.length ;i++){
        if(existVar == false){
          name = name + '[' + splitedList[i]
          existVar = name in this.storageTable.get()
        }
      }
      // case that really doesn't exist
      if (existVar == false) {
        //console.log('The variable does not exist.');
        return -1;

      // case of array, mapping variable
      } else {
        var row = this.storageTable.get()[name];
        var type = row[0];
        var index = row[3];
        // []가 있으면 동적배열 (우선) mapping이 있으면 맵핑
        if (type.indexOf('[]') != -1 || type.indexOf('mapping') != -1) {
          var endIndex = this.parseSequentially(input, type, index);

          if(endIndex == -1){
            return -1
          }


          // type, size, startByte

          
          table.push(row)


        } else {
          // case of input var[4] when real variable is var
          //console.log('Invalid reference : It is not array nor mapping');
          return -1;
        }
      }
    }
    return table;
  }

  parseSequentially(input, type, index) {

    /*
    # Example
    input : var[3][2][1][key2][key1][0]
    dimensions : [0, key1, key2, 1, 2, 3]
    var's type : mapping( int => mapping(string => int[2][3][]) )[]
    typeSeq : ([], mapping, mapping, [2], [3], [])
    */

    var getDimensions = new ASTParser().getDimensions;
    var getTypeSize = new ASTParser().getTypeSize;

    var dimensions = getDimensions(input);

    var typeSeq = this.getTypeSeq(type)
    var typeString =  this.getTypeString(typeSeq, type)
    console.log(typeSeq)
    console.log(typeString)
    
    // error check
    if (dimensions.length > typeSeq.length) {
      console.log('Invalid reference:dimension is too long');
      return -1;
    }
    for (var i = 0; i < dimensions.length; i++) {
      if ((typeSeq[i].indexOf('[') == -1) && (typeSeq.indexOf('mapping') == -1) ) {
          console.log('Invalid reference. : invalid type');
          return -1;
      }
    }



    var indexList = [index]
    var continiousArray = false
    var prevOffsetBytes = 0
    var offset
    var startByte
    // calculate index
    for (i = 0; i < dimensions.length; i++) {

      // case mapping
      // when x is mapping : x[3].index = Hash(x.index, 3)
      if(typeSeq.indexOf('mapping') != -1){
        startByte = 0

         var key = dimensions[i];
         var nextIndex = web3.utils.soliditySha3(String(key), String(indexList[indexList.length-1]));
         indexList.push(nextIndex)

         var continiousArray = false

      }else if(typeSeq.indexOf('[') != -1){
        var size = getTypeSize(typeString[i].split('[')[0])
        console.log(size)
        // case darray
        // when x is darray : x[3].index = HASH(x.index) + 3
        if(typeSeq.indexOf('[]') != -1){
          var baseIndex = web3.utils.soliditySha3(String(indexList[indexList.length-1]));
          var offset = dimensions[i].replace('(','').replace(')','')
          var nextIndex = '0x' + (BigInt(baseIndex) + BigInt(offset)).toString(16);
          indexList.push(nextIndex)

          var continiousArray = false

        // case normal array
        // when x is array : x[3][3].index = x.index+9
        }else{

          // calculate offsetbytes
          offsetBytes = dimensions[i].replace('(','').replace(')','') * size
          if(continiousArray){
            offsetBytes = offsetBytes * prevOffsetBytes;
          }
          prevOffsetBytes = offsetBytes

          offsetIndex = offsetBytes / 32
          startByte = offsetBytes % 32

          // calculate nextIndex
          var nextIndex = indexList[indexList.length-1] + offsetIndex - prevOffsetIndex
          prevOffsetIndex = offsetIndex         

          indexList.push(nextIndex)
          var continiousArray = true
        }
      }
    }


    var endpointType = typeString[typeString.length-1]
    var row = [input, endpointType, getTypeSize(endpointType.split('[')[0]), 0, indexList[indexList.length-1], startByte]

    return row


    



    // 동적 배열일 경우 자식들 보여주기
    // 구조체의 처리
  }

  getTypeSeq(type){
    var mappingSeq = type.split('(');

    if(mappingSeq.length >1){
      if(mappingSeq[0] != 'mapping'){
        console.log("input string is invalid (for mapping)")
        return -1
      }
      for(var i=1; i<mappingSeq.length-1; i++){
        var splitedList = mappingSeq[i].split('>')
        if(splitedList[splitedList.length-1] != ' mapping'){
          console.log("input string is invalid (for mapping)")
          return -1
        }
      }
    }

    var darraySeq = mappingSeq[mappingSeq.length-1].split(')').reverse();
    var typeSeq = [];
    for(var i=0; i<mappingSeq.length; i++){
      // Prior darray than mapping in same position
      
      if(darraySeq[i].indexOf('[') != -1){
        var splitedList = darraySeq[i].split('[');
        for(var j=1; j<splitedList.length ;j++){
          typeSeq.push('[' + splitedList[j])
        }
      }

      var splitedList = mappingSeq[i].split('> ');
      var mappingString = splitedList[splitedList.length-1]
      if(mappingString == 'mapping'){
        typeSeq.push(mappingString)
      }
    }

    return typeSeq;
  }

  getTypeString(typeSeq, type){
    var currentTypeString = type

    var isPrevArray = false
    var isPrevMapping = false

    var typeString = []
    for(var i=0; i<typeSeq.length; i++){
      if(typeSeq[i] == 'mapping'){
        if(isPrevArray){
          var li = currentTypeString.lastIndexOf(')')
          currentTypeString = currentTypeString.slice(0,li+1)
        
        }else if(isPrevMapping){
          var li1 = currentTypeString.indexOf('>')
          var li2 = currentTypeString.lastIndexOf(')')
          currentTypeString = currentTypeString.slice(li1+2, li2)
        }

        typeString.push(currentTypeString)
        isPrevMapping = true
        isPrevArray = false

      }else{
        if(isPrevMapping){
          var li1 = currentTypeString.indexOf('>')
          var li2 = currentTypeString.lastIndexOf(')')
          currentTypeString = currentTypeString.slice(li1+2, li2)
        }
        var li =currentTypeString.lastIndexOf(typeSeq[i]) 
        typeString.push(currentTypeString.slice(0,li))
        isPrevArray = true
        isPrevMapping = false

      }
    }

    return typeString
  }

}

module.exports = VariableTracker;
