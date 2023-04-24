import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class Application extends Controller {
  @service router;

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
