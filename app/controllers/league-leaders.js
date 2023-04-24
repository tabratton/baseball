import Controller from '@ember/controller';
import { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';

import Fuse from 'fuse.js';
import { action } from '@ember/object';

export default class LeagueLeadersController extends Controller {
  queryParams = ['stat'];

  @service intl;

  @tracked stat;

  get selectedCategory() {
    return this.options.find((c) => c.id === this.stat);
  }

  @cached
  get categories() {
    const list = [
      { typeName: 'assists', category: 'fielding' },
      { typeName: 'shutouts', category: 'pitching' },
      { typeName: 'homeRuns', category: 'hitting' },
      { typeName: 'homeRuns', category: 'pitching' },
      { typeName: 'sacrificeBunts', category: 'hitting' },
      { typeName: 'sacrificeFlies', category: 'hitting' },
      { typeName: 'runs', category: 'hitting' },
      { typeName: 'groundoutToFlyoutRatio', category: 'pitching' },
      { typeName: 'groundoutToFlyoutRatio', category: 'hitting' },
      { typeName: 'stolenBases', category: 'hitting' },
      { typeName: 'groundOuts', category: 'hitting' },
      { typeName: 'numberOfPitches', category: 'pitching' },
      { typeName: 'onBasePercentage', category: 'hitting' },
      { typeName: 'caughtStealing', category: 'hitting' },
      { typeName: 'groundIntoDoublePlays', category: 'hitting' },
      { typeName: 'totalBases', category: 'hitting' },
      { typeName: 'earnedRunAverage', category: 'pitching' },
      { typeName: 'fieldingPercentage', category: 'fielding' },
      { typeName: 'walksAndHitsPerInningPitched', category: 'pitching' },
      { typeName: 'hitByPitches', category: 'hitting' },
      { typeName: 'gamesPlayed', category: 'fielding' },
      { typeName: 'gamesPlayed', category: 'pitching' },
      { typeName: 'gamesPlayed', category: 'hitting' },
      { typeName: 'walks', category: 'hitting' },
      { typeName: 'walks', category: 'pitching' },
      { typeName: 'sluggingPercentage', category: 'hitting' },
      { typeName: 'onBasePlusSlugging', category: 'hitting' },
      { typeName: 'runsBattedIn', category: 'hitting' },
      { typeName: 'triples', category: 'hitting' },
      { typeName: 'extraBaseHits', category: 'hitting' },
      { typeName: 'hits', category: 'hitting' },
      { typeName: 'atBats', category: 'hitting' },
      { typeName: 'strikeouts', category: 'hitting' },
      { typeName: 'strikeouts', category: 'pitching' },
      { typeName: 'doubles', category: 'hitting' },
      { typeName: 'totalPlateAppearances', category: 'hitting' },
      { typeName: 'intentionalWalks', category: 'hitting' },
      { typeName: 'wins', category: 'pitching' },
      { typeName: 'losses', category: 'pitching' },
      { typeName: 'saves', category: 'pitching' },
      { typeName: 'wildPitch', category: 'pitching' },
      { typeName: 'airOuts', category: 'pitching' },
      { typeName: 'balk', category: 'pitching' },
      { typeName: 'blownSaves', category: 'pitching' },
      {
        typeName: 'catcherEarnedRunAverage',
        category: 'fielding',
        displayCategory: 'catching',
      },
      { typeName: 'catchersInterference', category: 'catching' },
      { typeName: 'completeGames', category: 'pitching' },
      { typeName: 'doublePlays', category: 'fielding' },
      { typeName: 'earnedRun', category: 'pitching' },
      { typeName: 'errors', category: 'fielding' },
      { typeName: 'gamesStarted', category: 'pitching' },
      { typeName: 'hitBatsman', category: 'pitching' },
      { typeName: 'hitsPer9Inn', category: 'pitching' },
      { typeName: 'holds', category: 'pitching' },
      { typeName: 'innings', category: 'fielding' },
      { typeName: 'inningsPitched', category: 'pitching' },
      { typeName: 'passedBalls', category: 'fielding' },
      { typeName: 'pickoffs', category: 'pitching' },
      { typeName: 'pickoffs', category: 'catching' },
      { typeName: 'pitchesPerInning', category: 'pitching' },
      { typeName: 'putOuts', category: 'fielding' },
      { typeName: 'rangeFactorPerGame', category: 'fielding' },
      { typeName: 'rangeFactorPer9Inn', category: 'fielding' },
      { typeName: 'saveOpportunities', category: 'pitching' },
      { typeName: 'stolenBasePercentage', category: 'pitching' },
      { typeName: 'stolenBasePercentage', category: 'hitting' },
      { typeName: 'stolenBasePercentage', category: 'catching' },
      { typeName: 'strikeoutsPer9Inn', category: 'pitching' },
      { typeName: 'strikeoutWalkRatio', category: 'pitching' },
      { typeName: 'throwingErrors', category: 'fielding' },
      { typeName: 'totalBattersFaced', category: 'pitching' },
      { typeName: 'triplePlays', category: 'fielding' },
      { typeName: 'walksPer9Inn', category: 'pitching' },
      { typeName: 'winPercentage', category: 'pitching' },
      { typeName: 'battingAverage', category: 'hitting' },
    ].map((type) => {
      type.label = this.intl.t(`leader-types.${type.typeName}`);
      type.id = `${type.category}_${type.typeName}`;
      return type;
    });

    list.sort((a, b) => a.category.localeCompare(b.category));

    return list.reduce((groups, option) => {
      const optionCategory = option.displayCategory || option.category;
      let group = groups.find((g) => g.category === optionCategory);
      if (!group) {
        group = {
          category: optionCategory,
          groupName: this.intl.t(`leader-categories.${optionCategory}`),
          options: [],
          disabled: false,
        };

        groups.push(group);
      }

      option.categoryLabel = group.groupName;

      group.options.push(option);
      return groups;
    }, []);
  }

  get options() {
    return this.categories.flatMap((c) => c.options);
  }

  @cached
  get fuse() {
    return new Fuse(this.options, { keys: ['label'] });
  }

  searchCategories = restartableTask(async (searchTerm) => {
    await timeout(250);
    return this.fuse.search(searchTerm).map((r) => r.item);
  });

  @action
  updateCategory(category) {
    this.stat = category.id;
  }

  get headers() {
    return [
      {
        label: 'American',
        value: 'american.person.fullName',
        class: 'border-r-0',
      },
      {
        label: 'Stat',
        value: 'american.value',
        class: 'border-l-0',
      },
      {
        label: 'Rank',
        value: 'rank',
      },
      {
        label: 'Stat',
        value: 'national.value',
        class: 'border-r-0',
      },
      {
        label: 'National',
        value: 'national.person.fullName',
        class: 'border-l-0',
      },
    ];
  }
}
