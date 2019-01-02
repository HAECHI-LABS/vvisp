const commander = require('commander');
const { version } = require('../package.json');
const commands = require('../commands');
const chalk = require('chalk');

commands.forEach(command => command.register(commander));
const maxLength = Math.max(
  ...commands.map(command => command.signature.length)
);

commander
  .name('vvisp')
  .usage('<command> [options]')
  .description(
    `where <command> is one of: ${commands.map(c => c.name).join(', ')}`
  )
  .version('v' + version, '-v, --version')
  .option('-s, --silent', 'do not print logs')
  .on('--help', () =>
    commands.forEach(c =>
      console.log(
        `   ${chalk.bold(c.signature.padEnd(maxLength))}\t${c.description}\n`
      )
    )
  );

module.exports = commander;
