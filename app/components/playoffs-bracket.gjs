import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import './playoffs-bracket.css';

class TeamContainer extends Component {
  <template>
    <div
      class="team flex justify-end gap-4
        {{if this.isNl 'flex-row-reverse'}}
        p-4 rounded border-2 border-stone-600 text-base/4 relative team--{{@side}}
        {{@team.mainBackground}}
        {{@team.mainText}}"
      ...attributes
    >
      <div>{{@team.clubName}}</div>
      <div>{{this.score}}</div>
    </div>
  </template>

  get score() {
    const series = this.args.series || {};
    if (series.team1?.id === this.args.team?.id) {
      return series.team1?.wins;
    } else {
      return series.team2?.wins;
    }
  }

  get isNl() {
    return this.args.team?.league.id === 104;
  }
}

class Round extends Component {
  <template>
    <div
      class="{{this.tailwindClasses}} {{this.indexClass}} {{this.sideClass}}"
    >
      {{yield TeamContainer}}
    </div>
  </template>

  get tailwindClasses() {
    const classes = [];
    switch (this.args.type) {
      case 'finals':
        classes.push(this.args.type, 'flex', 'items-center');
        break;
      case 'round':
        classes.push(this.args.type, 'flex', 'flex-col');

        switch (this.args.side) {
          case 'left':
            classes.push('mr-16');
            break;
          case 'right':
            classes.push('ml-16');
            break;
        }

        if (this.args.index === '0') {
          classes.push('justify-between');
        } else {
          classes.push('justify-around');
        }
        break;
    }

    return classes.join(' ');
  }

  get indexClass() {
    return this.args.index ? `round${this.args.index}` : null;
  }

  get sideClass() {
    return this.args.side ? `round--${this.args.side}` : null;
  }
}

