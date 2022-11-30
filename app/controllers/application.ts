import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';

import './application.css';

interface Locale {
  label: string;
  value: string;
}

export default class Application extends Controller {
  @service declare router: RouterService;

  @action
  goHome() {
    this.router.transitionTo('/');
  }

  @action
  goToStandings() {
    this.router.transitionTo('standings');
  }

  @action
  goToLeagueLeaders() {
    this.router.transitionTo('league-leaders');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    application: Application;
  }
}
