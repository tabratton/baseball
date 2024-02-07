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
  });

  // const { Webpack } = require('@embroider/webpack');
  // return require('@embroider/compat').compatBuild(app, Webpack, {
  //   staticAddonTestSupportTrees: true,
  //   staticAddonTrees: true,
  //   staticHelpers: true,
  //   staticModifiers: true,
  //   staticComponents: true,
  //   staticEmberSource: true,
  //   skipBabel: [
  //     {
  //       package: 'qunit',
  //     },
  //   ],
  // });

  return app.toTree();
};
