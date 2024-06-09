import React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from '~/components/layout/ToastContainer';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  root.render(<ToastContainer />);
});
