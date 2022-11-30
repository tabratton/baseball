import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type RouterService from '@ember/routing/router-service';
import { MappedScorebug } from 'baseball/interfaces/MappedScorebug';

import './scorebug.css';

interface ScorebugArgs {
  game: MappedScorebug;
}

export default class Scorebug extends Component<ScorebugArgs> {
  @service declare router: RouterService;

  @tracked playerInfoExpanded = false;

  @action
  goToBoxScore() {
    this.router.transitionTo('game', this.args.game.gamePk);
  }
}
