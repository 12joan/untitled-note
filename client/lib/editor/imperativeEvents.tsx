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
import { LinkModalProps } from './links/types';

type ImperativeEventTypes = {
  change: [Value];
  keyDown: [KeyboardEvent];
  'linkModal:open': [LinkModalProps];
};

type ImerativeEventEmitter = EventEmitter<ImperativeEventTypes>;

const editorEventEmitterMap = new WeakMap<PlateEditor, ImerativeEventEmitter>();

export type ImperativeEventsPlugin = {
  imperativeEventEmitter: ImerativeEventEmitter;
};

export const dispatchEditorEvent = <K extends keyof ImperativeEventTypes>(
  editor: PlateEditor,
  type: K,
  ...args: ImperativeEventTypes[K]
) => {
  const imperativeEventEmitter = editorEventEmitterMap.get(editor);
  if (imperativeEventEmitter) {
    dispatchEvent(imperativeEventEmitter, type, ...args);
  } else {
    // eslint-disable-next-line no-console
    console.warn('No imperativeEventEmitter found for editor');
  }
};

const createImperativeEventsPlugin =
  createPluginFactory<ImperativeEventsPlugin>({
    key: 'imperativeEvents',
    then: (editor, { options: { imperativeEventEmitter } }) => ({
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
          dispatchEditorEvent(editor, 'change', value);
        },
        onKeyDown: () => (event) => {
          dispatchEditorEvent(editor, 'keyDown', event);
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
