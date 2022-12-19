import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type RouterService from '@ember/routing/router-service';
import type Game from 'baseball/models/Game';

import './scorebug.css';

interface ScorebugArgs {
  game: Game;
  disableClick: boolean;
}

export default class Scorebug extends Component<ScorebugArgs> {
  @service declare router: RouterService;

  @tracked playerInfoExpanded = false;

  @action
  goToBoxScore() {
    this.router.transitionTo('boxscore', this.args.game.gamePk);
  }
}
