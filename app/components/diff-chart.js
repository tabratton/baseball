import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import * as d3 from 'd3';

export default class DiffChart extends Component {
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
    return this.tooltipData?.sort((a, b) => (a.diff || 0) - (b.diff || 0));
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
      .attr('class', 'font-mono text-sm text-stone-300');
    yGridlines
      .selectAll('.tick text')
      .attr('class', 'font-mono text-sm text-stone-300');
    xAxis
      .selectAll('.tick text')
      .attr('class', 'font-mono text-sm text-stone-300');

    // Modify gridlines
    yGridlines
      .selectAll('.tick line')
      .attr('class', 'text-stone-300')
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