export default class PlayoffsBracket extends Component {
  <template>
    <div class="tournament flex py-16 px-4">
      <Round @type="round" @side="left" @index="0" as |TeamContainer|>
        <div>
          {{#let (this.getRound "ALWC" true) as |alwc1|}}
            <TeamContainer
              @team={{this.getTeam alwc1.team1.id}}
              @series={{alwc1}}
              @side="top"
              class="mb-4"
            />
            <TeamContainer
              @team={{this.getTeam alwc1.team2.id}}
              @series={{alwc1}}
              @side="bottom"
            />
          {{/let}}
        </div>
        <div>
          {{#let (this.getRound "ALWC" false) as |alwc2|}}
            <TeamContainer
              @team={{this.getTeam alwc2.team1.id}}
              @series={{alwc2}}
              @side="top"
              class="mb-4"
            />
            <TeamContainer
              @team={{this.getTeam alwc2.team2.id}}
              @series={{alwc2}}
              @side="bottom"
            />
          {{/let}}
        </div>
      </Round>
      <Round @type="round" @side="left" @index="1" as |TeamContainer|>
        {{#let
          (this.getRound "ALDS" true (this.getRound "ALWC" true))
          as |alds1|
        }}
          <TeamContainer
            @team={{this.decideTeam alds1 (this.getRound "ALWC" true) true}}
            @series={{alds1}}
            @side="top"
            class="team--wc"
          />
          <TeamContainer
            @team={{this.decideTeam alds1 (this.getRound "ALWC" true) false}}
            @series={{alds1}}
            @side="bottom"
          />
        {{/let}}
        {{#let
          (this.getRound "ALDS" false (this.getRound "ALWC" false))
          as |alds2|
        }}
          <TeamContainer
            @team={{this.decideTeam alds2 (this.getRound "ALWC" false) false}}
            @series={{alds2}}
            @side="top"
          />
          <TeamContainer
            @team={{this.decideTeam alds2 (this.getRound "ALWC" false) true}}
            @series={{alds2}}
            @side="bottom"
            class="team--wc"
          />
        {{/let}}
      </Round>
      <Round @type="round" @side="left" @index="2" as |TeamContainer|>
        {{#let (this.getRound "ALCS" true) as |alcs|}}
          <TeamContainer
            @team={{this.decideTeam
              alcs
              (this.getRound "ALDS" true (this.getRound "ALWC" true))
              true
            }}
            @series={{alcs}}
            @side="top"
          />
          <TeamContainer
            @team={{this.decideTeam
              alcs
              (this.getRound "ALDS" false (this.getRound "ALWC" false))
              true
            }}
            @series={{alcs}}
            @side="bottom"
          />
        {{/let}}
      </Round>
      <Round @type="finals" as |TeamContainer|>
        {{#let (this.getRound "WS" true) as |ws|}}
          <TeamContainer
            @team={{this.decideTeam ws (this.getRound "ALCS" true) true}}
            @series={{ws}}
            @side="left"
          />
          <div class="champion">
            {{#let (this.winningTeam ws) as |champion|}}
              {{champion.clubName}}
            {{/let}}
          </div>
          <TeamContainer
            @team={{this.decideTeam ws (this.getRound "NLCS" true) true}}
            @series={{ws}}
            @side="right"
          />
        {{/let}}
      </Round>
      <Round @type="round" @side="right" @index="2" as |TeamContainer|>
        {{#let (this.getRound "NLCS" true) as |nlcs|}}
          <TeamContainer
            @team={{this.decideTeam
              nlcs
              (this.getRound "NLDS" true (this.getRound "NLWC" true))
              true
            }}
            @series={{nlcs}}
            @side="top"
          />
          <TeamContainer
            @team={{this.decideTeam
              nlcs
              (this.getRound "NLDS" false (this.getRound "NLWC" false))
              true
            }}
            @series={{nlcs}}
            @side="bottom"
          />
        {{/let}}
      </Round>
      <Round @type="round" @side="right" @index="1" as |TeamContainer|>
        {{#let
          (this.getRound "NLDS" true (this.getRound "NLWC" true))
          as |nlds1|
        }}
          <TeamContainer
            @team={{this.decideTeam nlds1 (this.getRound "NLWC" true) true}}
            @series={{nlds1}}
            @side="top"
            class="team--wc"
          />
          <TeamContainer
            @team={{this.decideTeam nlds1 (this.getRound "NLWC" true) false}}
            @series={{nlds1}}
            @side="bottom"
          />
        {{/let}}
        {{#let
          (this.getRound "NLDS" false (this.getRound "NLWC" false))
          as |nlds2|
        }}
          <TeamContainer
            @team={{this.decideTeam nlds2 (this.getRound "NLWC" false) false}}
            @series={{nlds2}}
            @side="top"
          />
          <TeamContainer
            @team={{this.decideTeam nlds2 (this.getRound "NLWC" false) true}}
            @series={{nlds2}}
            @side="bottom"
            class="team--wc"
          />
        {{/let}}
      </Round>
      <Round @type="round" @side="right" @index="0" as |TeamContainer|>
        <div>
          {{#let (this.getRound "NLWC" true) as |nlwc1|}}
            <TeamContainer
              @team={{this.getTeam nlwc1.team1.id}}
              @series={{nlwc1}}
              @side="top"
              class="mb-4"
            />
            <TeamContainer
              @team={{this.getTeam nlwc1.team2.id}}
              @series={{nlwc1}}
              @side="bottom"
            />
          {{/let}}
        </div>
        <div>
          {{#let (this.getRound "NLWC" false) as |nlwc2|}}
            <TeamContainer
              @team={{this.getTeam nlwc2.team1.id}}
              @series={{nlwc2}}
              @side="top"
              class="mb-4"
            />
            <TeamContainer
              @team={{this.getTeam nlwc2.team2.id}}
              @series={{nlwc2}}
              @side="bottom"
            />
          {{/let}}
        </div>
      </Round>
    </div>
  </template>

  @service mlbApi;

  @action
  winningTeam(series) {
    if (!series?.team1 || !series?.team2) {
      return undefined;
    }

    if (series.team1.wins > series.team2.wins) {
      return this.getTeam(series.team1.id);
    } else {
      return this.getTeam(series.team2.id);
    }
  }

  @action
  getRound(seriesType, isTop, ancestor) {
    const series = this.args.model.filter((s) => s.seriesType === seriesType);

    if (ancestor) {
      const ancestors = [ancestor.team1.id, ancestor.team2.id];
      return series.find(
        (s) => ancestors.includes(s.team1.id) || ancestors.includes(s.team2.id),
      );
    }

    if (isTop) {
      return series[0];
    } else {
      return series[1];
    }
  }

  @action
  decideTeam(series, ancestor, matchAncestor) {
    if (!series?.team1 || !series?.team2) {
      return undefined;
    }

    const ancestors = [ancestor.team1?.id, ancestor.team2?.id];
    if (ancestors.includes(series.team1.id)) {
      return this.getTeam(matchAncestor ? series.team1.id : series.team2.id);
    } else {
      return this.getTeam(matchAncestor ? series.team2.id : series.team1.id);
    }
  }

  @action
  getTeam(id) {
    return this.mlbApi.teams.find((team) => team.id === id);
  }
}
