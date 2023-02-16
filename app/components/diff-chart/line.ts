import Component from '@glimmer/component';
import WinDifferential, {
  DifferentialReduction,
} from 'baseball/models/WinDifferential';
import { cached } from '@glimmer/tracking';
import * as d3 from 'd3';
import { ScaleLinear } from 'd3';

interface LineArgs {
  team: WinDifferential;
  tooltipX: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
}

export default class Line extends Component<LineArgs> {
  logoSize = 32;

  get seasonDiffs() {
    return this.args.team.seasonDiffs;
  }

  @cached
  get d3Line() {
    return d3
      .line<DifferentialReduction>()
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

  @cached
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
