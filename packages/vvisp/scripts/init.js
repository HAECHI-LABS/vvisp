module.exports = async function(name, options) {
  const path = require('path');
  const fs = require('fs-extra');
  const chalk = require('chalk');

  const { printOrSilent } = require('@haechi-labs/vvisp-utils');

  const PACKAGE_JSON = path.join(__dirname, '../package.json');

  let rootDir = path.join('./');
  if (options && options.directory) {
    rootDir = path.join(options.directory);
  }

  if (fs.readdirSync(rootDir).length > 0) {
    throw new Error(
      'There are some files in directory. Please call vvisp init at empty directory.'
    );
  } else {
    main(rootDir);
  }

  function main(rootDir) {
    printLogo(options);

    printInitialMsg(options);

    initializeDirectory(options, rootDir);

    printEndMsg(options);
  }

  function printLogo(options) {
    printOrSilent('', options);
    printOrSilent(
      chalk.hex('#267cce')(
        `
   ___      ___ ___      ___ ___  ________  ________   
  |\\  \\    /  /|\\  \\    /  /|\\  \\|\\   ____\\|\\   __  \\  
  \\ \\  \\  /  / | \\  \\  /  / | \\  \\ \\  \\___|\\ \\  \\|\\  \\ 
   \\ \\  \\/  / / \\ \\  \\/  / / \\ \\  \\ \\_____  \\ \\   ____\\
    \\ \\    / /   \\ \\    / /   \\ \\  \\|____|\\  \\ \\  \\___|
     \\ \\__/ /     \\ \\__/ /     \\ \\__\\____\\_\\  \\ \\__\\   
      \\|__|/       \\|__|/       \\|__|\\_________\\|__|   
                                    \\|_________|    
        `
      ),
      options
    );
    printOrSilent('', options);
  }

  function printInitialMsg(options) {
    const packageJson = fs.readJsonSync(PACKAGE_JSON);
    printOrSilent(
      chalk.bold(`${packageJson.name} v${packageJson.version}`),
      options
    );
    printOrSilent(`  ${packageJson.description}`, options);
    printOrSilent('', options);
    printOrSilent(`Initializing Directory...`, options);
  }

  function initializeDirectory(options, rootDir) {
    fs.ensureDirSync(path.join(rootDir, 'contracts'));

    fs.copySync(path.join(__dirname, '../referenceFiles'), rootDir);
    fs.renameSync(
      path.join(rootDir, 'example.env'),
      path.join(rootDir, '.env')
    );
    fs.renameSync(
      path.join(rootDir, 'example.service.vvisp.json'),
      path.join(rootDir, 'service.vvisp.json')
    );
    fs.renameSync(
      path.join(rootDir, 'example.gitignore'),
      path.join(rootDir, '.gitignore')
    );

    const pkg = fs.readJsonSync(path.join(rootDir, 'package.json'));

    pkg.name = name ? name : path.parse(path.resolve(rootDir)).name;
    fs.writeFileSync(
      path.join(rootDir, 'package.json'),
      JSON.stringify(pkg, null, '  '),
      'utf8'
    );

    fs.copySync(
      path.join(__dirname, '../', 'contracts/upgradeable'),
      path.join(rootDir, 'contracts', 'upgradeable')
    );
    fs.copySync(
      path.join(__dirname, '../', 'contracts/libs'),
      path.join(rootDir, 'contracts', 'libs')
    );
  }

  function printEndMsg(options) {
    const packageJson = fs.readJsonSync(PACKAGE_JSON);
    printOrSilent(`Initializing Directory ${chalk.green('Success')}!`, options);
    printOrSilent('', options);
    printOrSilent(
      `  Run ${chalk.bold.cyan('vvisp -h')} for more information`,
      options
    );
    printOrSilent(
      `  Clone ${chalk.bold(packageJson.repository.url)} for ${chalk.green(
        'Contributing!'
      )}`,
      options
    );
  }
};
