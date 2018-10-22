module.exports = async function(files, options) {
  const {
    getConfigRoot,
    getRelativeFilePathsFromRoot,
    getDependencyFiles,
    getSourceCodeWithoutPragma,
    getMaxVersion
  } = require('../lib');
  const process = require('process');
  const path = require('path');
  const fs = require('fs');

  try {
    const configRootPath = await getConfigRoot('service.haechi.json');
    const relativeFilePaths = await getRelativeFilePathsFromRoot(
      configRootPath,
      files
    );
    process.chdir(configRootPath);

    const allFilePaths = await getDependencyFiles(relativeFilePaths);

    const version = await getMaxVersion(allFilePaths);
    let sourceCode = `pragma solidity ${version};`;

    for (const filePath of allFilePaths) {
      const content = getSourceCodeWithoutPragma(filePath);
      sourceCode += `\n\n//filename: ${filePath}\n`;
      sourceCode += content;
    }

    if (options.output) {
      const outputPath = path.relative(
        configRootPath,
        path.resolve(options.output)
      );
      fs.writeFileSync(outputPath, sourceCode);
      console.log(`${outputPath} is created`);
    } else {
      console.log(`Print the combined source code!\n${sourceCode}`);
    }

    console.log('The flatten is finished!');
  } catch (e) {
    console.error(e);
  }
};
