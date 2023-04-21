interface Window {
  electron: {
    reloadApp: () => void;
    onNavigate: (callback: (event: string, delta: number) => void) => void;
  };
}
