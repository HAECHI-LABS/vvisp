const commander = require('commander');

commander.Command.prototype.addCustomConfigOption = function() {
  return this.option(
    '--configFile <fileName>',
    'Specify custom config file to be used, e.g. custom-config.js'
  );
};

commander.Command.prototype.addNetworkOption = function() {
  return this.addCustomConfigOption()
    .option(
      '-n, --network <network>',
      'Choose network to be used in config.networks'
    )
    .option(
      '--from <privateKey>',
      'Specify privateKey to use this time, you can also define in config file'
    )
    .option(
      '--gasLimit <gasLimit>',
      'Specify gasLimit to use this time, you can also define in config file'
    )
    .option(
      '--gasPrice <gasPrice>',
      'Specify gasPrice to use this time, you can also define in config file'
    );
};
