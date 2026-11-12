import teamMap, { type TeamConfig } from 'baseball/utils/team-map';

export default function getTeamConfig(
  id: number | undefined,
): TeamConfig | undefined {
  return teamMap.find((team) => team.id === id);
}
