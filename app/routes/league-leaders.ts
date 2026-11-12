import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type MlbApiService from 'baseball/services/mlb-api';

export default class LeagueLeadersRoute extends Route {
  queryParams = {
    stat: {
      refreshModel: true,
    },
  };

  @service declare mlbApi: MlbApiService;

  model({ stat }: { stat?: string }) {
    return this.mlbApi.fetchLeagueLeaders(stat);
  }
}
