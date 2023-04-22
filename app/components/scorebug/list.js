import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { compareAsc } from 'date-fns';
import { task } from 'ember-concurrency';

export default class ScorebugList extends Component {
  @service mlbApi;

  @tracked games;

  getData = task({ restartable: true }, async () => {
    return this.mlbApi
      .fetchGamesForDay(this.args.date)
      .then((games) => games)
      .catch(() => []);
  });

  get scorebugGames() {
    return this.getData.last?.value
      ?.filter((v) => v)
      .sort((a, b) => compareAsc(a.gameTime, b.gameTime));
  }

  get inProgress() {
    return this.scorebugGames
      ?.filter((game) => game.inProgress)
      ?.sort((a, b) =>
        a.inning > b.inning ? 1 : a.inning === b.inning ? 0 : -1
      );
  }

  get notInProgress() {
    return this.scorebugGames?.filter((game) => !game.inProgress);
  }
}

// TODO: Auto refresh data if not all games are over
