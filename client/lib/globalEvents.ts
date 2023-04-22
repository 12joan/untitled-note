import { DependencyList } from 'react';
import {
  BaseEventTypes,
  createEventEmitter,
  dispatchEvent,
  EventListener,
  useEvent,
} from '~/lib/customEvents';
import { GlobalStoreTypes } from '~/lib/globalStore';
import { Toast } from '~/lib/types';
import { UploadProgressEvent } from '~/lib/uploadFile';

import { ConnectionStatus } from '~/channels/connectionStatus';

export type GlobalEventTypes = BaseEventTypes & {
  'document:delete': [{ documentId: number }];
  's3File:uploadProgress': [
    { s3FileId: number; progressEvent: UploadProgressEvent }
  ];
  's3File:uploadComplete': [{ s3FileId: number }];
  's3File:delete': [{ s3FileId: number }];
  toast: [Toast];
  connectionStatusChanged: [ConnectionStatus];
} & {
  [K in keyof GlobalStoreTypes as `store:${K}`]: [GlobalStoreTypes[K]];
};

export const globalEventEmitter = createEventEmitter<GlobalEventTypes>();

export const useGlobalEvent = <K extends keyof GlobalEventTypes>(
  eventName: K,
  handler: EventListener<GlobalEventTypes[K]>,
  deps?: DependencyList
) => useEvent(globalEventEmitter, eventName, handler, deps);

export const dispatchGlobalEvent = <K extends keyof GlobalEventTypes>(
  eventName: K,
  ...args: GlobalEventTypes[K]
) => dispatchEvent(globalEventEmitter, eventName, ...args);
