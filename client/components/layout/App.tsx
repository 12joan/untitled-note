import React, { useEffect, useReducer } from 'react';
import { streamFiles, streamQuotaUsage } from '~/lib/apis/file';
import { streamProjects } from '~/lib/apis/project';
import { AppContextProvider } from '~/lib/appContext';
import { mapFuture, unwrapFuture } from '~/lib/monads';
import { ApplicationRoutes } from '~/lib/routing';
import { useSettingsProvider } from '~/lib/settings';
import { useStream } from '~/lib/useStream';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { NoProjectsView } from '~/components/layout/NoProjectsView';
import { ToastContainer } from '~/components/layout/ToastContainer';
import { LoadingView } from '~/components/LoadingView';

export const App = () => {
  const [projectsCacheKey, invalidateProjectsCache] = useReducer(
    (x) => x + 1,
    0
  );

  const futureProjects = useStream(
    {
      getStream: streamProjects,
      cacheKey: 'projects',
      disableCacheLoad: projectsCacheKey > 0,
    },
    [projectsCacheKey]
  );

  const futureQuotaUsage = useStream(
    {
      getStream: streamQuotaUsage,
      cacheKey: 'quota-usage',
    },
    []
  );

  const futureFiles = useStream(
    {
      getStream: streamFiles,
      cacheKey: 'files',
    },
    []
  );

  const futureRemainingQuota = mapFuture(
    futureQuotaUsage,
    ({ quota, used }) => quota - used
  );

  const { settings, setSettings } = useSettingsProvider();
  const { deeperDarkMode } = settings;

  useEffect(() => {
    if (deeperDarkMode) {
      document.body.classList.add('deeper-dark-mode');
    } else {
      document.body.classList.remove('deeper-dark-mode');
    }
  }, [deeperDarkMode]);

  const fallback = (
    <div className="p-5 space-y-3">
      <h1 className="h1">An internal error has occurred</h1>
      {/* TODO: Add contact details */}
      <p className="text-lg font-light">
        This probably isn&apos;t your fault. Let us know if the problem
        persists.
      </p>
      <p>
        <a href="/" className="btn btn-link font-medium">
          Go back to the home page
        </a>
      </p>
    </div>
  );

  return (
    <AppContextProvider
      invalidateProjectsCache={invalidateProjectsCache}
      futureQuotaUsage={futureQuotaUsage}
      futureFiles={futureFiles}
      futureRemainingQuota={futureRemainingQuota}
      settings={settings}
      setSettings={setSettings}
    >
      <ErrorBoundary fallback={fallback}>
        {unwrapFuture(futureProjects, {
          pending: <LoadingView />,
          resolved: (projects) => (
            <AppContextProvider projects={projects}>
              {projects.length === 0 ? (
                <NoProjectsView />
              ) : (
                <>
                  <ApplicationRoutes />
                  <ToastContainer />
                </>
              )}
            </AppContextProvider>
          ),
        })}
      </ErrorBoundary>
    </AppContextProvider>
  );
};
