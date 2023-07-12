import React, {
  createContext,
  DependencyList,
  KeyboardEvent,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  createPluginFactory,
  PlatePlugin,
  Value,
} from '@udecode/plate';
import {
  createEventEmitter,
  dispatchEvent,
  EventEmitter,
  EventListener,
  useEvent,
} from '~/lib/customEvents';

type ImperativeEventTypes = {
  change: [Value];
  keyDown: [KeyboardEvent];
};

type ImperativeEventsContext = EventEmitter<ImperativeEventTypes>;

export const ImperativeEventsContext =
  createContext<ImperativeEventsContext | null>(null);

export type ImperativeEventsPlugin = {
  imperativeEventEmitter: ImperativeEventsContext;
};

const createImperativeEventsPlugin =
  createPluginFactory<ImperativeEventsPlugin>({
    key: 'imperativeEvents',
    then: (_editor, { options: { imperativeEventEmitter } }) => ({
      renderAboveEditable: ({ children }) => (
        <ImperativeEventsContext.Provider value={imperativeEventEmitter}>
          {children}
        </ImperativeEventsContext.Provider>
      ),
      handlers: {
        onChange: () => (value) => {
          dispatchEvent(imperativeEventEmitter, 'change', value);
        },
        onKeyDown: () => (event) => {
          dispatchEvent(imperativeEventEmitter, 'keyDown', event);
        },
      },
    }),
  });

export const useImperativeEventsPlugins = (): PlatePlugin[] => {
  const [imperativeEventEmitter] = useState(() =>
    createEventEmitter<ImperativeEventTypes>()
  );

  return useMemo(
    () => [
      createImperativeEventsPlugin({
        options: {
          imperativeEventEmitter,
        },
      }) as PlatePlugin,
    ],
    []
  );
};

export const useEditorEvent = <K extends keyof ImperativeEventTypes>(
  eventName: K,
  handler: EventListener<ImperativeEventTypes[K]>,
  deps?: DependencyList
) => {
  const imperativeEventEmitter = useContext(ImperativeEventsContext);

  if (!imperativeEventEmitter) {
    throw new Error(
      'useEditorEvent must be used within a Plate editor using the imperative events plugin'
    );
  }

  useEvent(imperativeEventEmitter, eventName, handler, deps);
};
