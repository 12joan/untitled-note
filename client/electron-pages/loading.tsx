import React from 'react';
import { createRoot } from 'react-dom/client';
import { LoadingView } from '~/components/LoadingView';

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.querySelector('#loading')!);
  root.render(<LoadingView />);
});
