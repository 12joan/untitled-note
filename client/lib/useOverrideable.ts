import { useState } from 'react';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';

export const useOverrideable = <T>(upstream: T) => {
  const [value, setValue] = useState(upstream);

  useEffectAfterFirst(() => {
    setValue(upstream);
  }, [upstream]);

  return [value, setValue] as const;
};
