import Service from '@ember/service';

import Game from 'baseball/models/game';
import LeagueLeaders from 'baseball/models/league-leaders';
import Player from 'baseball/models/player';
import TeamRecord from 'baseball/models/team-record';
import teamMap from 'baseball/utils/team-map';
import WinDifferential from 'baseball/models/win-differential';
import { DateTime } from 'luxon';

export default class MlbApi extends Service {
  apiHost = 'https://statsapi.mlb.com/api/';

  fetchGamesForDay(date) {
    return fetch(
      encodeURI(
        `${this.apiHost}v1/schedule?sportId=1&date=${date.toFormat('y-MM-dd')}`,
      ),
    )
      .then((response) =>
        this.handleResponse(response, 'could not fetch games'),
      )
      .then(({ dates: [dateData] }) => dateData?.games || [])
      .then((games) =>
        Promise.all(games.map((d) => this.fetchGame(`${d.gamePk}`))),
      );
  }

  fetchGameData(gamePk) {
    return fetch(
      encodeURI(`${this.apiHost}v1.1/game/${gamePk}/feed/live`),
    ).then((response) => this.handleResponse(response, 'could not fetch game'));
  }

  fetchGame(gamePk) {
    return this.fetchGameData(gamePk).then(
      (gameFeed) => new Game(gameFeed, this),
    );
  }

  async fetchStandings(date, type) {
    const dateTime = DateTime.fromFormat(date, 'y-MM-dd');

    return fetch(
      encodeURI(
        `${
          this.apiHost
        }v1/standings?leagueId=103,104&season=${dateTime.toFormat(
          'y',
        )}&date=${dateTime.toFormat(
          'MM/dd/yyyy',
        )}&standingsType=${type}&hydrate=team(division)`,
      ),
    )
      .then((response) =>
        this.handleResponse(response, 'could not fetch standings'),
      )
      .then(({ records }) => {
        const mapRecords = (data) => {
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

  getSeasonData(year) {
    return fetch(encodeURI(`${this.apiHost}v1/seasons/${year}/?sportId=1`))
      .then((response) =>
        this.handleResponse(response, 'could not fetch win diffs'),
      )
      .then((response) => {
        if (!response.seasons[0]) {
          throw new Error('no season data');
        }

        return response.seasons[0];
      });
  }

  async fetchWinDifferentials(beginDate, endDate) {
    const diffs = await Promise.all(
      teamMap
        .filter((team) => team.id !== 159 && team.id !== 160)
        .map((team) => {
          return fetch(
            encodeURI(
              `${this.apiHost}v1/schedule?sportId=1&teamId=${team.id}&startDate=${beginDate}&endDate=${endDate}`,
            ),
          )
            .then((response) =>
              this.handleResponse(response, 'could not get schedule'),
            )
            .then((response) => {
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
                this,
              );
            });
        }),
    );

    diffs.sort((a, b) => (a.overallDiff < b.overallDiff ? -1 : 1));

    return diffs;
  }

  async fetchPlayer(playerId) {
    const player = await fetch(
      encodeURI(
        `${this.apiHost}v1/people/${playerId}?hydrate=stats(group=[hitting,pitching,fielding],type=[career,yearByYear],currentTeam)`,
      ),
    )
      .then((response) =>
        this.handleResponse(response, 'could not fetch player'),
      )
      .then((response) => {
        if (!response.people[0]) {
          throw new Error('no people data');
        }

        return response.people[0];
      });

    return new Player(player);
  }

  async fetchLeagueLeaders(stat) {
    if (!stat) return null;

    const [statGroup, type] = stat.split('_');
    let url = `${this.apiHost}v1/stats/leaders?sportId=1&statGroup=${statGroup}&statType=season&leaderCategories=${type}&limit=10`;

    const noneQualified = ['saves', 'blownSaves', 'holds', 'saveOpportunities'];

    if (!noneQualified.includes(type)) {
      url += '&playerPool=qualified';
    }

    const [american, national] = await Promise.all([
      fetch(encodeURI(`${url}&leagueId=103`))
        .then((response) =>
          this.handleResponse(response, 'could not fetch stats'),
        )
        .then(({ leagueLeaders: [{ leaders = [] }] }) => leaders),
      fetch(encodeURI(`${url}&leagueId=104`))
        .then((response) =>
          this.handleResponse(response, 'could not fetch stats'),
        )
        .then(({ leagueLeaders: [{ leaders = [] }] }) => leaders),
    ]);

    return new LeagueLeaders(american, national);
  }

  handleResponse(response, message) {
    if (response.status !== 200) {
      throw new Error(message);
    }

    return response.json();
  }

  async fetchPostSeasonData(year) {
    const data = await fetch(
      encodeURI(
        `${this.apiHost}v1/schedule/postseason/series?season=${year}&fields=series,id,sortNumber,gameType,games,gamePk,teams,away,home,team,name,officialDate,wins,losses,leagueRecord,abbreviation,seriesStatus&hydrate=seriesStatus`,
      ),
    )
      .then((response) =>
        this.handleResponse(response, 'could not fetch post season data'),
      )
      .then((response) => {
        if (!response.series[0]) {
          throw new Error('no post season data');
        }

        return response.series;
      });
    return data.map((s) => {
      const lastGame = s.games.slice().pop();
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
