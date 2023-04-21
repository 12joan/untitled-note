import { DependencyList } from 'react';
import { createPluginFactory } from '@udecode/plate-headless';
import { dispatchGlobalEvent, useGlobalEvent } from '~/lib/globalEvents';

const supportedEvents = ['onChange', 'onKeyDown'];
const globalEventPrefix = 'editor:';

const handlerForEvent =
  (eventName: string) =>
  (...args: any[]) =>
    dispatchGlobalEvent(`${globalEventPrefix}${eventName}`, ...args);

export const createImperativeEventsPlugin = createPluginFactory({
  key: 'imperativeEvents',
  handlers: supportedEvents.reduce(
    (handlers, eventName) => ({
      ...handlers,
      [eventName]: () => handlerForEvent(eventName),
    }),
    {}
  ),
});

export const useEditorEvent = supportedEvents.reduce(
  (hooks, eventName) => ({
    ...hooks,
    [eventName]: (handler: EventListener, deps?: DependencyList) =>
      useGlobalEvent(`${globalEventPrefix}${eventName}`, handler, deps),
  }),
  {}
);
