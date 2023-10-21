import type { getNode, PlateEditor, toDOMNode } from '@udecode/plate';

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
    };
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
