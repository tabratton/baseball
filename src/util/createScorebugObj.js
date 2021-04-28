import { format } from 'date-fns'

export default function(game) {
  if (!game) return null

  const isOver = game.schedule.status.statusCode === 'F' || game.schedule.status.statusCode === 'DR' || game.schedule.status.statusCode === 'O'
  const isPregame = game.schedule.status.statusCode === 'P' || game.schedule.status.statusCode === 'S'

  const obj = {
    gamePk: game.gamePk,
    isTop: game.lineScore.isTopInning,
    inProgress: game.inProgress,
    home: {
      team: game.home.short,
      bgClass: game.home.bgClass,
      textClass: game.home.textClass,
      score: game.lineScore.teams.home.runs || 0,
      currentPlayer: null
    },
    away: {
      team: game.away.short,
      bgClass: game.away.bgClass,
      textClass: game.away.textClass,
      score: game.lineScore.teams.away.runs || 0,
      currentPlayer: null
    }
  }

  if (obj.isTop) {
    obj.home.currentPlayer = game.boxScore.teams.home.players[`ID${(game.lineScore.defense.pitcher || {}).id}`]
    obj.away.currentPlayer = game.boxScore.teams.away.players[`ID${(game.lineScore.offense.batter || {}).id}`]
    obj.away.order = obj.away.currentPlayer ? `${Math.floor(Number(obj.away.currentPlayer.battingOrder) / 100)}.` : ''
  } else {
    obj.home.currentPlayer = game.boxScore.teams.home.players[`ID${(game.lineScore.offense.batter || {}).id}`]
    obj.away.currentPlayer = game.boxScore.teams.away.players[`ID${(game.lineScore.defense.pitcher || {}).id}`]
    obj.home.order = obj.home.currentPlayer ? `${Math.floor(Number(obj.home.currentPlayer.battingOrder) / 100)}.` : ''
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
    obj.batterCount = format(game.gameTime, 'hh:mm a')
  }

  return obj
}
