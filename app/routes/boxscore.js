import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class Boxscore extends Route {
  @service mlbApi;

  model(params) {
    return this.mlbApi.fetchGame(params.game_pk);
  }
}
