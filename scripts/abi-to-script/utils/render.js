module.exports = function(json, jsPath, templatePath) {
  const Mustache = require('mustache');
  const fs = require('fs-extra');

  fs.writeFileSync(
    jsPath,
    Mustache.render(fs.readFileSync(templatePath).toString(), json)
  );
};
