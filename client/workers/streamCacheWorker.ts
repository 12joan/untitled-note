/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-globals */

import { expose } from 'comlink';
import { DBSchema, openDB } from 'idb';
import { StreamCacheWorkerAPI } from '~/lib/types';

const EXPIRY_TIME = 1000 * 60 * 60 * 24; // 1 day

interface StreamCacheDB extends DBSchema {
  streamResults: {
    key: string;
    value: {
      data: string;
      timestamp: number;
    };
    indexes: {
      'by-timestamp': number;
    };
  };
}

const cacheDbPromise = openDB<StreamCacheDB>('streamCache', 1, {
  upgrade(db) {
    const store = db.createObjectStore('streamResults');
    store.createIndex('by-timestamp', 'timestamp');
  },
});

self.addEventListener('connect', (event: any) => {
  const api: StreamCacheWorkerAPI = {
    async getItem(key) {
      const cacheDb = await cacheDbPromise;
      const result = await cacheDb.get('streamResults', key);

      if (!result) return null;

      if (result.timestamp < Date.now() - EXPIRY_TIME) {
        // eslint-disable-next-line no-console
        console.debug('Found expired cache entry', key);
        await this.removeItem(key);
      }

      return result.data;
    },

    async setItem(key, data) {
      const cacheDb = await cacheDbPromise;
      await cacheDb.put(
        'streamResults',
        {
          data,
          timestamp: Date.now(),
        },
        key
      );
    },

    async removeItem(key) {
      const cacheDb = await cacheDbPromise;
      await cacheDb.delete('streamResults', key);
    },

    async clear() {
      const cacheDb = await cacheDbPromise;
      await cacheDb.clear('streamResults');
    },
  };

  const port = event.ports[0];
  expose(api, port);
});

// Expire old cache entries
(async () => {
  const cacheDb = await cacheDbPromise;
  const tx = cacheDb.transaction('streamResults', 'readwrite');
  const store = tx.objectStore('streamResults');
  const expireBefore = Date.now() - EXPIRY_TIME;
  const index = store.index('by-timestamp');

  let cursor = await index.openCursor(IDBKeyRange.upperBound(expireBefore));

  while (cursor) {
    // eslint-disable-next-line no-console
    console.debug('Deleting expired cache entry', cursor.primaryKey);
    await cursor.delete();
    cursor = await cursor.continue();
  }

  await tx.done;
})();
