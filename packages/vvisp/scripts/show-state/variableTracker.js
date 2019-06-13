const Table = require('cli-table3');
const { ASTParser} = require('./astParser');
const options = require('../utils/injectConfig')();
const web3 = options.web3


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
          var row = this.parseSequentially(input, type, index);          
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

    
    // error check
    if (dimensions.length > typeSeq.length) {
      //console.log('Invalid reference:dimension is too long');
      return -1;
    }
    for (var i = 0; i < dimensions.length; i++) {
      if ((typeSeq[i].indexOf('[') == -1) && (typeSeq.indexOf('mapping') == -1) ) {
          //console.log('Invalid reference. : invalid type');
          return -1;
      }else if(typeSeq[i].indexOf('[') != -1){
        if(isNaN(dimensions[i])){
          console.log('Invalid reference : array cannot reference using NaN')
          return -1;
        }
      }
    }



    var startByte=0
    // calculate index
    for (i = 0; i < dimensions.length; i++) {

      // case mapping
      // when x is mapping : x[3].index = Hash(x.index, 3)
      if(typeSeq[i].indexOf('mapping') != -1){
        startByte=0

         var key = dimensions[i];
         index = web3.utils.soliditySha3(String(key), String(index));

      }else if(typeSeq[i].indexOf('[') != -1){

        var size = getTypeSize(typeString[i])
        // case darray
        // when x is darray : x[3].index = HASH(x.index) + 3
        if(typeSeq.indexOf('[]') != -1){
          console.log(index)
          var baseIndex = web3.utils.soliditySha3(String(index));
          console.log(baseIndex)
          var offset = dimensions[i] * size / 32
          startByte = dimensions[i] * size % 32
          console.log(dimensions[i])
          console.log(offset)
          index = '0x' + (BigInt(baseIndex) + BigInt(offset)).toString(16);
 
        // case normal array
        }else{
          maxDim.push(typeSeq[i])
          targetDim.push(dimensions[i])
          // if next array is not normal array
          if( i==dimensions.length-1 || typeSeq[i+1].indexOf('[') == -1 || typeSeq[i+1].indexOf('[]') != -1){
            var currentDim = []
            for(var j=0; j<targetDim.length; j++){
              currentDim.push(0)
            }
            // add bytes In Slot
            while(this.compare(targetDim ,currentDim)){
              currentDim[0] += 1;
              bytesInSlot += size;
              if (bytesInSlot > 32) {
                bytesInSlot = size;
                index++;
              }

              if(currentDim.length>1){
                // second dimension increased than start in new index
                if(currentDim[0]>=dimList[0]){
                  if (bytesInSlot != 0) {
                    index++;
                    bytesInSlot = 0;
                  }  
                  currentDim[0] = 0
                  currentDim[1] +=1
                }
                // higher dimension
                for(var j=1; j<currentDim.length;j++){
                  if(currentDim[j] >= maxDim[j]){
                    currentDim[j] =0
                    currentDim[j+1] += 1
                  }
                }
              }
            }
          }
          startByte = bytesInSlot
        }
      }
    }

    var endpointType = typeString[i-1]
    var row = [input, endpointType, getTypeSize(endpointType.split('[')[0]), index, startByte]
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
    var typeString = []
    for(var i=0; i<typeSeq.length; i++){
      if(typeSeq[i] == 'mapping'){
        var li1 = currentTypeString.indexOf('>')
        var li2 = currentTypeString.lastIndexOf(')')
        currentTypeString = currentTypeString.slice(li1+2, li2)
        typeString.push(currentTypeString)

      }else{
        var li =currentTypeString.lastIndexOf(typeSeq[i]) 
        typeString.push(currentTypeString.slice(0,li))

      }
    }

    return typeString
  }

  compare(arr1,arr2){
  
    if(!arr1  || !arr2) return
   
     let result;
   
   arr1.forEach((e1,i)=>arr2.forEach(e2=>{
     
          if(e1.length > 1 && e2.length){
             result = compare(e1,e2);
          }else if(e1 !== e2 ){
             result = false
          }else{
             result = true
          }
     })
   )
   
   return result
   
 }

}

module.exports = VariableTracker;
