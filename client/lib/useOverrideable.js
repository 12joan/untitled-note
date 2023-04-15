import { useState } from 'react';
import useEffectAfterFirst from '~/lib/useEffectAfterFirst';

const useOverrideable = (upstream) => {
  const [value, setValue] = useState(upstream);

  useEffectAfterFirst(() => {
    setValue(upstream);
  }, [upstream]);

  return [value, setValue];
};

export default useOverrideable;
