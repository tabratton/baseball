import Service from '@ember/service';

import { format, parse } from 'date-fns';
import fetch from 'fetch';
import { all } from 'rsvp';

import Game from 'baseball/models/game';
import Player from 'baseball/models/player';
import TeamRecord from 'baseball/models/team-record';
import teamMap from 'baseball/utils/team-map';
import WinDifferential from 'baseball/models/win-differential';

export default class MlbApi extends Service {
  apiHost = 'https://statsapi.mlb.com/api/';

  fetchGamesForDay(date) {
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
      .then((games) => all(games.map((d) => this.fetchGame(`${d.gamePk}`))));
  }

  fetchGame(gamePk) {
    return fetch(encodeURI(`${this.apiHost}v1.1/game/${gamePk}/feed/live`))
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('could not fetch game');
        }

        return response.json().then((data) => data);
      })
      .then((gameFeed) => new Game(gameFeed, this));
  }

  async fetchStandings(date, type) {
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

      const mapRecords = (data) => {
        const teamRecords =
          data?.teamRecords?.map((re) => new TeamRecord(re, this)) || [];
        return {
          division: teamRecords[0]?.division,
          teamRecords: teamRecords,
        };
      };

      return response.json().then((data) => {
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

  async fetchWinDifferentials(year) {
    const { regularSeasonStartDate, regularSeasonEndDate } = await fetch(
      encodeURI(`${this.apiHost}v1/seasons/${year}/?sportId=1`)
    )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('could not fetch standings');
        }

        return response.json();
      })
      .then((response) => {
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
                this
              );
            });
        })
    );

    diffs.sort((a, b) => (a.overallDiff < b.overallDiff ? -1 : 1));

    return diffs;
  }

  async fetchPlayer(playerId) {
    const player = await fetch(
      encodeURI(
        `${this.apiHost}v1/people/${playerId}?hydrate=stats(group=[hitting,pitching,fielding],type=[career,yearByYear],currentTeam)`
      )
    )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('could not fetch player');
        }

        return response.json();
      })
      .then((response) => {
        if (!response.people[0]) {
          throw new Error('no people data');
        }

        return response.people[0];
      });

    return new Player(player);
  }
}
