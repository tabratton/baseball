import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class Player extends Route {
  @service mlbApi;

  model(params) {
    return this.mlbApi.fetchPlayer(params.player_id);
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.selectedTab = controller.hasPitchingStats
      ? 'pitching'
      : 'hitting';
  }
}
