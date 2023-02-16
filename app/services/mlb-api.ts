import Service from '@ember/service';

import { format, parse } from 'date-fns';
import fetch from 'fetch';
import { all } from 'rsvp';

import { MLBGameFeed } from 'baseball/interfaces/MLBAPI/MLBGameFeed';
import {
  MLBScheduleEntry,
  MLBScheduleResponse,
} from 'baseball/interfaces/MLBAPI/MLBScheduleEntry';
import {
  MLBDivisionStandings,
  MLBStandingsResponse,
} from 'baseball/interfaces/MLBAPI/MLBDivisionStandings';
import Game from 'baseball/models/Game';
import TeamRecord from 'baseball/models/TeamRecord';
import teamMap from 'baseball/utils/teamMap';
import WinDifferential from 'baseball/models/WinDifferential';

export default class MlbApi extends Service {
  apiHost = 'https://statsapi.mlb.com/api/';

  fetchGamesForDay(date: Date): Promise<Game[]> {
    return fetch(
      encodeURI(
        `${this.apiHost}v1/schedule?sportId=1&date=${format(date, 'y-MM-dd')}`
      )
    )
      .then((response) => {
        if (response.status !== 200) {
          return [];
        }

        return response
          .json()
          .then(({ dates: [dateData] }) => dateData?.games || []);
      })
      .then((games: MLBScheduleEntry[]) =>
        all(games.map((d: MLBScheduleEntry) => this.fetchGame(`${d.gamePk}`)))
      );
  }

  fetchGame(gamePk: string) {
    return fetch(encodeURI(`${this.apiHost}v1.1/game/${gamePk}/feed/live`))
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('could not fetch game');
        }

        return response.json().then((data: MLBGameFeed) => data);
      })
      .then((gameFeed) => new Game(gameFeed, this));
  }

  async fetchStandings(date: string, type: string) {
    const jsDate = parse(date, 'yyyy-MM-dd', new Date());

    return fetch(
      encodeURI(
        `${this.apiHost}v1/standings?leagueId=103,104&season=${format(
          jsDate,
          'yyyy'
        )}&date=${format(
          jsDate,
          'MM/dd/yyyy'
        )}&standingsType=${type}&hydrate=team(division)`
      )
    ).then((response) => {
      if (response.status !== 200) {
        throw new Error('could not fetch standings');
      }

      const mapRecords = (data: MLBDivisionStandings | undefined) => {
        const teamRecords =
          data?.teamRecords?.map((re) => new TeamRecord(re, this)) || [];
        return {
          division: teamRecords[0]?.division,
          teamRecords: teamRecords,
        };
      };

      return response.json().then((data: MLBStandingsResponse) => {
        return {
          american: {
            west: mapRecords(data.records.find((r) => r.division.id === 200)),
            central: mapRecords(
              data.records.find((r) => r.division.id === 202)
            ),
            east: mapRecords(data.records.find((r) => r.division.id === 201)),
          },
          national: {
            west: mapRecords(data.records.find((r) => r.division.id === 203)),
            central: mapRecords(
              data.records.find((r) => r.division.id === 205)
            ),
            east: mapRecords(data.records.find((r) => r.division.id === 204)),
          },
        };
      });
    });
  }

  async fetchWinDifferentials(year: string) {
    const { regularSeasonStartDate, regularSeasonEndDate } = await fetch(
      encodeURI(`${this.apiHost}v1/seasons/${year}/?sportId=1`)
    )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('could not fetch standings');
        }

        return response.json();
      })
      .then((response: MLBSeasonsResponse) => {
        if (!response.seasons[0]) {
          throw new Error('no season data');
        }

        return response.seasons[0];
      });

    const diffs = await all(
      teamMap
        .reject((team) => team.id === 159 || team.id === 160)
        .map((team) => {
          return fetch(
            encodeURI(
              `${this.apiHost}v1/schedule?sportId=1&teamId=${team.id}&startDate=${regularSeasonStartDate}&endDate=${regularSeasonEndDate}`
            )
          )
            .then((response) => {
              if (response.status !== 200) {
                throw new Error('couldnt get schedule');
              }

              return response.json();
            })
            .then((response: MLBScheduleResponse) => {
              const dates = response.dates;

              return new WinDifferential(
                team,
                dates
                  .map((d) => d.games)
                  .reduce((accumulator, games) => accumulator.concat(games), [])
                  .filter((g) => g.status.codedGameState === 'F')
                  .map((g) => {
                    if (g.teams.away.team.id === team.id) {
                      return { date: g.officialDate, ...g.teams.away };
                    } else {
                      return { date: g.officialDate, ...g.teams.home };
                    }
                  }),
                this
              );
            });
        })
    );

    diffs.sort((a, b) => (a.overallDiff < b.overallDiff ? -1 : 1));

    return diffs;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'mlb-api': MlbApi;
  }
}

interface MLBSeasonsResponse {
  copyright: string;
  seasons: MLBSeason[];
}

interface MLBSeason {
  allStarDate: string;
  firstDate2ndHalf: string;
  gameLevelGamedayType: string;
  hasWildcard: true;
  lastDate1stHalf: string;
  offSeasonEndDate: string;
  offseasonStartDate: string; // intentional, this is how the API response is formatted
  postSeasonEndDate: string;
  postSeasonStartDate: string;
  preSeasonEndDate: string;
  preSeasonStartDate: string;
  qualifierOutsPitched: number;
  qualifierPlateAppearances: number;
  regularSeasonEndDate: string;
  regularSeasonStartDate: string;
  seasonId: string;
  seasonLevelGamedayType: string;
  seasonStartDate: string;
  springEndDate: string;
  springStartDate: string;
}

export interface MLBScheduleTeamMap {
  isWinner: boolean;
  leagueRecord: {
    losses: number;
    pct: string;
    wins: number;
  };
  score: number;
  seriesNumber: number;
  splitSquad: boolean;
  team: {
    id: number;
    link: string;
    name: string;
  };
  date: string;
}
