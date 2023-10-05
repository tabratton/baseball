import { fn, get } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import { scheduleOnce } from '@ember/runloop';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import * as d3 from 'd3';
import formatNumber from 'ember-intl/helpers/format-number';
import and from 'ember-truth-helpers/helpers/and';
import or from 'ember-truth-helpers/helpers/or';

import didResize from '../modifiers/did-resize';
import positionElement from '../modifiers/position-element';

class Line extends Component {
  <template>
    <path
      class='fill-transparent stroke-[0.25rem] {{@team.team.stroke}}'
      d={{this.lineData}}
    >
    </path>
    <g transform='translate({{this.logoPosition.x}}, {{this.logoPosition.y}})'>
      <circle stroke="white" fill="white" opacity="0.8" cx="16" cy="16" r={{this.circleRadius}} />
      <image href={{@team.logo}} height={{this.logoSize}} width={{this.logoSize}} />
    </g>
  </template>

  logoSize = 32;
  circleRadius = this.logoSize / 2;

  get seasonDiffs() {
    return this.args.team.seasonDiffs;
  }

  @cached
  get d3Line() {
    return d3
      .line()
      .x((d) => this.args.xScale(d.count))
      .y((d) => this.args.yScale(d.diff));
  }

  @cached
  get lineData() {
    return this.d3Line(this.seasonDiffs);
  }

  @cached
  get logoPosition() {
    const lastItem = this.seasonDiffs[this.seasonDiffs.length - 1];
    return {
      x: this.args.xScale(lastItem?.count || 0) - this.logoSize / 2,
      y: this.args.yScale(lastItem?.diff || 0) - this.logoSize / 2,
    };
  }

  get tooltipItem() {
    const itemIndex = Math.floor(this.args.xScale.invert(this.args.tooltipX));
    return this.seasonDiffs[itemIndex];
  }

  @cached
  get tooltipY() {
    const tooltipItem = this.tooltipItem;
    return this.args.yScale(tooltipItem?.diff || 0);
  }
}

