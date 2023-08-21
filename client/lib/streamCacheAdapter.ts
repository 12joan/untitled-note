import { wrap } from 'comlink';
import { StreamCacheWorkerAPI } from '~/lib/types';

import StreamCacheWorker from '~/workers/streamCacheWorker?sharedworker';

const streamCacheWorker = new StreamCacheWorker();
export const streamCache = wrap<StreamCacheWorkerAPI>(streamCacheWorker.port);
