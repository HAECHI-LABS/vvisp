const commander = require('commander');

commander.Command.prototype.addSilentOption = function() {
  return this.option('-s, --silent', 'do not print logs');
};

commander.Command.prototype.addCustomConfigOption = function() {
  return this.option(
    '--configFile <fileName>',
    'specify custom config file to be used, e.g. custom-config.js'
  );
};

commander.Command.prototype.addNetworkOption = function() {
  return this.addCustomConfigOption()
    .option(
      '-n, --network <network>',
      'choose network to be used in config.networks'
    )
    .option(
      '-p, --platform <platform>',
      'choose platform to be used in config.networks'
    )
    .option(
      '--from <privateKey>',
      'specify privateKey to use this time, you can also define in config file'
    )
    .option(
      '--gasLimit <gasLimit>',
      'specify gasLimit to use this time, you can also define in config file'
    )
    .option(
      '--gasPrice <gasPrice>',
      'specify gasPrice to use this time, you can also define in config file'
    );
};
