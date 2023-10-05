import { array, concat, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import findBy from 'ember-composable-helpers/helpers/find-by';
import t from 'ember-intl/helpers/t';
import and from 'ember-truth-helpers/helpers/and';
import not from 'ember-truth-helpers/helpers/not';

import Chevron from './chevron';
import dateFormat from '../helpers/date-format';
import PlayerName from './player-name';

export default class Scorebug extends Component {
  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <div
      class='scorebug flex mx-auto md:mx-0 border-2 border-stone-50 rounded h-[136px] {{unless @disableClick "cursor-pointer"}}'
      ...attributes
    >
      <table class='table-auto text-stone-50 rounded' {{on 'click' this.goToBoxScore}}>
        <caption class='sr-only'>{{t 'scorebug.score'}}</caption>
        <thead class='sr-only'>
        <tr>
          <th scope='col'>{{t 'scorebug.team'}}</th>
          <th scope='col'>{{t 'scorebug.score'}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class='py-2.5 pl-2 whitespace-nowrap italic font-bold rounded-tl-[2px] {{concat @game.awayTeam.bgClass ' ' @game.awayTeam.textClass}}'>
            {{@game.awayTeam.short}}
          </td>
          <td class='py-2.5 pr-2 text-right whitespace-nowrap font-bold rounded-tr-[2px] {{concat @game.awayTeam.bgClass ' ' @game.awayTeam.textClass}}'>
            {{@game.awayTeam.runs}}
          </td>
        </tr>

        <tr class={{concat @game.homeTeam.bgClass ' ' @game.homeTeam.textClass}}>
          <td class='py-2.5 pl-2 whitespace-nowrap italic font-bold'>
            {{@game.homeTeam.short}}
          </td>
          <td class='py-2.5 pr-2 text-right whitespace-nowrap font-bold'>
            {{@game.homeTeam.runs}}
          </td>
        </tr>

        <tr>
          {{#if @game.inProgress}}
            <td
              class='bg-stone-900 py-2.5 pl-0 pr-2 sm:pr-4 flex items-center justify-start w-full whitespace-nowrap rounded-bl'
            >
              <Chevron @isUp={{@game.isTopInning}} />
              <span>{{@game.inning}}</span>
            </td>
          {{else if @game.isOver}}
            <td class='bg-stone-900 py-2.5 pl-2 pr-1 whitespace-nowrap rounded-bl'>
              {{t (concat 'status.' @game.statusCode)}}
            </td>
          {{else}}
            <td class="bg-stone-900 py-2.5 pl-2 pr-1 whitespace-nowrap rounded-bl"></td>
          {{/if}}
          <td class='bg-stone-900 text-right py-2.5 pl-1 pr-2 whitespace-nowrap rounded-br'>
            {{#if @game.isPregame}}
              {{dateFormat date=@game.gameTime format='hh:mm a'}}
            {{else if @game.inProgress}}
              {{concat @game.balls '-' @game.strikes}}
            {{/if}}
          </td>
        </tr>
        </tbody>
      </table>
      {{#if @game.inProgress}}
        <div class='flex flex-col justify-center w-28 items-center bg-stone-900' {{on 'click' this.goToBoxScore}}>
          <div class='flex-grow w-28 relative'>
            <div
              class='w-16 h-16 flex flex-wrap transform rotate-45 translate-x-6 translate-y-6 absolute'
            >
              {{#each
                (array
                  (findBy 'num' 2 @game.runners)
                  (findBy 'num' 1 @game.runners)
                  (findBy 'num' 3 @game.runners)
                )
              as |base|
              }}
                <div
                  class='w-8 h-8 border-2 border-stone-800 bg-stone-500 transition-colors duration-700
                {{if base.runner "bg-yellow-600"}}'
                ></div>
              {{/each}}
              <svg
                class='home-plate transform -rotate-45 mt-3 ml-3'
                viewBox='189.848 157.915 17 17.119'
                width='17'
                height='17.119'
              >
                <path
                  class="fill-white stroke-black"
                  d='M 206.503 166.512 L 197.953 175.012 M 189.848 157.915 L 206.848 157.915 M 190.348 158.399 L 190.348 166.899 M 206.36 158.399 L 206.36 166.899 M 190.203 166.512 L 198.633 175.034'
                ></path>
                <polygon
                  class="fill-white stroke-white"
                  points='198.283 173.812 190.966 166.441 190.966 158.512 205.766 158.512 205.832 166.458'
                ></polygon>
              </svg>
            </div>
          </div>
          <div class='flex justify-center items-center w-full'>
            {{#each @game.outs as |out|}}
              <div
                class='rounded-full w-4 h-4 m-2 bg-stone-500 transition-colors duration-700
              {{if out "bg-yellow-600"}}'
              ></div>
            {{/each}}
          </div>
        </div>
      {{/if}}
      {{#if (and @game.inProgress @game.batter @game.pitcher)}}
        <div class='{{unless this.playerInfoExpanded "hidden"}}'>
          <table
            class='table table-auto text-stone-50 rounded'
            {{on 'click' this.goToBoxScore}}
          >
            <caption class='sr-only'>{{t 'scorebug.current_players'}}</caption>
            <thead class='sr-only'>
            <tr>
              <th>{{t 'scorebug.player'}}</th>
              <th>{{t 'scorebug.stat'}}</th>
            </tr>
            </thead>
            <tbody>
            <tr
              class={{concat @game.awayTeam.bgClass ' ' @game.awayTeam.textClass}}
            >
              <td class='px-2 py-2.5 text-right whitespace-nowrap'>
                {{#if @game.isTopInning}}
                  {{@game.batter.battingOrder}}
                  <PlayerName>
                    <:first>{{@game.batter.firstName}}</:first>
                    <:last>{{@game.batter.lastName}}</:last>
                  </PlayerName>
                {{else}}
                  <PlayerName>
                    <:first>{{@game.pitcher.firstName}}</:first>
                    <:last>{{@game.pitcher.lastName}}</:last>
                  </PlayerName>
                {{/if}}
              </td>
              <td class='px-2 py-2.5 text-right'>
                {{#if @game.isTopInning}}
                  {{t
                    'scorebug.batter_stats'
                    hits=@game.batter.hits
                    atBats=@game.batter.atBats
                  }}
                {{else}}
                  {{t
                    'scorebug.pitches'
                    num=@game.pitcher.pitchesThrown
                  }}
                {{/if}}
              </td>
            </tr>
            <tr
              class={{concat @game.homeTeam.bgClass ' ' @game.homeTeam.textClass}}
            >
              <td class='px-2 py-2.5 text-right whitespace-nowrap'>
                {{#if @game.isTopInning}}
                  <PlayerName>
                    <:first>{{@game.pitcher.firstName}}</:first>
                    <:last>{{@game.pitcher.lastName}}</:last>
                  </PlayerName>
                {{else}}
                  {{@game.batter.battingOrder}}
                  <PlayerName>
                    <:first>{{@game.batter.firstName}}</:first>
                    <:last>{{@game.batter.lastName}}</:last>
                  </PlayerName>
                {{/if}}
              </td>
              <td class='px-2 py-2.5 text-right'>
                {{#if @game.isTopInning}}
                  {{t
                    'scorebug.pitches'
                    num=@game.pitcher.pitchesThrown
                  }}
                {{else}}
                  {{t
                    'scorebug.batter_stats'
                    hits=@game.batter.hits
                    atBats=@game.batter.atBats
                  }}
                {{/if}}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      {{/if}}
      {{#if @game.inProgress}}
        <div
          class='text-stone-50 bg-stone-900 pt-2 pr-1 pl-1 cursor-pointer'
          role='button'
          {{on
            'click'
            (fn (mut this.playerInfoExpanded) (not this.playerInfoExpanded))
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            class='h-6 w-6 transition-transform duration-400
          {{if this.playerInfoExpanded "transform rotate-180"}}'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            role='presentation'
          >
            <path
              role='presentation'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M13 5l7 7-7 7M5 5l7 7-7 7'
            ></path>
          </svg>
        </div>
      {{/if}}
    </div>
  </template>

  @service router;

  @tracked playerInfoExpanded = false;

  @action
  goToBoxScore() {
    this.router.transitionTo('boxscore', this.args.game.gamePk);
  }
}
