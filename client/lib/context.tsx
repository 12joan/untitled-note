import React, {
  Context,
  createContext as _createContext,
  ReactNode,
  useContext as _useContext,
  useMemo,
} from 'react';
import { transformValues } from '~/lib/transformValues';

type WrappedValue<T> = { data: T } | null;

export type ProviderProps<T> = Partial<T> & {
  children: ReactNode;
};

export const createContext = <
  T extends Record<string, unknown>
>(defaultValues: { [K in keyof T]: WrappedValue<T[K]> }) => {
  const contexts = transformValues<
    { [K in keyof T]: WrappedValue<T[K]> },
    { [K in keyof T]: Context<WrappedValue<T[K]>> }
  >(defaultValues, _createContext);

  const useContext = <K extends keyof T>(key: K) => {
    const wrappedValue = _useContext(contexts[key]);

    if (wrappedValue === null) {
      throw new Error(`Context value for ${key as string} has not been set`);
    }

    return wrappedValue.data;
  };

  const SingleProvider = <K extends keyof T>({
    children,
    contextKey: key,
    value,
  }: {
    children: ReactNode;
    contextKey: K;
    value: T[K];
  }) => {
    const wrappedValue = useMemo(() => ({ data: value }), [value]);
    const { Provider } = contexts[key];

    return <Provider value={wrappedValue}>{children}</Provider>;
  };

  const Provider = ({ children, ...values }: ProviderProps<T>): JSX.Element => {
    let wrappedChildren = children as JSX.Element;

    Object.entries(values).forEach(([key, value]) => {
      wrappedChildren = (
        <SingleProvider contextKey={key} value={value}>
          {wrappedChildren}
        </SingleProvider>
      );
    });

    return wrappedChildren;
  };

  return { useContext, Provider };
};
