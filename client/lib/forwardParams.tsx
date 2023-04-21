import React from 'react';
import { useParams } from 'react-router-dom';

type FuncType<T> = (params: T) => JSX.Element;

const ForwardParams = <T,>({ func }: { func: FuncType<T> }) => {
  const params = useParams();
  return func(params as T);
};

export const forwardParams = <T,>(func: FuncType<T>) => (
  <ForwardParams func={func} />
);
