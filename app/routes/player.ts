import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Transition from '@ember/routing/transition';

import type PlayerController from 'baseball/controllers/player';
import type PlayerModel from 'baseball/models/player';
import type MlbApiService from 'baseball/services/mlb-api';

export default class Player extends Route<PlayerModel> {
  @service declare mlbApi: MlbApiService;

  model(params: { player_id: string }) {
    return this.mlbApi.fetchPlayer(params.player_id);
  }

  setupController(
    controller: PlayerController,
    model: PlayerModel,
    transition: Transition,
  ) {
    super.setupController(controller, model, transition);
    controller.selectedTab = controller.hasPitchingStats
      ? 'pitching'
      : 'hitting';
  }
}
