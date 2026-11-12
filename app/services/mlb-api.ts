import { assert } from '@ember/debug';
import Service, { service } from '@ember/service';
import { cached } from '@glimmer/tracking';

import type { Team } from 'baseball/data/team/schema';
import Game from 'baseball/models/game';
import LeagueLeaders from 'baseball/models/league-leaders';
import Player from 'baseball/models/player';
import TeamRecord from 'baseball/models/team-record';
import type AppStore from 'baseball/services/store';
import type {
  GameFeed,
  LeagueLeadersResponse,
  PeopleResponse,
  PostSeasonResponse,
  ScheduleResponse,
  SeasonsResponse,
  SeriesSummary,
  StandingsResponse,
} from 'baseball/types/mlb-api';
import teamMap, { type TeamConfig } from 'baseball/utils/team-map';
import WinDifferential, {
  type GameResult,
} from 'baseball/models/win-differential';
import { getRequestState } from '@warp-drive/core/reactive';

/** A team record merged with the app's local team config. */
export type MlbTeam = Omit<Team, 'id'> &
  Partial<Omit<TeamConfig, 'id'>> & {
    /** A number when local team config was found, else the record's id. */
    id: number | string;
  };

export interface DivisionStandings {
  division: TeamRecord['division'] | undefined;
  teamRecords: TeamRecord[];
}

export interface LeagueStandings {
  west: DivisionStandings;
  central: DivisionStandings;
  east: DivisionStandings;
}

export interface Standings {
  american: LeagueStandings;
  national: LeagueStandings;
}

export default class MlbApi extends Service {
  @service declare store: AppStore;

  apiHost = 'https://statsapi.mlb.com/api/';

  @cached
  get teamsRequest() {
    return this.store.request<{ data: Team[] }>({
      url: `${this.apiHost}v1/teams?sportId=1`,
      options: {
        dataKey: 'teams',
        failMessage: 'could not fetch leagues',
      },
    });
  }

  get _teams() {
    return getRequestState(this.teamsRequest).value?.data || [];
  }

  @cached
  get teams(): MlbTeam[] {
    return this._teams.map((team) => {
      const additionalInfo = teamMap.find((t) => `${t.id}` === team.id);
      const obj: MlbTeam = {
        ...team,
        ...(additionalInfo || {}),
      };

      obj.league = {
        ...team.league,
      };

      return obj;
    });
  }

  fetchGamesForDay(date: Temporal.PlainDate): Promise<Game[]> {
    /* eslint-disable-next-line warp-drive/no-external-request-patterns */
    return fetch(
      encodeURI(`${this.apiHost}v1/schedule?sportId=1&date=${date.toString()}`),
    )
      .then((response) =>
        this.handleResponse<ScheduleResponse>(
          response,
          'could not fetch games',
        ),
      )
      .then(({ dates: [dateData] }) => dateData?.games || [])
      .then((games) =>
        Promise.all(games.map((d) => this.fetchGame(`${d.gamePk}`))),
      );
  }

  fetchGameData(gamePk: number | string): Promise<GameFeed> {
    /* eslint-disable-next-line warp-drive/no-external-request-patterns */
    return fetch(
      encodeURI(`${this.apiHost}v1.1/game/${gamePk}/feed/live`),
    ).then((response) =>
      this.handleResponse<GameFeed>(response, 'could not fetch game'),
    );
  }

  fetchGame(gamePk: number | string): Promise<Game> {
    return this.fetchGameData(gamePk).then(
      (gameFeed) => new Game(gameFeed, this),
    );
  }

  async fetchStandings(date: string, type: string): Promise<Standings> {
    const dateTime = Temporal.PlainDate.from(date);

    const dateString = `${dateTime.month.toString().padStart(2, '0')}/${dateTime.day.toString().padStart(2, '0')}/${dateTime.year}`;
    /* eslint-disable-next-line warp-drive/no-external-request-patterns */
    return fetch(
      encodeURI(
        `${
          this.apiHost
        }v1/standings?leagueId=103,104&season=${dateTime.year}&date=${dateString}&standingsType=${type}&hydrate=team(division)`,
      ),
    )
      .then((response) =>
        this.handleResponse<StandingsResponse>(
          response,
          'could not fetch standings',
        ),
      )
      .then(({ records }) => {
        const mapRecords = (
          data: StandingsResponse['records'][number] | undefined,
        ): DivisionStandings => {
          const teamRecords =
            data?.teamRecords?.map((re) => new TeamRecord(re, this)) || [];
          return {
            division: teamRecords[0]?.division,
            teamRecords: teamRecords,
          };
        };

        return {
          american: {
            west: mapRecords(records.find((r) => r.division.id === 200)),
            central: mapRecords(records.find((r) => r.division.id === 202)),
            east: mapRecords(records.find((r) => r.division.id === 201)),
          },
          national: {
            west: mapRecords(records.find((r) => r.division.id === 203)),
            central: mapRecords(records.find((r) => r.division.id === 205)),
            east: mapRecords(records.find((r) => r.division.id === 204)),
          },
        };
      });
  }

  getSeasonData(year: string) {
    /* eslint-disable-next-line warp-drive/no-external-request-patterns */
    return fetch(encodeURI(`${this.apiHost}v1/seasons/${year}/?sportId=1`))
      .then((response) =>
        this.handleResponse<SeasonsResponse>(
          response,
          'could not fetch win diffs',
        ),
      )
      .then((response) => {
        if (!response.seasons[0]) {
          throw new Error('no season data');
        }

        return response.seasons[0];
      });
  }

