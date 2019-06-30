const terser = require('terser');
const glob = require('glob');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

module.exports = (logger, dirname, config) => {

  return () => {

    return new Promise((resolve, reject) => {

      // Validate config
      if ( ! config.dir || ! config.outDir ) return reject(new Error('JS minifier plugin misconfiguration! dir and outDir must be present.'));

      // Empty outDir if necessary
      if ( config.cleanOutDir ) {

        fs.emptyDirSync(path.join(dirname, config.outDir));

      }

      // Search `config.dir` for `.js` files
      glob('**/*.js', { cwd: path.join(dirname, config.dir) }, (error, files) => {

        if ( error ) return reject(error);

        const promises = [];
        const finalOptions = _.cloneDeep(config);

        delete finalOptions.dir;
        delete finalOptions.outDir;
        delete finalOptions.cleanOutDir;
        delete finalOptions.sourceMap;

        logger(`Minifying ${files.length} files...`);

        for ( const file of files ) {

          promises.push(new Promise((resolve, reject) => {

            // Read file
            fs.readFile(path.join(dirname, config.dir, file), { encoding: 'utf8' }, (error, data) => {

              if ( error ) return reject(error);

              // Minify JS
              const result = terser.minify(data, _.assign(_.cloneDeep(finalOptions), config.sourceMap ? {
                sourceMap: {
                  filename: file,
                  url: file + '.map'
                }
              } : {}));

              // Throw error
              if ( result.error ) return reject(new Error(`JS minifier threw the following error:\n${result.error}`));
              if ( result.warnings && result.warnings.length ) logger(`JS minifier threw the following warnings:\n${result.warnings.reduce((a, b) => `${a}\n${b}`)}`);

              // Write to file
              fs.outputFile(path.join(dirname, config.outDir, file), result.code, error => {

                if ( error ) return reject(error);

                // Write source map
                if ( result.map && config.sourceMap ) {

                  fs.outputFile(path.join(dirname, config.outDir, file + '.map'), result.map, error => {

                    if ( error ) return reject(error);

                    resolve();

                  });

                }
                else resolve();

              });

            });

          }));

        }

        Promise.all(promises)
        .then(() => {

          logger(`All ${files.length} files were minified.`);
          resolve();

        })
        .catch(reject);

      });

    });

  };

};
