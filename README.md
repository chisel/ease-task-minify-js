# Ease Task Runner JS Minifier Plugin

This is a plugin for the [Ease task runner](https://github.com/chisel/ease). It uses the [terser](https://www.npmjs.com/package/terser) module to minify JS files.

# Installation

```
npm install ease-task-minify-js --save-dev
```

**easeconfig.js:**
```js
const minifyJs = require('ease-task-minify-js');

module.exports = ease => {

  ease.install('minify-js', minifyJs, {});

};
```

# Configuration

This plugin takes a config object similar to [Terser Minify Options](https://www.npmjs.com/package/terser#minify-options) while ignoring the property `sourceMap` and adding the following properties:
  - `dir`: Path to a directory containing all the SASS files, relative to `easeconfig.js`
  - `outDir`: Path to the output directory where the CSS files should be written, relative to `easeconfig.js`
  - `clearOutDir`: Boolean indicating if the output directory should be emptied first
  - `sourceMap`: Boolean indicating if source maps should be generated (will automatically generate the source map options for each file)

# Example

**easeconfig.js:**
```js
const minifyJs = require('ease-task-minify-js');

module.exports = ease => {

  ease.install('minify-js', minifyJs, {
    dir: 'css',
    outDir: 'css',
    clearOutDir: false,
    sourceMap: true,
    mangle: {
      toplevel: true
    }
  });

  ease.job('minify-js-files', ['minify-js']);

};
```

**CLI:**
```
ease minify-js-files
```
