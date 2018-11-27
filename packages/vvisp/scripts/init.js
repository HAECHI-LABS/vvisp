module.exports = async function(name, options) {
  const path = require('path');
  const fs = require('fs-extra');
  const chalk = require('chalk');

  const { printOrSilent } = require('@haechi-labs/vvisp-utils');

  const PACKAGE_JSON = path.join(__dirname, '../package.json');

  try {
    if (fs.readdirSync(path.join('./')).length > 0) {
      throw new Error(
        'There are some files in directory. Please call vvisp init at empty directory.'
      );
    }
    main();
  } catch (e) {
    console.log(e);
  }
  function main() {
    printLogo(options);

    printInitialMsg(options);

    initializeDirectory();

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

  function initializeDirectory() {
    fs.ensureDirSync(path.join('./', 'contracts'));

    fs.copySync(path.join(__dirname, '../referenceFiles'), path.join('./'));
    fs.renameSync(path.join('./example.env'), path.join('./.env'));
    fs.renameSync(
      path.join('./example.service.vvisp.json'),
      path.join('./service.vvisp.json')
    );

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
  }

  function printEndMsg(options) {
    const packageJson = fs.readJsonSync(PACKAGE_JSON);
    printOrSilent(`${chalk.green('Success')} Initializing Directory!`, options);
    printOrSilent('', options);
    printOrSilent(
      `  Run ${chalk.bold.cyan(
        'vvisp -h'
      )} for more information on specific commands.`,
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
