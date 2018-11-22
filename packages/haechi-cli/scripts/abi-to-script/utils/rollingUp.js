module.exports = async function(targetDir, jsDir, name) {
  const rollup = require('rollup');
  const regenerator = require('rollup-plugin-regenerator');
  const babel = require('rollup-plugin-babel');
  const path = require('path');
  const fs = require('fs-extra');

  const bundle = await rollup.rollup({
    input: path.join(jsDir, name + '.js'),
    plugins: [
      babel({
        babelrc: false,
        exclude: ['external-helpers'],
        presets: [['env', { loose: true, modules: false }]]
      }),
      regenerator()
    ]
  });

  const cjsCode = (await bundle.generate({
    format: 'cjs',
    sourcemap: false
  })).code;
  const esCode = (await bundle.generate({
    format: 'es',
    sourcemap: false
  })).code;

  fs.writeFileSync(path.join(targetDir, `${name}.js`), cjsCode);
  fs.writeFileSync(path.join(targetDir, `${name}.es.js`), esCode);
};
