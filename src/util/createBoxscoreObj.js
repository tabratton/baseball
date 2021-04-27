import { format } from 'date-fns'

export default function(gameData) {
  if (!gameData) return null

  const gameObj = {
    gameTime: format(gameData.gameTime, 'h:mm a'),
    home: {
      name: gameData.home.name,
      bgClass: gameData.home.bgClass,
      innings: []
    },
    away: {
      name: gameData.away.name,
      bgClass: gameData.away.bgClass,
      innings: []
    }
  }

  gameData.lineScore.innings.forEach(inning => {
    gameObj.home.innings.push(inning.home)
    gameObj.away.innings.push(inning.away)
  })

  if (gameData.lineScore.innings.length < gameData.schedule.scheduledInnings) {
    for (let i = gameData.lineScore.innings.length; i < gameData.schedule.scheduledInnings; i++) {
      gameObj.home.innings.push({ runs: null, hits: null, errors: null })
      gameObj.away.innings.push({ runs: null, hits: null, errors: null })
    }
  }

  const sumField = (array, field) => array.reduce((a, b) => a + Number(b[field] === 'x' ? 0 : b[field] || 0), 0)

  gameObj.home.runs = sumField(gameObj.home.innings, 'runs')
  gameObj.away.runs = sumField(gameObj.away.innings, 'runs')

  gameObj.home.hits = sumField(gameObj.home.innings, 'hits')
  gameObj.away.hits = sumField(gameObj.away.innings, 'hits')

  gameObj.home.errors = sumField(gameObj.home.innings, 'errors')
  gameObj.away.errors = sumField(gameObj.away.innings, 'errors')

  const isOver = gameData.schedule.status.statusCode === 'F' || gameData.schedule.status.statusCode === 'DR' || gameData.schedule.status.statusCode === 'O'
  const isPregame = gameData.schedule.status.statusCode === 'P' || gameData.schedule.status.statusCode === 'S'

  gameObj.isPregame = isPregame
  gameObj.inProgress = gameData.inProgress
  gameObj.status = gameData.schedule.status.abstractGameState

  if (gameObj.home.runs > gameObj.away.runs && !gameObj.home.innings[gameData.schedule.scheduledInnings - 1].runs && isOver) {
    gameObj.home.innings[gameData.schedule.scheduledInnings - 1].runs = 'x'
  }

  gameObj.home.batters = gameData.boxScore.teams.home.batters.map(id => gameData.boxScore.teams.home.players[`ID${id}`])
  gameObj.away.batters = gameData.boxScore.teams.away.batters.map(id => gameData.boxScore.teams.away.players[`ID${id}`])

  return gameObj
}
