import teamMap from 'baseball/utils/team-map';

export default function getTeamConfig(id) {
  return teamMap.find((team) => team.id === id);
}
