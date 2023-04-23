import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  useNavigate,
} from 'react-router-dom';
import { IS_ELECTRON } from '~/lib/environment';
import { App } from '~/components/layout/App';

import '~/channels';
import '~/lib/commonEntrypoint';

const ElectronNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.onNavigate((_event, delta) => navigate(delta));
  }, []);

  return null;
};

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.querySelector('#application')!);

  const router = createBrowserRouter([
    {
      path: '/*',
      element: (
        <>
          {IS_ELECTRON && <ElectronNavigation />}

          <App />

          <ScrollRestoration getKey={(location) => location.pathname} />
        </>
      ),
    },
  ]);

  root.render(<RouterProvider router={router} />);
});
