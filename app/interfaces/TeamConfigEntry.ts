export interface TeamConfigEntry {
  id: number;
  name: string;
  short: string;
  mainBackground: string;
  mainColor: string;
  mainText: string;
  secondaryBackground: string;
  secondaryText: string;
  stroke: string;
  divisionId: number;
  conflicts?: string[];
  priority?: number;
}
