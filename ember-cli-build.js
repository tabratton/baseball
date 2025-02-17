'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-composable-helpers': {
      only: ['find-by'],
    },
    'ember-math-helpers': {
      only: ['add', 'mod', 'sub'],
    },
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
  });

  function isProduction() {
    return EmberApp.env() === 'production';
  }

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticInvokables: true,
    staticEmberSource: true,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      // publicAssetURL is used similarly to Ember CLI's asset fingerprint prepend option.
      publicAssetURL: '/',
      // Embroider lets us send our own options to the style-loader
      cssLoaderOptions: {
        // don't create source maps in production
        sourceMap: isProduction() === false,
        // enable CSS modules
        modules: {
          // global mode, can be either global or local
          // we set to global mode to avoid hashing tailwind classes
          mode: 'global',
          // class naming template
          localIdentName: isProduction()
            ? '[sha512:hash:base64:5]'
            : '[path][name]__[local]',
        },
      },
      webpackConfig: {
        module: {
          rules: [
            {
              test: /\.css$/i,
              use: ['postcss-loader'],
            },
          ],
        },
      },
    },
  });

  // return app.toTree();
};
