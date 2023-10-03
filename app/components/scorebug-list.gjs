import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { task } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import t from 'ember-intl/helpers/t';
import and from 'ember-truth-helpers/helpers/and';
import eq from 'ember-truth-helpers/helpers/eq';

import gameRefresher from '../modifiers/game-refresher';

import DatePicker from './date-picker';
import Loading from './loading';
import Scorebug from './scorebug';

export default class ScorebugList extends Component {
  <template>
    <div class="mt-4">
      <DatePicker @date={{@date}} @onUpdate={{@onUpdate}} />
    </div>
    <div
      class="rounded"
      ...attributes
      {{didInsert (perform this.getData)}}
      {{didUpdate (perform this.getData) @date}}
    >
      <Loading class="mt-4" @loading={{this.getData.isRunning}}>
        {{#each this.inProgress as |g|}}
          <Scorebug @game={{g}} {{gameRefresher g}} />
        {{/each}}
        {{#each this.notInProgress as |g|}}
          <Scorebug @game={{g}} {{gameRefresher g}} />
        {{/each}}
        {{#if (and (eq this.inProgress.length 0) (eq this.notInProgress.length 0))}}
          {{t "scorebug.list.no_games"}}
        {{/if}}
      </Loading>
    </div>
  </template>

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
      .sort((a, b) => a.gameTime > b.gameTime);
  }

  get inProgress() {
    return this.scorebugGames
      ?.filter((game) => game.inProgress)
      ?.sort((a, b) =>
        a.inning > b.inning ? 1 : a.inning === b.inning ? 0 : -1,
      );
  }

  get notInProgress() {
    return this.scorebugGames?.filter((game) => !game.inProgress);
  }
}
