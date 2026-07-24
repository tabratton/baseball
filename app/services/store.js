import { getOwner, setOwner } from '@ember/owner';
import { Fetch, RequestManager, CacheHandler, Store } from '@warp-drive/core';
import { DefaultCachePolicy } from '@warp-drive/core/store';
import {
  registerDerivations,
  SchemaService,
  instantiateRecord,
  // modelFor,
  teardownRecord,
} from '@warp-drive/core/reactive';
import { JSONAPICache } from '@warp-drive/json-api';
import { setBuildURLConfig } from '@warp-drive/utilities/json-api';

import { TransformResponse } from '../handlers/handle-response';
import { DivisionSchema } from '../data/division/schema';
import { LeagueSchema } from '../data/league/schema';
import { SportSchema } from '../data/sport/schema';
import { TeamSchema } from '../data/team/schema';
import { VenueSchema } from '../data/venue/schema';

setBuildURLConfig({
  host: 'https://statsapi.mlb.com',
  namespace: 'api/v1',
});

export default class AppStore extends Store {
  requestManager;

  constructor() {
    super(...arguments);
    const transformHandler = new TransformResponse();
    setOwner(transformHandler, getOwner(this));

    this.requestManager = new RequestManager()
      .use([transformHandler, Fetch])
      .useCache(CacheHandler);
  }

  lifetimes = new DefaultCachePolicy({
    apiCacheHardExpires: 15 * 60 * 1000, // 15 minutes
    apiCacheSoftExpires: 1 * 30 * 1000, // 30 seconds
    constraints: {
      headers: {
        'X-WarpDrive-Expires': true,
        'Cache-Control': true,
        Expires: true,
      },
    },
  });

  createSchemaService() {
    const schema = new SchemaService();
    schema.registerResources([
      DivisionSchema,
      LeagueSchema,
      SportSchema,
      TeamSchema,
      VenueSchema,
    ]);
    registerDerivations(schema);
    return schema;
  }

  createCache(capabilities) {
    return new JSONAPICache(capabilities);
  }

  instantiateRecord(key, createRecordArgs) {
    return instantiateRecord(this, key, createRecordArgs);
  }

  teardownRecord(record) {
    return teardownRecord(record);
  }

  // modelFor(type) {
  //   return modelFor.call(this, type) || super.modelFor?.(type);
  // }
}
