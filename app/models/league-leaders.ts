import { tracked } from '@glimmer/tracking';

import type { Leader } from 'baseball/types/mlb-api';

export interface LeaderRow {
  rank: number;
  american: Leader | undefined;
  national: Leader | undefined;
}

export default class LeagueLeaders {
  @tracked american: Leader[];
  @tracked national: Leader[];

  constructor(american: Leader[], national: Leader[]) {
    this.american = american;
    this.national = national;
  }

  get allLeaders(): LeaderRow[] {
    const maxRank = Math.max(
      ...this.american.map((l) => l.rank),
      ...this.national.map((l) => l.rank),
    );

    const ranks = [];
    for (let i = 1; i <= maxRank; i++) {
      const rank = {
        american: this.american.filter((l) => l.rank === i),
        national: this.national.filter((l) => l.rank === i),
        rank: i,
      };

      ranks.push(rank);
    }

    return ranks.reduce<LeaderRow[]>((newRanks, currentRank) => {
      const ties = Math.max(
        currentRank.american.length,
        currentRank.national.length,
      );

      for (let i = 0; i < ties; i++) {
        const rank = {
          rank: currentRank.rank,
          american: currentRank.american[i],
          national: currentRank.national[i],
        };

        newRanks.push(rank);
      }

      return newRanks;
    }, []);
  }
}
