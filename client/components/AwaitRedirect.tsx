import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAwaitRedirect } from '~/lib/awaitRedirect';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';
import { LoadingView } from '~/components/LoadingView';

export const AwaitRedirect = memo(() => {
  const [redirectPath, setRedirectPath] = useStateWhileMounted<string | null>(
    null
  );

  useAwaitRedirect(setRedirectPath);

  return redirectPath ? (
    <Navigate to={redirectPath} replace />
  ) : (
    <LoadingView />
  );
});
