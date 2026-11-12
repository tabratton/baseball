import type { ObjectSchema } from '@warp-drive/core/types/schema/fields';

export const SportSchema = {
  type: 'sport',
  identity: null,
  fields: [
    { kind: 'field', name: 'id' },
    { kind: 'field', name: 'name' },
    { kind: 'field', name: 'link' },
  ],
} satisfies ObjectSchema;
