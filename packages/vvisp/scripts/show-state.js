const fs = require('fs');
const Table = require('cli-table3');

module.exports = async function(address, options) {

  console.log(`Address: ${address}`);
  if (options.source) {
    const sourcePath = options.source;
    console.log(`Source: ${sourcePath}`);
    console.log(__dirname);
    console.log(process.cwd());



    //var source = fs.readFileSync(path, 'utf-8');
    var indexTable = parse(compile(sourcePath));

    console.log(indexTable.toString());

    // var fullpath = process.cwd() + '\\' + options.source;
    // console.log(process.cwd());
    // var exec = require('child_process').execFile;
    // var fun = function() {
    //     console.log("fun() start");
    //     // exec('./solc.exe ' + path + ' --ast', function(err, data) {
    //     //     console.log(err)
    //     //     console.log(data.toString());
    //     // });
    //     exec('cd ' + `"${__dirname}"` + '&& .\\solc.exe ' + fullpath + ' --ast', function(err, data) {
    //             console.log(err)
    //             console.log(data.toString());
    //     });
    // }
  }

  function compile(sourcePath) {
    var solcPath = __dirname + '/solc.exe';
    var parameters = ['--ast-compact-json', sourcePath];

    var solcOutput = require('child_process').execFileSync(solcPath, parameters, { encoding: 'utf-8' });
    //solcOutput = JSON.parse(solcOutput);
    console.log(solcOutput);

    var solcOutput = JSON.parse(fs.readFileSync('./test.json', 'utf-8'));

    return solcOutput;
  }

  function parse(solcOutput) {
    var indexMap = {};
    // or remove it
    //delete map[key1];
    // or determine whether a key exists
    //key1 in map;
    //indexMap[key1] = value1;
    var count = 0;

    // Entry Point
    solcOutput.ast.nodes[0].nodes.forEach(function(v) {
      checkType(v);
    });

    function checkType(v, isStruct) {
      if (v.nodeType=="VariableDeclaration") {
          indexingVariable(v, isStruct);
      } else if (v.nodeType=="StructDefinition") {
          indexingStruct(v)
      }
    }

    // function checkType(v, isStruct) {
    //   if (v.typeName.nodeType =="ElementaryTypeName") {
    //     indexingVariable(v, isStruct);
    //   } else if (v.typeName.nodeType == "ArrayTypeName") {
    //     indexingArray(v);
    //   } else if (v.nodeType=="StructDefinition") {
    //     indexingStruct(v)
    //   }
    // }

    function indexingVariable(v, isStruct) {
      if (v.typeName.nodeType == "ArrayTypeName") { // array type
          indexingArray(v);
      } else { // element type
        if (isStruct == null) {
          indexMap[count] = v.name;
        } else {
          indexMap[count] = isStruct+ "." + v.name;
        }
        count++;
      }
    }

    function indexingStruct(v) {
      v.members.forEach(function(v2) {
        checkType(v2, v.name);
      });
    }

    function indexingArray(v) {
      var tmpstring = v.typeDescriptions.typeString;
      tmpstring = tmpstring.split(/[\[\]]/);
      var type = tmpstring[0];

      // Get Array Dimensions
      var dimensions = [];
      for (var i = 1; i < tmpstring.length; i++) {
        if (tmpstring[i] != "") {
          dimensions.push(tmpstring[i]);
        }
      }

      var index = 0;
      string = v.name;
      indexingInnerArray(v, dimensions, string, index);
    }

    function indexingInnerArray(v, dim, string, index) {
      for (var i = 0; i < dim[index]; i++) {
        tmpstring = string + "[" + i + "]"
        if (index < dim.length - 1) {
          indexingInnerArray(v,dim, tmpstring, index + 1)
        } else {
          indexMap[count] = tmpstring
          count++;
        }
      }
    }

    // instantiate
    var table = new Table({
      head: ['VARIABLE', 'INDEX', 'VALUE'],
      colWidths: [25, 25, 25]
    });

    keys = Object.keys(indexMap)
    keys.forEach(function(k) {
      table.push([indexMap[k],k]);
    })

    return table;
  }
};


