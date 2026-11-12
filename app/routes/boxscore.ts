import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type MlbApiService from 'baseball/services/mlb-api';

export default class Boxscore extends Route {
  @service declare mlbApi: MlbApiService;

  model(params: { game_pk: string }) {
    return this.mlbApi.fetchGame(params.game_pk);
  }
}
