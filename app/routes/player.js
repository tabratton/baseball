import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Player extends Route {
  @service mlbApi;

  model(params) {
    return this.mlbApi.fetchPlayer(params.player_id);
  }
}
