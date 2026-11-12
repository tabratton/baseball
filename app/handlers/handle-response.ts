import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import type { Handler, NextFn } from '@warp-drive/core/request';
import type { RequestContext } from '@warp-drive/core/types/request';
import { dasherize, singularize } from '@warp-drive/utilities/string';

type RawResource = Record<string, unknown> & { id: string | number };
type RawResponse = Record<string, unknown>;

interface NormalizedResource {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships: Record<string, NormalizedResource>;
}

/**
 * Converts raw MLB Stats API responses into JSON:API documents the store's
 * cache understands. The key in the response that holds the resources is
 * passed as the `dataKey` request option.
 */
export class TransformResponse implements Handler {
  @service declare store: Store;

  async request<T>(context: RequestContext, next: NextFn<T>): Promise<T> {
    return next(context.request).then(
      ({ content }) =>
        this.normalizeResponse(
          content as RawResponse,
          context.request.options ?? {},
        ) as T,
    );
  }

  normalizeResponse(
    content: RawResponse,
    options: Readonly<Record<string, unknown>>,
  ) {
    const result: { data: NormalizedResource[] } = {
      data: [],
    };

    for (const key of Object.keys(content)) {
      if (key === 'copyright') {
        continue;
      }

      if (options.dataKey === key) {
        const value = content[key] as RawResource[];
        const type = dasherize(singularize(key));

        for (const rawResource of value) {
          result.data.push(this.normalizeResource(type, rawResource));
        }
      }
    }

    return result;
  }

  normalizeResource(
    type: string,
    rawResource: RawResource,
  ): NormalizedResource {
    const schema = this.store.schema.resource({ type });
    const attributes: Record<string, unknown> = { ...rawResource };
    const relationships: Record<string, NormalizedResource> = {};
    const resource = {
      type,
      id: String(rawResource.id),
      attributes,
      relationships,
    };

    // remove id from remaining attributes
    delete attributes.id;

    for (const key of Object.keys(attributes)) {
      const schemaField = schema.fields.find((f) => f.name === key);
      if (schemaField?.kind === 'belongsTo') {
        relationships[key] = this.normalizeResource(
          schemaField.type,
          attributes[key] as RawResource,
        );
        delete attributes[key];
      }
    }

    return resource;
  }
}
