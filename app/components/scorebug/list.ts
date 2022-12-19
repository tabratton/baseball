import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { compareAsc } from 'date-fns';
import { task } from 'ember-concurrency';

import { notEmpty } from 'baseball/utils/typescriptNotEmpty';

import type Game from 'baseball/models/Game';
import type MlbApi from 'baseball/services/mlb-api';

interface ScorebugListArgs {
  date: Date;
}

export default class ScorebugList extends Component<ScorebugListArgs> {
  @service declare mlbApi: MlbApi;

  @tracked loading = false;
  @tracked games: Game[] | undefined;

  getData = task({ restartable: true }, async () => {
    this.loading = true;

    try {
      this.games = await this.mlbApi.fetchGamesForDay(this.args.date);
    } catch (ex) {
      this.games = [];
    } finally {
      this.loading = false;
    }
  });

  get scorebugGames() {
    return this.games
      ?.filter(notEmpty)
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
