import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { DateTime, Interval } from 'luxon';

export default class Standings extends Route {
  @service mlbApi;

  queryParams = {
    date: {
      refreshModel: true,
    },
  };

  async model(params) {
    const date = params.date || DateTime.now().toFormat('y-MM-dd');
    const year = date.split('-')[0];
    const {
      regularSeasonStartDate,
      regularSeasonEndDate,
      postSeasonStartDate,
      postSeasonEndDate,
    } = await this.mlbApi.getSeasonData(year);
    const selectedDate = DateTime.fromISO(date);
    const regularSeasonInterval = Interval.fromDateTimes(
      DateTime.fromISO(regularSeasonStartDate),
      DateTime.fromISO(regularSeasonEndDate),
    );
    const postSeasonInterval = Interval.fromDateTimes(
      DateTime.fromISO(postSeasonStartDate),
      DateTime.fromISO(postSeasonEndDate),
    );

    if (postSeasonInterval.contains(selectedDate)) {
      return this.mlbApi
        .fetchPostSeasonData(year)
        .then((postSeasonData) => ({
          regularSeasonInterval,
          postSeasonInterval,
          postSeason: postSeasonData,
        }))
        .catch(() => ({ postSeason: [] }));
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
    }
  }
}
