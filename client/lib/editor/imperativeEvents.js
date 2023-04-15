import { createPluginFactory } from '@udecode/plate-headless';
import { dispatchGlobalEvent, useGlobalEvent } from '~/lib/globalEvents';

const supportedEvents = ['onChange', 'onKeyDown'];
const globalEventPrefix = 'editor:';

const handlerForEvent =
  (eventName) =>
  (...args) =>
    dispatchGlobalEvent(`${globalEventPrefix}${eventName}`, ...args);

const createImperativeEventsPlugin = createPluginFactory({
  key: 'imperativeEvents',
  handlers: supportedEvents.reduce(
    (handlers, eventName) => ({
      ...handlers,
      [eventName]: () => handlerForEvent(eventName),
    }),
    {}
  ),
});

const useEditorEvent = supportedEvents.reduce(
  (hooks, eventName) => ({
    ...hooks,
    [eventName]: (...args) =>
      useGlobalEvent(`${globalEventPrefix}${eventName}`, ...args),
  }),
  {}
);

export { createImperativeEventsPlugin, useEditorEvent };
