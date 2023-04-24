import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LeagueLeadersRoute extends Route {
  queryParams = {
    stat: {
      refreshModel: true,
    },
  };

  @service mlbApi;

  model({ stat }) {
    return this.mlbApi.fetchLeagueLeaders(stat);
  }
}
