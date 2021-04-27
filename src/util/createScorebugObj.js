import { format } from 'date-fns'

import teamMap from '@/util/teamMap'

export default function(game) {
  if (!game) return null

  const isOver = game.schedule.status.statusCode === 'F' || game.schedule.status.statusCode === 'DR' || game.schedule.status.statusCode === 'O'
  const isPregame = game.schedule.status.statusCode === 'P' || game.schedule.status.statusCode === 'S'
  const homeTeam = teamMap.find(t => t.id === game.schedule.teams.home.team.id)
  const awayTeam = teamMap.find(t => t.id === game.schedule.teams.away.team.id)

  const obj = {
    gamePk: game.gamePk,
    isTop: game.lineScore.isTopInning,
    inProgress: game.inProgress,
    home: {
      team: game.home.short,
      bgClass: homeTeam.bgClass,
      score: game.lineScore.teams.home.runs || 0,
      currentPlayer: null
    },
    away: {
      team: game.away.short,
      bgClass: awayTeam.bgClass,
      score: game.lineScore.teams.away.runs || 0,
      currentPlayer: null
    }
  }

  if (obj.isTop) {
    obj.home.currentPlayer = game.boxScore.teams.home.players[`ID${(game.lineScore.defense.pitcher || {}).id}`]
    obj.away.currentPlayer = game.boxScore.teams.away.players[`ID${(game.lineScore.offense.batter || {}).id}`]
    obj.away.order = obj.away.currentPlayer ? `${Number(obj.away.currentPlayer.battingOrder) / 100}.` : ''
  } else {
    obj.home.currentPlayer = game.boxScore.teams.home.players[`ID${(game.lineScore.offense.batter || {}).id}`]
    obj.away.currentPlayer = game.boxScore.teams.away.players[`ID${(game.lineScore.defense.pitcher || {}).id}`]
    obj.home.order = obj.home.currentPlayer ? `${Number(obj.home.currentPlayer.battingOrder) / 100}.` : ''
  }

  if (isOver || isPregame) {
    obj.inning = game.schedule.status.abstractGameState
    obj.displaySide = false
    obj.batterCount = null
    obj.outs = [false, false]
    obj.runners = [{ num: 1, runner: false }, { num: 2, runner: false }, { num: 3, runner: false }]
  } else {
    obj.inning = game.lineScore.currentInning
    obj.displaySide = true
    obj.batterCount = `${game.lineScore.balls}-${game.lineScore.strikes}`
    obj.outs = [game.lineScore.outs >= 1, game.lineScore.outs >= 2]
    obj.runners = [{ num: 1, runner: !!game.lineScore.offense.first }, { num: 2, runner: !!game.lineScore.offense.second }, { num: 3, runner: !!game.lineScore.offense.third }]
  }

  if (isPregame) {
    obj.batterCount = format(game.gameTime, 'h:mm a')
  }

  return obj
}
