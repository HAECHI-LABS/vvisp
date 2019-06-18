'use strict';
const { compilerSupplier } = require('@haechi-labs/vvisp-utils');
const fs = require('fs');
const chalk = require('chalk');

async function compile(srcPath) {
  
    const DEFAULT_COMPILER_VERSION = '0.5.0'; // <------- integrate with compile.js
  
    const supplier = new compilerSupplier({
      version: DEFAULT_COMPILER_VERSION
    });
    const solc = await supplier.load();
    const inputDescription = JSON.stringify({
      language: 'Solidity',
      sources: {
        [srcPath]: {
          content: fs.readFileSync(srcPath, 'utf-8')
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '': ['ast']
          }
        }
      }
    });
    const solcOutput = solc.compile(inputDescription);
    
    return JSON.parse(solcOutput);
  }
  
  function getLinearContractIds(ast, targetContract) {
    return ast.nodes
      .find(node => node.name == targetContract)
      .linearizedBaseContracts.reverse();
  }
  
  function getContractNodesById(solcOutput) {
    return Object.values(solcOutput.sources).reduce((acc, src) => {
      src.ast.nodes
        .filter(node => node.nodeType == 'ContractDefinition')
        .forEach(node => (acc[node.id] = node));
      return acc;
    }, {});
  }
  
  function flexTable(table) {
    table.options.head = table.options.head
      .map(str => str.toLowerCase())
      .map(str => chalk.cyanBright.bold(str));
    table.options.colWidths = [];
    table.options.chars['left-mid'] = '';
    table.options.chars['mid'] = '';
    table.options.chars['right-mid'] = '';
    table.options.chars['mid-mid'] = '';

    // remove long prefix 0s
    for(var i=0; i<table.length; i++){
      var value = table[i][5];
      if(typeof(value) == 'string'){
        while(value.startsWith('0x00')){
          value = value.replace('0x00', '0x0')
        }
        table[i][5] = value  
      }
    }
  }
  
  
  async function addVariableValue(storageTable, address, web3) {
    for (let i = 0; i < storageTable.length; i++) {
      var type = storageTable[i][1];
      var size = storageTable[i][2];
      var index = storageTable[i][3];
      var startByte = storageTable[i][4];
      var hexValue = await web3.eth.getStorageAt(address, index);
  
      hexValue = hexValue.replace("0x", "")
      hexValue = hexValue.padStart(64, "0");
      var hexLen = hexValue.length
      var value = hexValue.slice(hexLen-2*startByte-2*size, hexLen-2*startByte)
      // hex formatting
      if(value.indexOf('0x') == -1){
        value = '0x' + value;
      }

      // type converting
      if(type.indexOf('function') == -1 && type.indexOf('mapping') == -1){
        if (type.indexOf('uint') != -1) {
          value = parseInt(value, 16).toString()
  
        }else if(type.indexOf('int') != -1){
          size = parseInt(type.split('t')[1]) / 8;
          if (isNaN(size)) {
            size = 32;
          }
          value = hexToSignedInt(value, size)
  
        }else if(type =='bool' ){
          value = parseInt(value, 16)
          if(value ==0){
            value = 'false'
          }else if(value ==1){
            value = 'true'
          }
        }else if(type == 'string'){
          value = value.slice(0, value.length-1)
          var j;
          for(j=value.length-1; j>=0; j--){
            if(value[j] !=0){
              break;
            }
          }
          value = value.slice(0,j+1)
          value = hex2a(value)
        }  
      }
  
      storageTable[i].push(value);
    }
    return storageTable
  }
  


function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
  
  function hexToSignedInt(hex, size) {
    var val = {
        mask: 0x80 * Math.pow(2, 8*(size-1)), 
        sub: -0x100 * Math.pow(2, 8*(size-1)) 
    }

    var num;
    // big int case
    if(size>=26){
      num = BigInt(hex)
      val.mask = BigInt(val.mask)
      val.sub = BigInt(val.sub)
    }else{
      num = parseInt(hex,16)
    }

    if((num & val.mask) != 0) { //negative
      return (val.sub + num).toString()
    }else {                                 //positive
      return num.toString();
    }
  }

  module.exports ={
      compile : compile,
      getLinearContractIds : getLinearContractIds,
      getContractNodesById : getContractNodesById,
      flexTable : flexTable,
      addVariableValue : addVariableValue
  }
