import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';

import type IntlService from 'ember-intl/services/intl';

import { MLBTeamRecord } from 'baseball/interfaces/MLBAPI/MLBDivisionStandings';
import teamMap from 'baseball/utils/teamMap';

export default class TeamRecord {
  @service declare intl: IntlService;
  @tracked teamRecord: MLBTeamRecord;

  private readonly context;

  constructor(teamRecord: MLBTeamRecord, context: unknown) {
    this.teamRecord = teamRecord;
    this.context = context;
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
