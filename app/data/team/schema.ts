import type { ResourceSchema } from '@warp-drive/core/types/schema/fields';

// import { withDefaults } from '@warp-drive/legacy/model/migration-support';

export const TeamSchema = {
  type: 'team',
  identity: { kind: '@id', name: 'id' },
  fields: [
    { kind: 'field', name: 'abbreviation' },
    { kind: 'field', name: 'active' },
    { kind: 'field', name: 'allStarStatus' },
    { kind: 'field', name: 'clubName' },
    {
      kind: 'schema-object',
      name: 'division',
      type: 'division',
      // options: { async: false, inverse: null },
    },
    { kind: 'field', name: 'fileCode' },
    { kind: 'field', name: 'firstYearOfPlay' },
    { kind: 'field', name: 'franchiseName' },
    {
      kind: 'schema-object',
      name: 'springLeague',
      type: 'league',
      // options: { async: false, inverse: null },
    },
    {
      kind: 'schema-object',
      name: 'league',
      type: 'league',
      // options: { async: false, inverse: null },
    },
    { kind: 'field', name: 'link' },
    { kind: 'field', name: 'locationName' },
    { kind: 'field', name: 'name' },
    { kind: 'field', name: 'parentOrgId' },
    { kind: 'field', name: 'parentOrgName' },
    { kind: 'field', name: 'season' },
    { kind: 'field', name: 'shortName' },
    {
      kind: 'schema-object',
      name: 'sport',
      type: 'sport',
      // options: { async: false, inverse: null },
    },
    { kind: 'field', name: 'teamCode' },
    { kind: 'field', name: 'teamName' },
    {
      kind: 'schema-object',
      name: 'springVenue',
      type: 'venue',
      // options: { async: false, inverse: null },
    },
    {
      kind: 'schema-object',
      name: 'venue',
      type: 'venue',
      // options: { async: false, inverse: null },
    },
  ],
} satisfies ResourceSchema;

interface IdNameLink {
  id: number;
  name: string;
  link: string;
}

/** The shape of a `team` record created from {@link TeamSchema}. */
export interface Team {
  id: string;
  abbreviation: string;
  active: boolean;
  allStarStatus: string;
  clubName: string;
  division: IdNameLink;
  fileCode: string;
  firstYearOfPlay: string;
  franchiseName: string;
  springLeague: IdNameLink;
  league: IdNameLink;
  link: string;
  locationName: string;
  name: string;
  parentOrgId?: number;
  parentOrgName?: string;
  season: number;
  shortName: string;
  sport: IdNameLink;
  teamCode: string;
  teamName: string;
  springVenue: IdNameLink;
  venue: IdNameLink;
}
