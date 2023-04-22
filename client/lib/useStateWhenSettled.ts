import { useState } from 'react';
import {
  useWaitUntilSettled,
  UseWaitUntilSettledOptions,
} from '~/lib/useWaitUntilSettled';

export const useStateWhenSettled = <T>(
  initialValue: T,
  options: UseWaitUntilSettledOptions = {}
) => {
  const [liveValue, setLiveValue] = useState(initialValue);
  const [settledValue, setSettledValue] = useState(initialValue);

  const setBoth = (value: T) => {
    setLiveValue(value);
    setSettledValue(value);
  };

  useWaitUntilSettled(liveValue, setSettledValue, options);

  return [liveValue, settledValue, setLiveValue, setBoth] as const;
};
