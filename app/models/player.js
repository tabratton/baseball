import { tracked } from '@glimmer/tracking';

export default class Player {
  @tracked player;

  constructor(player) {
    this.player = player;
  }

  get number() {
    return this.player.primaryNumber;
  }

  get firstName() {
    return this.player.useName;
  }

  get lastName() {
    return this.player.useLastName;
  }

  get nickname() {
    return this.player.nickName ? `"${this.player.nickName}"` : '';
  }

  get bats() {
    return this.player.batSide.description;
  }

  get throws() {
    return this.player.pitchHand.description;
  }

  get height() {
    return this.player.height;
  }

  get weight() {
    return `${this.player.weight}lbs.`;
  }

  get age() {
    return this.player.currentAge;
  }

  get birthday() {
    return this.player.birthDate;
  }

  get birthplace() {
    return `${this.player.birthCity}, ${this.player.birthCountry}`;
  }

  get mlbDebut() {
    return this.player.mlbDebutDate;
  }

  get careerStats() {
    const career = this.player.stats.filter(
      (stat) => stat.type.displayName === 'career'
    );
    return {
      hitting: career.find((stat) => stat.group.displayName === 'hitting')
        ?.splits?.[0],
      pitching: career.find((stat) => stat.group.displayName === 'pitching')
        ?.splits?.[0],
      fielding: career.find((stat) => stat.group.displayName === 'fielding')
        ?.splits,
    };
  }

  get seasonHittingStats() {
    return this.player.stats
      .filter((stat) => stat.type.displayName === 'yearByYear')
      .find((stat) => stat.group.displayName === 'hitting')
      ?.splits.reduce((grouped, currentSplit, index, allSplits) => {
        const matchingStats = allSplits.filter(
          (split) => split.season === currentSplit.season
        );
        if (!grouped.find((split) => split.year === currentSplit.season)) {
          grouped.push(new Season(matchingStats, currentSplit));
        }

        return grouped;
      }, []);
  }

  get seasonFieldingStats() {
    return this.player.stats
      .filter((stat) => stat.type.displayName === 'yearByYear')
      .find((stat) => stat.group.displayName === 'fielding')
      ?.splits.filter((s) => s.position.abbreviation !== 'DH')
      .reduce((grouped, currentSplit, _, allSplits) => {
        const statsForSeason = allSplits.filter(
          (split) => split.season === currentSplit.season
        );

        if (!grouped.find((split) => split.year === currentSplit.season)) {
          statsForSeason.forEach((stat, _, all) => {
            const matching = all.filter(
              (split) => split.position.code === stat.position.code
            );
            if (
              !grouped.find(
                (split) =>
                  split.position === stat.position.code &&
                  split.year === stat.season
              )
            ) {
              grouped.push(new FieldingSeason(matching, stat));
            }
          }, {});
        }

        return grouped;
      }, []);
  }

  get seasonPitchingStats() {
    return this.player.stats
      .filter((stat) => stat.type.displayName === 'yearByYear')
      .find((stat) => stat.group.displayName === 'pitching')
      ?.splits.reduce((grouped, currentSplit, index, allSplits) => {
        const matchingStats = allSplits.filter(
          (split) => split.season === currentSplit.season
        );
        if (!grouped.find((split) => split.year === currentSplit.season)) {
          grouped.push(new Season(matchingStats, currentSplit));
        }

        return grouped;
      }, []);
  }
}

class Season {
  @tracked isExpanded = false;

  year;
  total;
  teams;

  constructor(matchingStats, currentSeason) {
    this.year = currentSeason.season;
    this.teams = [];

    if (matchingStats.length === 1) {
      this.teams.push(currentSeason.team);
      this.total = currentSeason;
    } else {
      this.total = matchingStats.find((s) => !s.team);
      this.teams.push(...matchingStats.filter((s) => s.team));
    }
  }
}

class FieldingSeason extends Season {
  position;

  constructor(matchingStats, currentSeason) {
    super(...arguments);

    this.position = currentSeason.position.code;
  }
}
