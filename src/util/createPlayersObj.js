export default function(game) {
  if (!game) return null

  const obj = {
    gamePk: game.gamePk,
    home: {
      team: game.home.short,
      teamName: game.home.name,
      bgClass: game.home.bgClass,
      textClass: game.home.textClass,
    },
    away: {
      team: game.away.short,
      teamName: game.away.name,
      bgClass: game.away.bgClass,
      textClass: game.away.textClass,
    }
  }

  obj.home.batters = game.boxScore.teams.home.batters.map(id => game.boxScore.teams.home.players[`ID${id}`]).filter(b => b.stats.batting.plateAppearances !== undefined)
  obj.away.batters = game.boxScore.teams.away.batters.map(id => game.boxScore.teams.away.players[`ID${id}`]).filter(b => b.stats.batting.plateAppearances !== undefined)
  obj.home.pitchers = game.boxScore.teams.home.pitchers.map(id => game.boxScore.teams.home.players[`ID${id}`])
  obj.away.pitchers = game.boxScore.teams.away.pitchers.map(id => game.boxScore.teams.away.players[`ID${id}`])

  return obj
}
