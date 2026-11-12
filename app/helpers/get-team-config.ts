import getTeamConfigUtil from 'baseball/utils/get-team-config';

export default function getTeamConfig(id: number | undefined) {
  return getTeamConfigUtil(id);
}
