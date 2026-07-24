import { service } from '@ember/service';
import { dasherize, singularize } from '@warp-drive/utilities/string';

export class TransformResponse {
  @service store;

  async request(context, next) {
    return next(context.request).then(({ content }) =>
      this.normalizeResponse(content, context.request.options),
    );
  }

  normalizeResponse(content, options) {
    const result = {
      data: [],
    };

    for (const key of Object.keys(content)) {
      if (key === 'copyright') {
        continue;
      }

      if (options.dataKey === key) {
        const value = content[key];
        const type = dasherize(singularize(key));

        for (const rawResource of value) {
          result.data.push(this.normalizeResource(type, rawResource));
        }
      }
    }

    return result;
  }

  normalizeResource(type, rawResource) {
    const schema = this.store.schema.resource({ type });
    const resource = {
      type,
      id: String(rawResource.id),
      attributes: {
        ...rawResource,
      },
      relationships: {},
    };

    // remove id from remaining attributes
    delete resource.attributes.id;

    for (const key of Object.keys(resource.attributes)) {
      const schemaField = schema.fields.find((f) => f.name === key);
      if (schemaField?.kind === 'belongsTo') {
        resource.relationships[key] = this.normalizeResource(
          schemaField.type,
          resource.attributes[key],
        );
        delete resource.attributes[key];
      }
    }

    return resource;
  }
}
