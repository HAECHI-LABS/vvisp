module.exports = async function(name) {
  const path = require('path');
  const fs = require('fs-extra');

  try {
    if (fs.readdirSync(path.join('./')).length > 0) {
      throw new Error(
        'There are some files in directory. Please call haechi init at empty directory.'
      );
    }
    main();
  } catch (e) {
    console.log(e);
  }
  function main() {
    fs.ensureDirSync(path.join('./', 'contracts'));

    fs.copySync(path.join(__dirname, '../referenceFiles'), path.join('./'));
    fs.renameSync(path.join('./example.env'), path.join('./.env'));
    fs.renameSync(path.join('./example.service.haechi.json'), path.join('./service.haechi.json'));

    const pkg = fs.readJsonSync(path.join('./package.json'));

    pkg.name = name ? name : path.parse(path.resolve('./')).name;
    fs.writeFileSync(
      path.join('./package.json'),
      JSON.stringify(pkg, null, '  '),
      'utf8'
    );

    fs.copySync(
      path.join(__dirname, '../', 'contracts/upgradeable'),
      path.join('./', 'contracts', 'upgradeable')
    );
    fs.copySync(
      path.join(__dirname, '../', 'contracts/libs'),
      path.join('./', 'contracts', 'libs')
    );

    fs.copySync(
      path.join(__dirname, '../', '.solcover.js'),
      path.join('./.solcover.js')
    );
    fs.copySync(
      path.join(__dirname, '../', '.soliumrc.json'),
      path.join('./.soliumrc.json')
    );
    fs.copySync(
      path.join(__dirname, '../', '.soliumignore'),
      path.join('./.soliumignore')
    );
  }
};
