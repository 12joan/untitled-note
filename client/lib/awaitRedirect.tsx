import { useEffect } from 'react';
import { awaitRedirectPath } from '~/lib/routes';

let promisePath: Promise<string> | null = null;
let fallbackPath: string | null = null;

export interface AwaitRedirectOptions {
  navigate?: (path: string) => void;
  promisePath: Promise<string>;
  fallbackPath: string;
  projectId?: number;
}

export const awaitRedirect = ({
  navigate,
  promisePath: _promisePath,
  fallbackPath: _fallbackPath,
  projectId,
}: AwaitRedirectOptions): string => {
  promisePath = _promisePath;
  fallbackPath = _fallbackPath;
  const path = awaitRedirectPath({ projectId });
  navigate?.(path);
  return path;
};

export const useAwaitRedirect = (callback: (path: string) => void) => {
  useEffect(() => {
    (promisePath ?? Promise.reject()).then(
      (path) => callback(path),
      () => callback(fallbackPath || '/')
    );
  }, []);
};
