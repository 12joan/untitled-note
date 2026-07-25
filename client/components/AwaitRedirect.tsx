import { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingView } from '~/components/LoadingView';
import { useAwaitRedirect } from '~/lib/awaitRedirect';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';

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
