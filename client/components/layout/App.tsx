import React, { useReducer } from 'react';
import { streamFiles, streamQuotaUsage } from '~/lib/apis/file';
import { streamProjects } from '~/lib/apis/project';
import { ContextProvider } from '~/lib/context';
import { mapFuture, unwrapFuture } from '~/lib/monads';
import { ApplicationRoutes } from '~/lib/routes';
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
  const futureProjects = useStream(streamProjects, [projectsCacheKey]);

  const futureQuotaUsage = useStream(streamQuotaUsage, []);
  const futureFiles = useStream(streamFiles, []);
  const futureRemainingQuota = mapFuture(
    futureQuotaUsage,
    ({ quota, used }) => quota - used
  );

  const { settings, setSettings } = useSettingsProvider();

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
    <ErrorBoundary fallback={fallback}>
      {unwrapFuture(futureProjects, {
        pending: <LoadingView />,
        resolved: (projects) => (
          <ContextProvider
            projects={projects}
            invalidateProjectsCache={invalidateProjectsCache}
            futureQuotaUsage={futureQuotaUsage}
            futureFiles={futureFiles}
            futureRemainingQuota={futureRemainingQuota}
            settings={settings}
            setSettings={setSettings}
          >
            {projects.length === 0 ? (
              <NoProjectsView />
            ) : (
              <>
                <ApplicationRoutes />
                <ToastContainer />
              </>
            )}
          </ContextProvider>
        ),
      })}
    </ErrorBoundary>
  );
};
