import Application from '@ember/application';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';
import compatModules from '@embroider/virtual/compat-modules';
import loadInitializers from 'ember-load-initializers';
import Resolver from 'ember-resolver';

import config from './config/environment';

import { setConfig } from 'ember-basic-dropdown/config';

setConfig({
  rootElement: config.APP.rootElement,
});

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

import './app.css';
import './fontawesome';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
  inspector = setupInspector(this);
}

loadInitializers(App, config.modulePrefix, compatModules);

// TODO: alternate table colors, better color scheme (steal ochre?)
//  post season support, use resources?
