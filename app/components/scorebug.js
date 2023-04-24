import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import './scorebug.css';

export default class Scorebug extends Component {
  @service router;

  @tracked playerInfoExpanded = false;

  @action
  goToBoxScore() {
    this.router.transitionTo('boxscore', this.args.game.gamePk);
  }
}
