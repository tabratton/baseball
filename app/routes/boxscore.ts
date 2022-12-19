import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';

import { inject as service } from '@ember/service';
import MlbApi from 'baseball/services/mlb-api';

type Transition = ReturnType<RouterService['transitionTo']>;

export default class Boxscore extends Route {
  @service declare mlbApi: MlbApi;

  model(
    params: { game_pk: string },
    transition: Transition
  ): PromiseLike<unknown> | unknown {
    return this.mlbApi.fetchGame(params.game_pk);
  }
}
