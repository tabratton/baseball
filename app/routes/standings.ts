import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type WinDifferential from 'baseball/models/win-differential';
import type MlbApiService from 'baseball/services/mlb-api';
import type { Standings as StandingsData } from 'baseball/services/mlb-api';
import type { SeriesSummary } from 'baseball/types/mlb-api';

export interface StandingsModel {
  regularSeasonInterval?: Interval;
  postSeasonInterval?: Interval;
  standings?: StandingsData;
  winDifferentials?: WinDifferential[];
  postSeason?: SeriesSummary[];
}

export default class Standings extends Route {
  @service declare mlbApi: MlbApiService;

  queryParams = {
    date: {
      refreshModel: true,
    },
  };

  async model(params: { date?: string }): Promise<StandingsModel> {
    const date = params.date || Temporal.Now.plainDateISO().toString();
    const year = date.split('-')[0] ?? '';
    const {
      regularSeasonStartDate,
      regularSeasonEndDate,
      postSeasonStartDate,
      postSeasonEndDate,
    } = await this.mlbApi.getSeasonData(year);
    const selectedDate = Temporal.PlainDate.from(date);
    const regularSeasonInterval = new Interval(
      Temporal.PlainDate.from(regularSeasonStartDate),
      Temporal.PlainDate.from(regularSeasonEndDate),
    );
    const postSeasonInterval = new Interval(
      Temporal.PlainDate.from(postSeasonStartDate),
      Temporal.PlainDate.from(postSeasonEndDate),
    );

    if (postSeasonInterval.contains(selectedDate)) {
      return this.mlbApi
        .fetchPostSeasonData(selectedDate)
        .then((postSeasonData) => ({
          regularSeasonInterval,
          postSeasonInterval,
          postSeason: postSeasonData,
        }))
        .catch((): StandingsModel => ({ postSeason: [] }));
    } else if (regularSeasonInterval.contains(selectedDate)) {
      return Promise.all([
        this.mlbApi.fetchStandings(date, 'regularSeason'),
        this.mlbApi.fetchWinDifferentials(regularSeasonStartDate, date),
      ]).then(([standings, winDifferentials]) => ({
        regularSeasonInterval,
        postSeasonInterval,
        standings,
        winDifferentials,
      }));
    } else {
      return {};
    }
  }
}

export class Interval {
  date1: Temporal.PlainDate;
  date2: Temporal.PlainDate;

  constructor(date1: Temporal.PlainDate, date2: Temporal.PlainDate) {
    this.date1 = date1;
    this.date2 = date2;
  }

  contains(date: Temporal.PlainDate) {
    const afterBegin = Temporal.PlainDate.compare(date, this.date1) >= 0;
    const beforeEnd = Temporal.PlainDate.compare(date, this.date2) <= 0;
    return afterBegin && beforeEnd;
  }
}
