import React, {
  DependencyList,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createPluginFactory,
  PlateEditor,
  PlatePlugin,
  useEditorRef,
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

type ImerativeEventEmitter = EventEmitter<ImperativeEventTypes>;

const editorEventEmitterMap = new WeakMap<PlateEditor, ImerativeEventEmitter>();

export type ImperativeEventsPlugin = {
  imperativeEventEmitter: ImerativeEventEmitter;
};

const createImperativeEventsPlugin =
  createPluginFactory<ImperativeEventsPlugin>({
    key: 'imperativeEvents',
    then: (_editor, { options: { imperativeEventEmitter } }) => ({
      /**
       * The old approach using renderAboveEditable and contexts was causing
       * editor components to unmount and remount when the plugin options
       * changed.
       */
      renderAfterEditable: () => (
        <ImperativeEventsEffects
          imperativeEventEmitter={imperativeEventEmitter}
        />
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

interface ImperativeEventsEffectsProps {
  imperativeEventEmitter: ImerativeEventEmitter;
}

const ImperativeEventsEffects = ({
  imperativeEventEmitter,
}: ImperativeEventsEffectsProps) => {
  const staticEditor = useEditorRef();

  useEffect(() => {
    editorEventEmitterMap.set(staticEditor, imperativeEventEmitter);
    return () => {
      editorEventEmitterMap.delete(staticEditor);
    };
  }, [staticEditor, imperativeEventEmitter]);

  return null;
};

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
  const staticEditor = useEditorRef();

  // Use a fallback event emitter if one hasn't been created yet
  const imperativeEventEmitter =
    editorEventEmitterMap.get(staticEditor) ??
    createEventEmitter<ImperativeEventTypes>();

  useEvent(
    imperativeEventEmitter,
    eventName,
    handler,
    deps && [...deps, imperativeEventEmitter]
  );
};
