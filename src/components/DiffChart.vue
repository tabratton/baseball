<template>
<div class="w-full h-[800px]" ref="chartDiv"></div>
</template>

<script>
import { disposeAllCharts, color, create, Scrollbar, useTheme } from '@amcharts/amcharts4/core';
import { Legend, LineSeries, ValueAxis, XYChart, XYCursor } from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import resolveConfig from 'tailwindcss/resolveConfig'
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import tailwindConfig from '../../tailwind.config.js'

useTheme(am4themes_animated)

const fullConfig = resolveConfig(tailwindConfig)

export default {
  name: 'DiffChart',
  props: {
    diffs: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { diffs } = toRefs(props)
    const { t } = useI18n()

    const chartDiv = ref(null)
    let chart = null

    const secondaryColorTeams = ['SF', 'SD', 'CWS', 'DET', 'CLE', 'KC', 'TB', 'SEA', 'MIL']

    const createChart = () => {
      disposeAllCharts()

      const c = create(chartDiv.value, XYChart)
      c.paddingRight = 20

      const valueAxisX = c.xAxes.push(new ValueAxis())
      valueAxisX.renderer.grid.template.location = 0
      valueAxisX.renderer.grid.template.strokeOpacity = 0.15
      valueAxisX.renderer.grid.template.stroke = color(fullConfig.theme.colors.white)
      valueAxisX.renderer.labels.template.fill = color(fullConfig.theme.colors.white)
      valueAxisX.renderer.labels.template.opacity = 0.87
      valueAxisX.renderer.fontSize = 16
      valueAxisX.adapter.add('getTooltipText', text => t('diffChart.gamesPlayed', { num: text }))

      valueAxisX.getSeriesDataItem = function(series, position) {
        const key = this.axisFieldName + this.axisLetter;
        const value = this.positionToValue(position);
        return series.dataItems.getIndex(series.dataItems.findClosestIndex(value, x => x[key] ? x[key] : undefined, 'any'));
      }

      const valueAxisY = c.yAxes.push(new ValueAxis())
      valueAxisY.renderer.grid.template.location = 0
      valueAxisY.renderer.grid.template.strokeOpacity = 0.15
      valueAxisY.renderer.grid.template.stroke = color(fullConfig.theme.colors.white)
      valueAxisY.renderer.labels.template.fill = color(fullConfig.theme.colors.white)
      valueAxisY.renderer.labels.template.opacity = 0.87
      valueAxisY.renderer.fontSize = 16
      valueAxisY.cursorTooltipEnabled = false

      c.scrollbarX = new Scrollbar()
      c.cursor = new XYCursor()
      c.cursor.lineX.stroke = color(fullConfig.theme.colors.white)
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
        series.data = team.seasonDiffs.map(d => Object.assign({}, d))
        series.dataFields.valueX = 'count'
        series.dataFields.valueY = 'diff'
        series.tooltipText = '{name}\n{diff.formatNumber("+#|#")}'
        series.stroke = teamColor
        series.fill = teamColor
        series.strokeWidth = 3
        series.cursorTooltipEnabled = true
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

      c.legend = new Legend()
      c.legend.labels.template.fill = color(fullConfig.theme.colors.white)

      chart = c
    }

    watch(diffs, createChart)
    onMounted(() => createChart())

    onBeforeUnmount(() => {
      if (chart) {
        chart.dispose()
      }
    })

    return { chartDiv }
  }
}
</script>
