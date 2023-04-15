import { useState } from 'react';
import useWaitUntilSettled from '~/lib/useWaitUntilSettled';

const useStateWhenSettled = (initialValue, options = {}) => {
  const [liveValue, setLiveValue] = useState(initialValue);
  const [settledValue, setSettledValue] = useState(initialValue);

  const setBoth = (value) => {
    setLiveValue(value);
    setSettledValue(value);
  };

  useWaitUntilSettled(liveValue, setSettledValue, options);

  return [liveValue, settledValue, setLiveValue, setBoth];
};

export default useStateWhenSettled;