  async fetchWinDifferentials(
    beginDate: string,
    endDate: string,
  ): Promise<WinDifferential[]> {
    const diffs = await Promise.all(
      teamMap
        .filter((team) => team.id !== 159 && team.id !== 160)
        .map((team) => {
          /* eslint-disable-next-line warp-drive/no-external-request-patterns */
          return fetch(
            encodeURI(
              `${this.apiHost}v1/schedule?sportId=1&teamId=${team.id}&startDate=${beginDate}&endDate=${endDate}`,
            ),
          )
            .then((response) =>
              this.handleResponse<ScheduleResponse>(
                response,
                'could not get schedule',
              ),
            )
            .then((response) => {
              const dates = response.dates;

              return new WinDifferential(
                team,
                dates
                  .map((d) => d.games)
                  .flat()
                  .filter((g) => g.status.codedGameState === 'F')
                  .map((g): GameResult => {
                    if (g.teams.away.team.id === team.id) {
                      return { date: g.officialDate, ...g.teams.away };
                    } else {
                      return { date: g.officialDate, ...g.teams.home };
                    }
                  }),
                this,
              );
            });
        }),
    );

    diffs.sort((a, b) => (a.overallDiff < b.overallDiff ? -1 : 1));

    return diffs;
  }

  async fetchPlayer(playerId: string): Promise<Player> {
    /* eslint-disable-next-line warp-drive/no-external-request-patterns */
    const player = await fetch(
      encodeURI(
        `${this.apiHost}v1/people/${playerId}?hydrate=stats(group=[hitting,pitching,fielding],type=[career,yearByYear],currentTeam)`,
      ),
    )
      .then((response) =>
        this.handleResponse<PeopleResponse>(response, 'could not fetch player'),
      )
      .then((response) => {
        if (!response.people[0]) {
          throw new Error('no people data');
        }

        return response.people[0];
      });

    return new Player(player);
  }

  async fetchLeagueLeaders(
    stat: string | null | undefined,
  ): Promise<LeagueLeaders | null> {
    if (!stat) return null;

    const [statGroup, type = ''] = stat.split('_');
    let url = `${this.apiHost}v1/stats/leaders?sportId=1&statGroup=${statGroup}&statType=season&leaderCategories=${type}&limit=10`;

    const noneQualified = ['saves', 'blownSaves', 'holds', 'saveOpportunities'];

    if (!noneQualified.includes(type)) {
      url += '&playerPool=qualified';
    }

    const [american, national] = await Promise.all([
      /* eslint-disable-next-line warp-drive/no-external-request-patterns */
      fetch(encodeURI(`${url}&leagueId=103`))
        .then((response) =>
          this.handleResponse<LeagueLeadersResponse>(
            response,
            'could not fetch stats',
          ),
        )
        .then(({ leagueLeaders }) => leagueLeaders[0]?.leaders ?? []),
      /* eslint-disable-next-line warp-drive/no-external-request-patterns */
      fetch(encodeURI(`${url}&leagueId=104`))
        .then((response) =>
          this.handleResponse<LeagueLeadersResponse>(
            response,
            'could not fetch stats',
          ),
        )
        .then(({ leagueLeaders }) => leagueLeaders[0]?.leaders ?? []),
    ]);

    return new LeagueLeaders(american, national);
  }

  handleResponse<T>(response: Response, message: string): Promise<T> {
    if (response.status !== 200) {
      throw new Error(message);
    }

    return response.json() as Promise<T>;
  }

  async fetchPostSeasonData(
    selectedDate: Temporal.PlainDate,
  ): Promise<SeriesSummary[]> {
    /* eslint-disable-next-line warp-drive/no-external-request-patterns */
    const data = await fetch(
      encodeURI(
        `${this.apiHost}v1/schedule/postseason/series?season=${selectedDate.year}&fields=series,id,sortNumber,gameType,games,gamePk,teams,away,home,team,name,officialDate,wins,losses,leagueRecord,abbreviation,seriesStatus,leagueId&hydrate=seriesStatus`,
      ),
    )
      .then((response) =>
        this.handleResponse<PostSeasonResponse>(
          response,
          'could not fetch post season data',
        ),
      )
      .then((response) => {
        if (!response.series[0]) {
          throw new Error('no post season data');
        }

        return response.series;
      });

    const filteredData: PostSeasonResponse['series'] = [];

    data.forEach((d) => {
      d.games = d.games.filter((g) => {
        const gameDate = Temporal.PlainDate.from(g.officialDate);
        return Temporal.PlainDate.compare(gameDate, selectedDate) <= 0;
      });
      if (d.games.length > 0) {
        filteredData.push(d);
      }
    });

    return filteredData.map((s) => {
      const lastGame = s.games.slice().pop();
      assert('series has at least one game', lastGame);
      return {
        team1: {
          id: lastGame.teams.home.team.id,
          name: lastGame.teams.home.team.name,
          wins: lastGame.teams.home.leagueRecord.wins,
        },
        team2: {
          id: lastGame.teams.away.team.id,
          name: lastGame.teams.away.team.name,
          wins: lastGame.teams.away.leagueRecord.wins,
        },
        seriesId: s.series.id,
        seriesType: lastGame.seriesStatus.abbreviation,
      };
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'mlb-api': MlbApi;
  }
}
