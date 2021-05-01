import numbro from 'numbro'

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

  const mapBatter = player => {
    player.stats.batting.avg = numbro((player.stats.batting.hits || 0) / (player.stats.batting.atBats || 1)).format({ mantissa: 3 }).replace(/^0/, '')
    player.stats.batting.singles = player.stats.batting.hits - player.stats.batting.doubles - player.stats.batting.triples - player.stats.batting.homeRuns
    return player
  }

  const mapPitcher = player => {
    player.stats.pitching.era = numbro(player.stats.pitching.earnedRuns * 9 / Number(player.stats.pitching.inningsPitched)).format({ mantissa: 2 })
    player.stats.pitching.ballsAndStrikes = `${player.stats.pitching.balls}/${player.stats.pitching.strikes}`
    return player
  }

  obj.home.batters = game.boxScore.teams.home.batters
    .map(id => game.boxScore.teams.home.players[`ID${id}`])
    .filter(b => b.stats.batting.plateAppearances !== undefined)
    .map(mapBatter)
  obj.away.batters = game.boxScore.teams.away.batters
    .map(id => game.boxScore.teams.away.players[`ID${id}`])
    .filter(b => b.stats.batting.plateAppearances !== undefined)
    .map(mapBatter)
  obj.home.pitchers = game.boxScore.teams.home.pitchers
    .map(id => game.boxScore.teams.home.players[`ID${id}`])
    .map(mapPitcher)
  obj.away.pitchers = game.boxScore.teams.away.pitchers
    .map(id => game.boxScore.teams.away.players[`ID${id}`])
    .map(mapPitcher)

  return obj
}
