interface Window {
  electron: {
    reloadApp: () => void;
    onNavigate: (callback: (event: string, delta: number) => void) => void;
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
