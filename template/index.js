const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, 'js'));
const apis = {};
for (let i = 0; i < files.length; i++) {
  if (files[i].slice(-3) === '.js') {
    if (files[i] === 'index.js') {
      continue;
    }
    apis[files[i].slice(0, -3)] = require(`./js/${files[i].slice(0, -3)}.js`);
  }
}

module.exports = apis;
