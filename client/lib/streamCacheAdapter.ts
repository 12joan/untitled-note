import { wrap } from 'comlink';
import type { StreamCacheWorkerAPI } from '~/lib/types';

import StreamCacheWorker from '~/workers/streamCacheWorker?sharedworker';

const streamCacheWorker = new StreamCacheWorker();
export const streamCache = wrap<StreamCacheWorkerAPI>(streamCacheWorker.port);
