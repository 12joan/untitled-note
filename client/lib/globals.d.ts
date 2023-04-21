interface Window {
  electron: {
    reloadApp: () => void;
    onNavigate: (callback: (event: string, delta: number) => void) => void;
  };
}

interface Document {
  caretPositionFromPoint: (x: number, y: number) => CaretPosition | null;
}
