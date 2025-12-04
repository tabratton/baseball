import { registerDestructor } from '@ember/destroyable';
import { runTask } from 'ember-lifeline';
import Modifier from 'ember-modifier';

function cleanup(instance) {
  instance.game = null;
}

export default class GameRefresher extends Modifier {
  game = null;

  modify(element, [game]) {
    this.game = game;
    this.refresh();
    registerDestructor(this, cleanup);
  }

  refresh() {
    if (this.game && !this.game.isOver) {
      runTask(
        this,
        'doRefresh',
        (this.game.gameFeed.metaData.wait || 60) * 1000
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
