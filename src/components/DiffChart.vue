<template>
<div class="w-full h-[800px]" ref="chartDiv"></div>
</template>

<script>
import { toRefs, ref, onMounted, onBeforeUnmount, watch } from 'vue'

import { color, create, useTheme } from '@amcharts/amcharts4/core';
import { XYChart, ValueAxis, LineSeries, XYCursor, XYChartScrollbar } from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

useTheme(am4themes_animated);

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig)

export default {
  name: 'SortableTable',
  props: {
    diffs: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { diffs } = toRefs(props)

    const chartDiv = ref(null)
    const chart = ref(null)

    const secondaryColorTeams = ['SF', 'SD', 'CWS', 'DET', 'CLE', 'KC', 'TB', 'SEA', 'MIL']

    const createChart = () => {
      if (chart.value) {
        chart.value.dispose()
      }

      const c = create(chartDiv.value, XYChart)
      c.paddingRight = 20

      const valueAxisX = c.xAxes.push(new ValueAxis())
      valueAxisX.renderer.grid.template.location = 0
      valueAxisX.renderer.grid.template.strokeOpacity = 0.15
      valueAxisX.renderer.grid.template.stroke = color('#F9FAFB')
      valueAxisX.renderer.labels.template.fill = color('#F9FAFB')
      valueAxisX.renderer.labels.template.opacity = 0.87
      valueAxisX.renderer.fontSize = 16
      valueAxisX.adapter.add('getTooltipText', text => `${text} Games Played`);

      valueAxisX.getSeriesDataItem = function(series, position) {
        const key = this.axisFieldName + this.axisLetter;
        const value = this.positionToValue(position);
        return series.dataItems.getIndex(series.dataItems.findClosestIndex(value, x => x[key] ? x[key] : undefined, "any"));
      }

      const valueAxisY = c.yAxes.push(new ValueAxis())
      valueAxisY.renderer.grid.template.location = 0
      valueAxisY.renderer.grid.template.strokeOpacity = 0.15
      valueAxisY.renderer.grid.template.stroke = color('#F9FAFB')
      valueAxisY.renderer.labels.template.fill = color('#F9FAFB')
      valueAxisY.renderer.labels.template.opacity = 0.87
      valueAxisY.renderer.fontSize = 16
      valueAxisY.cursorTooltipEnabled = false

      const scrollbarX = new XYChartScrollbar()
      c.scrollbarX = scrollbarX
      c.cursor = new XYCursor()
      c.cursor.lineY.disabled = true

      diffs.value.forEach(team => {
        const series = c.series.push(new LineSeries())
        let teamColor;

        if (secondaryColorTeams.includes(team.short)) {
          teamColor = color(fullConfig.theme.colors[team.short.toLowerCase()].secondary)
        } else {
          teamColor = color(fullConfig.theme.colors[team.short.toLowerCase()].main)
        }

        series.name = team.short
        series.data = team.seasonDiffs
        series.dataFields.valueX = 'count'
        series.dataFields.valueY = 'diff'
        series.tooltipText = '{name}\n{diff.formatNumber("+#|#")}'
        series.stroke = teamColor
        series.fill = teamColor
        series.strokeWidth = 3
        series.cursorTooltipEnabled = true
        scrollbarX.series.push(series)
      })

      c.scrollbarX.thumb.background.fill = color('#E5E7EB')
      c.scrollbarX.thumb.background.fillOpacity = 0.05

      function customizeGrip(grip) {
        grip.icon.disabled = true
        grip.background.fill = color('#E5E7EB')
        grip.background.fillOpacity = 1
      }

      customizeGrip(c.scrollbarX.startGrip)
      customizeGrip(c.scrollbarX.endGrip)

      // TODO: Custom tooltip adapter, style chart

      chart.value = c
    }

    watch(diffs, createChart)
    onMounted(() => createChart())

    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value.dispose()
      }
    })

    return { chartDiv }
  }
}
</script>

 <style>
 foreignObject > div {
   white-space: unset !important;
 }
 </style>
