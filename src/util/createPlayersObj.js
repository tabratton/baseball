import teamMap from '@/util/teamMap'

export default function(game) {
  if (!game) return null

  const homeTeam = teamMap.find(t => t.id === game.schedule.teams.home.team.id)
  const awayTeam = teamMap.find(t => t.id === game.schedule.teams.away.team.id)

  const obj = {
    gamePk: game.gamePk,
    home: {
      team: game.home.short,
      bgClass: homeTeam.bgClass,
    },
    away: {
      team: game.away.short,
      bgClass: awayTeam.bgClass,
    }
  }

  obj.home.batters = game.boxScore.teams.home.batters.map(id => game.boxScore.teams.home.players[`ID${id}`]).filter(b => b.stats.batting.plateAppearances !== undefined)
  obj.away.batters = game.boxScore.teams.away.batters.map(id => game.boxScore.teams.away.players[`ID${id}`]).filter(b => b.stats.batting.plateAppearances !== undefined)
  obj.home.pitchers = game.boxScore.teams.home.pitchers.map(id => game.boxScore.teams.home.players[`ID${id}`])
  obj.away.pitchers = game.boxScore.teams.away.pitchers.map(id => game.boxScore.teams.away.players[`ID${id}`])

  return obj
}
