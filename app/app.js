import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'baseball/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

import './app.css';
import './fontawesome';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

// TODO: alternate table colors, better color scheme (steal ochre?)
//  post season support, use resources?
