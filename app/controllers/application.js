import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import './application.css';

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
