import { registerDestructor } from '@ember/destroyable';
import { runTask } from 'ember-lifeline';
import Modifier, { type PositionalArgs } from 'ember-modifier';

import type Game from 'baseball/models/game';

interface GameRefresherSignature {
  Element: Element;
  Args: {
    Positional: [game?: Game | null];
  };
}

function cleanup(instance: GameRefresher) {
  instance.game = null;
}

export default class GameRefresher extends Modifier<GameRefresherSignature> {
  game: Game | null = null;

  modify(_element: Element, [game]: PositionalArgs<GameRefresherSignature>) {
    this.game = game ?? null;
    this.refresh();
    registerDestructor(this, cleanup);
  }

  refresh() {
    if (this.game && !this.game.isOver) {
      runTask(
        this,
        'doRefresh',
        (this.game.gameFeed.metaData.wait || 60) * 1000,
      );
    }
  }

  async doRefresh() {
    if (this.game && !this.game.isOver) {
      await this.game.refreshData();
      this.refresh();
    }
  }
}
