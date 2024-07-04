import type {
  addMark,
  getNode,
  PlateEditor,
  toDOMNode,
} from '~/lib/editor/plate';

declare global {
  interface Window {
    electron: {
      reloadApp: () => void;
      onNavigate: (callback: (event: string, delta: number) => void) => void;
    };

    playwrightUtils: {
      EDITABLE_TO_EDITOR: WeakMap<HTMLElement, PlateEditor>;
      getNode: typeof getNode;
      toDOMNode: typeof toDOMNode;
      addMark: typeof addMark;
    };

    attachmentSkipFolderCheck?: boolean;
    fileUploadInfinite?: boolean;
  }

  interface Document {
    caretPositionFromPoint: (x: number, y: number) => CaretPosition | null;
  }

  declare class Highlight {
    constructor(domRange?: Range);

    add(domRange: Range): void;
  }

  declare namespace CSS {
    const highlights: Map<string, Highlight>;
  }
}