export default class DiffChart extends Component {
  <template>
    <div class="relative" ...attributes {{on 'pointerenter' this.onPointerMoved}}
      {{on 'pointermove' this.onPointerMoved}}
      {{on 'pointerleave' this.onPointerLeave}}>
      <svg
        class='diff-chart h-full w-full'
        {{didInsert this.onInsert}}
        {{didUpdate this.redrawChartElements this.yValues this.xValues}}
        {{didResize this.updateDimensions}}
      >
        <g
          aria-hidden='true'
          class='y-axis {{if @enableGridlines "hidden"}}'
          transform='translate({{this.yAxisWidth}}, {{this.margin.top}})'
        >
        </g>
        <g
          class='gridlines {{unless @enableGridlines "hidden"}}'
          transform='translate({{this.yAxisWidth}}, {{this.margin.top}})'
        ></g>
        <g
          aria-hidden='true'
          class='x-axis'
          transform='translate(0, {{this.xAxisPosition}})'
        >
        </g>
        <g class='canvas' transform='translate(0, {{this.margin.top}})'>
          {{#each this.filteredData as |team|}}
            <Line
              @team={{team}}
              @tooltipX={{this.tooltipX}}
              @showTooltip={{this.showTooltips}}
              @xScale={{this.xScale}}
              @yScale={{this.yScale}}
            />
          {{/each}}
        </g>
      </svg>
      {{#if (and this.showTooltips this.tooltipData)}}
        <div
          class='flex flex-col rounded bg-stone-800 shadow w-max absolute'
          {{positionElement top=this.margin.top left=this.tooltipX}}
        >
          <div class='p-2'>
            {{get this.tooltipData '0.count'}} games played
          </div>
          {{#each this.tooltipDataSorted as |tooltip|}}
            <div class='flex flex-col p-2 items-center {{tooltip.team.mainBackground}} {{tooltip.team.mainText}}'>
              <span>{{tooltip.team.short}}</span>
              <span>{{formatNumber (or tooltip.diff 0) signDisplay='exceptZero'}}</span>
            </div>
          {{/each}}
        </div>
      {{/if}}
    </div>
    <div class='flex items-center justify-center gap-4'>
      {{#each @data as |team|}}
        <div
          class='flex items-center justify-center gap-1 cursor-pointer'
          role='button'
          {{on 'click' (fn this.toggleTeam team)}}
        >
          <span class='h-[0.25rem] w-[1.5rem] {{if team.selected team.team.mainBackground "bg-stone-700"}}'></span>
          <span>{{team.team.short}}</span>
        </div>
      {{/each}}
    </div>
  </template>

  @tracked height = 1;
  @tracked width = 1;
  @tracked el;

  @tracked xAxisHeight = 0;
  @tracked yAxisWidth = 0;

  @tracked yPlotPadding = 1.1;

  @tracked showTooltips = false;
  @tracked tooltipX = 0;

  margin = { top: 16, right: 0, bottom: 16, left: 0 };

  @cached
  get filteredData() {
    return this.args.data.filter((d) => d.selected);
  }

  @cached
  get tooltipData() {
    const itemIndex = Math.floor(this.xScale.invert(this.tooltipX));

    if (
      itemIndex > (this.xDomain[1] || 0) ||
      itemIndex < (this.xDomain[0] || 0)
    )
      return null;

    return this.filteredData.map((d) => {
      const item = d.seasonDiffs.find((diff) => diff.count === itemIndex);
      return {
        ...item,
        y: this.yScale(item?.diff || 0),
        team: d.team,
      };
    });
  }

  get tooltipDataSorted() {
    return this.tooltipData?.sort((a, b) => (b.diff || 0) - (a.diff || 0));
  }

  get enableGridlines() {
    return this.args.enableGridlines || false;
  }

  get plotAreaHeight() {
    return (
      this.height - this.margin.top - this.margin.bottom - this.xAxisHeight
    );
  }

  get xAxisPosition() {
    return this.height - this.margin.bottom - this.xAxisHeight;
  }

  get plotAreaWidth() {
    return this.width - this.margin.left - this.margin.right - this.yAxisWidth;
  }

  get yRange() {
    return [this.plotAreaHeight, 0];
  }

  @cached
  get yValues() {
    return this.filteredData
      .map((wd) => wd.seasonDiffs.map((sd) => sd.diff))
      .reduce((a, b) => a.concat(b), []);
  }

  @cached
  get yDomain() {
    return [
      (d3.min(this.yValues) || 0) * this.yPlotPadding,
      (d3.max(this.yValues) || 0) * this.yPlotPadding,
    ];
  }

  @cached
  get yScale() {
    return d3.scaleLinear().domain(this.yDomain).range(this.yRange).nice();
  }

  @cached
  get yAxis() {
    return d3.axisLeft(this.yScale);
  }

  @cached
  get yGridlines() {
    return d3
      .axisLeft(this.yScale)
      .ticks(8, '.0f')
      .tickSize(-this.plotAreaWidth + this.yAxisWidth)
      .tickPadding(8);
  }

  get xRange() {
    return [this.yAxisWidth, this.plotAreaWidth];
  }

  @cached
  get xValues() {
    return this.filteredData
      .map((wd) => wd.seasonDiffs.map((sd) => sd.count))
      .reduce((a, b) => a.concat(b), []);
  }

  @cached
  get xDomain() {
    return [0, d3.max(this.xValues) || 1];
  }

  @cached
  get xScale() {
    return d3.scaleLinear().domain(this.xDomain).range(this.xRange).nice();
  }

  @cached
  get xAxis() {
    return d3.axisBottom(this.xScale).tickSizeOuter(0);
  }

  @action
  onInsert(element) {
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    this.el = element;
    this.redrawChartElements();
    scheduleOnce('afterRender', this, this.getAxisDimensions);
  }

  @action
  updateDimensions(entry) {
    let updated = false;
    if (this.width !== entry.contentRect.width) {
      this.width = entry.contentRect.width;
      updated = true;
    }

    if (this.height !== entry.contentRect.height) {
      this.height = entry.contentRect.height;
      updated = true;
    }

    if (updated) {
      this.redrawChartElements();
    }
  }

  getAxisDimensions() {
    const element = this.el;
    const yAxis = element.querySelector('.y-axis');
    const xAxis = element.querySelector('.x-axis');
    this.yAxisWidth = yAxis.getBBox().width;
    this.xAxisHeight = xAxis.getBBox().height;
    this.redrawChartElements();
  }

  @action
  redrawChartElements() {
    if (!this.el) return;
    const $el = d3.select(this.el);

    const yAxis = $el.select('.y-axis').call(this.yAxis);
    const yGridlines = $el.select('.gridlines').call(this.yGridlines);
    const xAxis = $el.select('.x-axis').call(this.xAxis);

    // Modify labels
    yAxis
      .selectAll('.tick text')
      .attr('class', 'font-mono text-sm text-stone-50');
    yGridlines
      .selectAll('.tick text')
      .attr('class', 'font-mono text-sm text-stone-50');
    xAxis
      .selectAll('.tick text')
      .attr('class', 'font-mono text-sm text-stone-50');

    // Modify gridlines
    yGridlines
      .selectAll('.tick line')
      .attr('class', 'text-stone-50')
      .attr('stroke-width', '0.5');
  }

  @action
  toggleTeam(team) {
    team.selected = !team.selected;
  }

  @action
  onPointerLeave() {
    this.showTooltips = false;
  }

  @action
  onPointerMoved(event) {
    this.tooltipX = event.clientX - this.yAxisWidth;
    this.showTooltips =
      this.tooltipX > (this.xRange[0] || 0) &&
      this.tooltipX < (this.xRange[1] || 0);
  }
}
