import { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';
import type IntlService from 'ember-intl/services/intl';

import type { TeamRecordData } from 'baseball/types/mlb-api';
import inheritOwner from 'baseball/utils/inherit-owner';
import teamMap from 'baseball/utils/team-map';

/**
 * Converts a games-back value from the API into a number for sorting.
 * "-" means the team is the leader (0 back), and a leading "+" means the team
 * is that many games *ahead* (e.g. of the wild card cutoff).
 */
function gamesBackToNumber(value: string | undefined): number {
  if (!value || value === '-') {
    return 0;
  }

  const games = Number.parseFloat(value.replace(/^\+/, ''));
  if (Number.isNaN(games)) {
    return 0;
  }

  return value.startsWith('+') ? -games : games;
}

export default class TeamRecord {
  @service declare intl: IntlService;

  @tracked teamRecord: TeamRecordData;

  constructor(teamRecord: TeamRecordData, context: object) {
    this.teamRecord = teamRecord;
    inheritOwner(this, context);
  }

  @cached
  get teamMap() {
    return teamMap.find((team) => team.id === this.teamRecord.team.id);
  }

  get division() {
    return this.teamRecord.team.division;
  }

  get divisionRank() {
    return this.teamRecord.divisionRank;
  }

  get divisionRankValue() {
    return Number(this.teamRecord.divisionRank);
  }

  get teamShortName() {
    return this.teamMap?.short;
  }

  get teamLogo() {
    return `/assets/team_logos/${this.teamShortName?.toLowerCase()}.svg`;
  }

  get teamName() {
    return this.teamRecord.team.name;
  }

  get wins() {
    return this.teamRecord.leagueRecord.wins;
  }

  get losses() {
    return this.teamRecord.leagueRecord.losses;
  }

  get pct() {
    return this.teamRecord.leagueRecord.pct;
  }

  get pctValue() {
    return Number(this.teamRecord.leagueRecord.pct ?? 0);
  }

  get gamesBack() {
    return this.teamRecord.gamesBack;
  }

  get gamesBackValue() {
    return gamesBackToNumber(this.teamRecord.gamesBack);
  }

  get wildCardGamesBack() {
    return this.teamRecord.wildCardGamesBack;
  }

  get wildCardGamesBackValue() {
    return gamesBackToNumber(this.teamRecord.wildCardGamesBack);
  }

  get runsScored() {
    return this.teamRecord.runsScored;
  }

  get runsAllowed() {
    return this.teamRecord.runsAllowed;
  }

  get runDifferential() {
    return this.teamRecord.runDifferential;
  }
}
