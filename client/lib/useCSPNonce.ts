import { useMemo } from 'react';

export const useCSPNonce = (): string =>
  useMemo(
    () =>
      document.querySelector('meta[name="csp-nonce"]')!.getAttribute('content')!,
    []
  );
