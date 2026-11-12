import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

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
