import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import t from 'ember-intl/helpers/t';
import { resource, use } from 'ember-resources';
import and from 'ember-truth-helpers/helpers/and';
import eq from 'ember-truth-helpers/helpers/eq';

import gameRefresher from '../modifiers/game-refresher';

import DatePicker from './date-picker';
import Loading from './loading';
import Scorebug from './scorebug';
import { TrackedObject } from 'tracked-built-ins';

export default class ScorebugList extends Component {
  <template>
    <div class="mt-4">
      <DatePicker @date={{@date}} @onUpdate={{@onUpdate}} />
    </div>
    <div class="rounded" ...attributes>
      <Loading class="mt-4" @loading={{this.data.loading}}>
        {{#each this.inProgress as |g|}}
          <Scorebug @game={{g}} {{gameRefresher g}} />
        {{/each}}
        {{#each this.notInProgress as |g|}}
          <Scorebug @game={{g}} {{gameRefresher g}} />
        {{/each}}
        {{#if
          (and (eq this.inProgress.length 0) (eq this.notInProgress.length 0))
        }}
          {{t "scorebug.list.no_games"}}
        {{/if}}
      </Loading>
    </div>
  </template>

  @service mlbApi;

  @tracked games;

  @use data = resource(() => {
    const state = new TrackedObject({
      value: [],
      loading: true,
    });
    this.mlbApi
      .fetchGamesForDay(this.args.date)
      .then((games) => (state.value = games))
      .catch(() => (state.value = []))
      .finally(() => (state.loading = false));
    return state;
  });

  @cached
  get scorebugGames() {
    return this.data.value
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
