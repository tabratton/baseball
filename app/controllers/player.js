import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class Player extends Controller {
  @tracked selectedTab;

  get hasPitchingStats() {
    return !!this.model.careerStats.pitching;
  }

  get hittingHeaders() {
    return [
      { label: 'Season', field: 'total.season' },
      { label: 'GP', field: 'total.stat.gamesPlayed' },
      { label: 'PA', field: 'total.stat.plateAppearances' },
      { label: 'AB', field: 'total.stat.atBats' },
      { label: 'AVG', field: 'total.stat.avg' },
      { label: 'H', field: 'total.stat.hits' },
      { label: '2B', field: 'total.stat.doubles' },
      { label: '3B', field: 'total.stat.triples' },
      { label: 'HR', field: 'total.stat.homeRuns' },
      { label: 'RBI', field: 'total.stat.rbi' },
      { label: 'R', field: 'total.stat.runs' },
      { label: 'BB', field: 'total.stat.baseOnBalls' },
      { label: 'SO', field: 'total.stat.strikeOuts' },
      { label: 'OBP', field: 'total.stat.obp' },
      { label: 'SLG', field: 'total.stat.slg' },
      { label: 'OPS', field: 'total.stat.ops' },
      { label: 'BABIP', field: 'total.stat.babip' },
      { label: 'SB', field: 'total.stat.stolenBases' },
      { label: 'SB%', field: 'total.stat.stolenBasePercentage' },
      { label: 'IBB', field: 'total.stat.intentionalWalks' },
      { label: 'HBP', field: 'total.stat.hitByPitch' },
      { label: 'GIDP', field: 'total.stat.groundIntoDoublePlay' },
      { label: 'TB', field: 'total.stat.totalBases' },
      { label: 'Sac Flies', field: 'total.stat.sacFlies' },
      { label: 'Sac Bunts', field: 'total.stat.sacBunts' },
      { label: 'AB/HR', field: 'total.stat.atBatsPerHomeRun' },
    ];
  }

  get fieldingHeaders() {
    return [
      { label: 'Season - Position', field: 'total.season' },
      { label: 'Games', field: 'total.stat.gamesPlayed' },
      { label: 'Games Started', field: 'total.stat.gamesStarted' },
      { label: 'Innings', field: 'total.stat.innings' },
      { label: 'Assists', field: 'total.stat.assists' },
      { label: 'Put Outs', field: 'total.stat.putOuts' },
      { label: 'Chances', field: 'total.stat.chances' },
      { label: 'Double Plays', field: 'total.stat.doublePlays' },
      { label: 'Errors', field: 'total.stat.errors' },
      { label: 'Fielding', field: 'total.stat.fielding' },
      {
        label: 'Range Factor/9 Innings',
        field: 'total.stat.rangeFactorPer9Inn',
      },
    ];
  }

  get pitchingHeaders() {
    return [
      { label: 'Season', field: 'total.season' },
      { label: 'Wins', field: 'total.stat.wins' },
      { label: 'Losses', field: 'total.stat.losses' },
      { label: 'Win %', field: 'total.stat.winPercentage' },
      { label: 'GS', field: 'total.stat.gamesStarted' },
      { label: 'IP', field: 'total.stat.inningsPitched' },
      { label: 'SO', field: 'total.stat.strikeOuts' },
      { label: 'BB', field: 'total.stat.baseOnBalls' },
      { label: 'HBP', field: 'total.stat.hitByPitch' },
      { label: 'ERA', field: 'total.stat.era' },
      { label: 'WHIP', field: 'total.stat.whip' },
      { label: 'SO/9', field: 'total.stat.strikeoutsPer9Inn' },
      { label: 'SO/BB', field: 'total.stat.strikeoutWalkRatio' },
      { label: 'Saves', field: 'total.stat.saves' },
      { label: 'CG', field: 'total.stat.completeGames' },
      { label: 'Shutouts', field: 'total.stat.shutouts' },
      { label: 'Batters Faced', field: 'total.stat.battersFaced' },
      { label: 'Airouts', field: 'total.stat.airOuts' },
      { label: 'Groundouts', field: 'total.stat.groundOuts' },
      { label: 'Groundouts/Airouts', field: 'total.stat.groundOutsToAirouts' },
      { label: '# Pitches', field: 'total.stat.numberOfPitches' },
      { label: 'Pitches/Inning', field: 'total.stat.pitchesPerInning' },
      { label: 'H/9', field: 'total.stat.hitsPer9Inn' },
      { label: 'R/9', field: 'total.stat.runsScoredPer9' },
      { label: 'HR/9', field: 'total.stat.homeRunsPer9' },
      { label: 'BB/9', field: 'total.stat.walksPer9Inn' },
    ];
  }
}
