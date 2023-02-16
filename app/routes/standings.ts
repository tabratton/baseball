import Route from '@ember/routing/route';

import { format } from 'date-fns';

import { inject as service } from '@ember/service';
import MlbApi from 'baseball/services/mlb-api';

export default class Standings extends Route {
  @service declare mlbApi: MlbApi;

  queryParams = {
    date: {
      refreshModel: true,
    },
  };

  async model(params: { date?: string }): Promise<unknown> {
    const winDifferentials = await this.mlbApi.fetchWinDifferentials(
      params.date?.split('-')[0] || format(new Date(), 'y')
    );
    const standings = await this.mlbApi.fetchStandings(
      params.date || format(new Date(), 'y-MM-dd'),
      'regularSeason'
    );
    return {
      standings,
      winDifferentials,
    };
  }
}
