import Component from '@glimmer/component';

import { concat } from '@ember/helper';
import t from 'ember-intl/helpers/t';

import dateFormat from '../helpers/date-format';
import withDefault from '../helpers/with-default';

export default class Boxscore extends Component {
  <template>
    <div class="boxscore" ...attributes>
      <table class="table-auto text-center border-2 border-stone-50 w-full">
        <thead>
          <tr class="bg-stone-800 border-b-2 border-stone-50">
            <th class="text-left p-2 border-r-2 border-stone-50">{{t
                (concat "status." @game.statusCode)
              }}</th>
            {{#each this.innings as |inning|}}
              <th class="p-2">{{inning}}</th>
            {{/each}}
            <th class="p-2 border-l-2 border-stone-50">R</th>
            <th class="p-2">H</th>
            <th class="p-2">E</th>
          </tr>
        </thead>
        <tbody>
          <tr class="{{@game.awayTeam.bgClass}} {{@game.awayTeam.textClass}}">
            <td class="text-left px-2 py-1 border-r-2 border-stone-50">
              <span class="whitespace-nowrap">
                <span class="text-sm">{{@game.awayTeam.locationName}}</span>
                <span class="font-bold">{{@game.awayTeam.teamName}}</span>
              </span>
              <span class="block text-xs font-bold">
                {{@game.awayTeamRecord}}
              </span>
            </td>
            {{#each @game.awayTeam.innings as |inning|}}
              <td class="px-2 py-1">{{withDefault
                  inning.runs
                  (if @game.isOver "x" "")
                }}</td>
            {{/each}}
            <td
              class="px-2 py-1 border-l-2 border-stone-50 font-bold"
            >{{@game.awayTeam.runs}}</td>
            <td class="px-2 py-1">{{@game.awayTeam.hits}}</td>
            <td class="px-2 py-1">{{@game.awayTeam.errors}}</td>
          </tr>
          <tr class="{{@game.homeTeam.bgClass}} {{@game.homeTeam.textClass}}">
            <td class="text-left px-2 py-1 border-r-2 border-stone-50">
              <span class="whitespace-nowrap">
                <span class="text-sm">{{@game.homeTeam.locationName}}</span>
                <span class="font-bold">{{@game.homeTeam.teamName}}</span>
              </span>
              <span class="block text-xs font-bold">
                {{@game.homeTeamRecord}}
              </span>
            </td>
            {{#each @game.homeTeam.innings as |inning|}}
              <td class="px-2 py-1">{{withDefault
                  inning.runs
                  (if @game.isOver "x" "")
                }}</td>
            {{/each}}
            <td
              class="px-2 py-1 border-l-2 border-stone-50 font-bold"
            >{{@game.homeTeam.runs}}</td>
            <td class="px-2 py-1">{{@game.homeTeam.hits}}</td>
            <td class="px-2 py-1">{{@game.homeTeam.errors}}</td>
          </tr>
        </tbody>
      </table>
      <div
        class="grid grid-cols-3 gap-2 p-2 text-xs font-bold border-2 border-t-0 border-stone-50 bg-stone-800"
      >
        {{#if @game.isPregame}}
          <span>{{t
              "boxscore.starts"
              time=(dateFormat date=@game.gameTime format="h:mm a")
            }}</span>
        {{/if}}
        {{#if @game.isOver}}
          <span class="text-center">{{if @game.winningPitcher "Win: "}}
            {{@game.winningPitcher}}</span>
        {{/if}}
        {{#if @game.isOver}}
          <span class="text-center">{{if @game.losingPitcher "Loss: "}}
            {{@game.losingPitcher}}</span>
        {{/if}}
        {{#if @game.isOver}}
          <span class="text-center">{{if @game.save "Save: "}}
            {{@game.save}}</span>
        {{/if}}
        {{#unless @game.isPregame}}
          <span class="col-span-3 text-center">Duration:
            {{@game.gameDuration}}</span>
        {{/unless}}
      </div>
    </div>
  </template>

  get innings() {
    return this.args.game.awayTeam.innings.map(
      (inning, index) => `${index + 1}`
    );
  }
}
