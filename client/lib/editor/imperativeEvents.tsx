import {
  type DependencyList,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createEventEmitter,
  dispatchEvent,
  type EventEmitter,
  type EventListener,
  useEvent,
} from '~/lib/customEvents';
import {
  createPluginFactory,
  type PlateEditor,
  type PlatePlugin,
  useEditorRef,
  type Value,
} from '~/lib/editor/plate';
import type { LinkModalProps } from './links/types';

// biome-ignore lint/style/useConsistentTypeDefinitions: cannot use interface
type ImperativeEventTypes = {
  change: [Value];
  keyDown: [KeyboardEvent];
  'linkModal:open': [LinkModalProps];
};

type ImerativeEventEmitter = EventEmitter<ImperativeEventTypes>;

const editorEventEmitterMap = new WeakMap<PlateEditor, ImerativeEventEmitter>();

export interface ImperativeEventsPlugin {
  imperativeEventEmitter: ImerativeEventEmitter;
}

export const dispatchEditorEvent = <K extends keyof ImperativeEventTypes>(
  editor: PlateEditor,
  type: K,
  ...args: ImperativeEventTypes[K]
) => {
  const imperativeEventEmitter = editorEventEmitterMap.get(editor);
  if (imperativeEventEmitter) {
    dispatchEvent(imperativeEventEmitter, type, ...args);
  } else {
    // biome-ignore lint/suspicious/noConsole: logging
    console.warn('No imperativeEventEmitter found for editor');
  }
};

const createImperativeEventsPlugin =
  createPluginFactory<ImperativeEventsPlugin>({
    key: 'imperativeEvents',
    // biome-ignore lint/suspicious/noThenProperty: required for Plate
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
  const editorStatic = useEditorRef();

  useEffect(() => {
    editorEventEmitterMap.set(editorStatic, imperativeEventEmitter);
    return () => {
      editorEventEmitterMap.delete(editorStatic);
    };
  }, [editorStatic, imperativeEventEmitter]);

  return null;
};

export const useImperativeEventsPlugins = (): PlatePlugin[] => {
  const [imperativeEventEmitter] = useState(() =>
    createEventEmitter<ImperativeEventTypes>()
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: legacy
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
