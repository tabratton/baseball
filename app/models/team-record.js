import { getOwner, setOwner } from '@ember/application';
import { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';

import teamMap from 'baseball/utils/team-map';

export default class TeamRecord {
  @service intl;

  @tracked teamRecord;

  constructor(teamRecord, context) {
    this.teamRecord = teamRecord;
    setOwner(this, getOwner(context));
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

  get gamesBack() {
    return this.teamRecord.gamesBack;
  }

  get wildCardGamesBack() {
    return this.teamRecord.wildCardGamesBack;
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
