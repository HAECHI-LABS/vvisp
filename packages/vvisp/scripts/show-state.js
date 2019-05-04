

module.exports = async function(address, options) {
    
    console.log(`Address: ${address}`);
    if (options.source) {
        var path = options.source;
        console.log(`Source: ${path}`);


        var fs = require('fs');

        // var ast = require('./test.json');
        // console.log(ast);
        // var res = parser(data);
        // console.log(res);

        fs.readFile('./test.json', 'utf8', function(err, data){
            var jdata = JSON.parse(data)
            //console.log(jdata)
            var res = parser(jdata);
            console.log(res);
        });

        //var ast = require('./testast.json');
        
        
        // var fs = require('fs');
        // fs.readFile(path, 'utf8', function(err, data){
        //     //console.log(data);
        //     var fullpath = process.cwd() + '\\' + path;
        //     console.log(process.cwd());
        //     var exec = require('child_process').execFile;
        //     var fun = function() {
        //         console.log("fun() start");
        //         // exec('./solc.exe ' + path + ' --ast', function(err, data) {  
        //         //     console.log(err)
        //         //     console.log(data.toString());                       
        //         // });  
        //         exec('cd ' + `"${__dirname}"` + '&& .\\solc.exe ' + fullpath + ' --ast', function(err, data) {  
        //                 console.log(err)
        //                 console.log(data.toString());                       
        //         });  
        //     }
        //     fun();
            // var input = {
            //     language: 'Solidity',
            //     sources: {
            //         path: {
            //             content: data
            //         }
            //     },
            //     settings: {
            //         outputSelection: {
            //             '*': {
            //                 '*': [ 'abi' ] 
            //             }
            //         }
            //     }
            // }

            // var output = JSON.parse(solc.compile(JSON.stringify(input)));
            // // `output` here contains the JSON output as specified in the documentation
            // // for (var contractName in output.contracts['test.sol']) {
            // //     console.log(contractName + ': ' + output.contracts['test.sol'][contractName].evm.bytecode.object)
            // // }
            // console.log(output);
            // console.log(output.contracts.path.Test);
        // });

    }
    

    


};

var parser = function(ast_json) {
    var output = ast_json;


    var indexMap = {};
    // or remove it
    //delete map[key1];
    // or determine whether a key exists
    //key1 in map;
    //indexMap[key1] = value1;

    var count = 0;


    var Table = require('cli-table');
    




    // Entry Point
    output.ast.nodes[0].nodes.forEach(function(v) {
    checkType(v);
    }
    );


    function checkType(v, isStruct)
    {
    if(v.nodeType=="VariableDeclaration")
    {
        indexingVariable(v, isStruct);
    }
    else if(v.nodeType=="StructDefinition")
    {
        indexingStruct(v)
    }
    }

    /*
    function checkType(v, isStruct)
    {
    if(v.typeName.nodeType =="ElementaryTypeName")
    {
        indexingVariable(v, isStruct);
    }
    else if(v.typeName.nodeType == "ArrayTypeName")
    {
        indexingArray(v);
    }
    else if(v.nodeType=="StructDefinition")
    {
        indexingStruct(v)
    }
    }
    */

    function indexingVariable(v, isStruct)
    {
    // array type
    if(v.typeName.nodeType == "ArrayTypeName")
    {
        indexingArray(v);
    }
    // element type
    else
    {
        if (isStruct == null){
        indexMap[count] = v.name;  
        }else{
        indexMap[count] = isStruct+ "." + v.name;
        }
        count++;

    }
    }


    function indexingStruct(v)
    {
    
    v.members.forEach(function(v2)
    {
        checkType(v2, v.name);
    })
    }






    function indexingArray(v)
    {

    var tmpstring = v.typeDescriptions.typeString;

    tmpstring = tmpstring.split(/[\[\]]/);
    
    var type = tmpstring[0];

    // Get Array Dimensions
    var dimensions = [];
    for(var i=1; i<tmpstring.length; i++)
    {
        if(tmpstring[i] != "")
        {
        dimensions.push(tmpstring[i]);
        }
    }

    
    var index = 0;
    string = v.name;
    indexingInnerArray(v, dimensions, string, index);

    }

    function indexingInnerArray(v, dim, string, index)
    {
  
  
    for(var i=0; i<dim[index]; i++){
        tmpstring = string + "[" + i + "]"
        
        if(index < dim.length-1){
        indexingInnerArray(v,dim, tmpstring, index+1)
        }else{
        indexMap[count] = tmpstring
        count++;
        }
    }

    
    }






    // instantiate
    var table = new Table({
    head: ['VARIABLE', 'INDEX', 'VALUE']
    , colWidths: [25, 25, 25]
    });





    keys = Object.keys(indexMap)

    keys.forEach(function(k){
    table.push(
        [indexMap[k],k]
    );
    
    })

    return table.toString();




    /*

    어떤타입인지 보는함수




    구조체
    - 일반변수?
    - 배열?
    - 구조체?

    배열
    - 일반변수?
    - 배열?
    - 구조체?

    */


}