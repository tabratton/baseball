import { tracked } from '@glimmer/tracking';

import type { PersonData, StatSplit } from 'baseball/types/mlb-api';

export default class Player {
  @tracked player: PersonData;

  constructor(player: PersonData) {
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
      (stat) => stat.type.displayName === 'career',
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
      ?.splits.reduce<Season[]>((grouped, currentSplit, _, allSplits) => {
        const matchingStats = allSplits.filter(
          (split) => split.season === currentSplit.season,
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
      ?.splits.filter((s) => s.position?.abbreviation !== 'DH')
      .reduce<FieldingSeason[]>((grouped, currentSplit, _, allSplits) => {
        const statsForSeason = allSplits.filter(
          (split) => split.season === currentSplit.season,
        );

        if (!grouped.find((split) => split.year === currentSplit.season)) {
          statsForSeason.forEach((stat, _, all) => {
            const matching = all.filter(
              (split) => split.position?.code === stat.position?.code,
            );
            if (
              !grouped.find(
                (split) =>
                  split.position === stat.position?.code &&
                  split.year === stat.season,
              )
            ) {
              grouped.push(new FieldingSeason(matching, stat));
            }
          });
        }

        return grouped;
      }, []);
  }

  get seasonPitchingStats() {
    return this.player.stats
      .filter((stat) => stat.type.displayName === 'yearByYear')
      .find((stat) => stat.group.displayName === 'pitching')
      ?.splits.reduce<Season[]>((grouped, currentSplit, _, allSplits) => {
        const matchingStats = allSplits.filter(
          (split) => split.season === currentSplit.season,
        );
        if (!grouped.find((split) => split.year === currentSplit.season)) {
          grouped.push(new Season(matchingStats, currentSplit));
        }

        return grouped;
      }, []);
  }
}

export class Season {
  @tracked isExpanded = false;

  year: string;
  /** Season totals (across all teams played for that season). */
  total: StatSplit | undefined;
  /** Per-team splits for the season. */
  teams: StatSplit[];

  constructor(matchingStats: StatSplit[], currentSeason: StatSplit) {
    this.year = currentSeason.season;
    this.teams = [];

    if (matchingStats.length === 1) {
      this.teams.push(currentSeason);
      this.total = currentSeason;
    } else {
      this.total = matchingStats.find((s) => !s.team);
      this.teams.push(...matchingStats.filter((s) => s.team));
    }
  }

  /** The id of the first team played for during the season. */
  get firstTeamId() {
    return this.teams[0]?.team?.id;
  }
}

export class FieldingSeason extends Season {
  position: string | undefined;

  constructor(matchingStats: StatSplit[], currentSeason: StatSplit) {
    super(matchingStats, currentSeason);

    this.position = currentSeason.position?.code;
  }
}
