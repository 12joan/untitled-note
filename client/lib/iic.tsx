import React, {
  FC,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

export type IICRenderFn = () => () => void;

export interface IICRenderProps {
  afterMount?: () => void;
  layoutEffect?: boolean;
}

export type IIC = FC<IICRenderProps>;

const ImmediatelyInvokedComponent = ({
  render,
  afterMount,
  layoutEffect = true,
}: IICRenderProps & {
  render: IICRenderFn;
}): null => {
  const onMount = render();

  const effectType = layoutEffect ? useLayoutEffect : useEffect;

  effectType(() => {
    try {
      onMount();
    } finally {
      afterMount?.();
    }
  }, []);

  return null;
};

const MergedIICs = ({
  iics,
  ...props
}: IICRenderProps & {
  iics: IIC[];
}): ReactElement => (
  <>
    {iics.map((Component, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Component key={i} {...props} />
    ))}
  </>
);

export const iic =
  (render: IICRenderFn, baseProps: IICRenderProps = {}): IIC =>
  (props: IICRenderProps) =>
    <ImmediatelyInvokedComponent render={render} {...baseProps} {...props} />;

export const mergeIICs =
  (...iics: IIC[]): IIC =>
  (props) =>
    <MergedIICs iics={iics} {...props} />;

export const liftToIIC =
  <Args extends unknown[]>(
    fn: (...args: Args) => void,
    baseProps?: IICRenderProps
  ) =>
  (...args: Args): IIC =>
    iic(() => () => fn(...args), baseProps);

export const useDeployIICs = (): [ReactElement[], (iic: IIC) => void] => {
  const [iics, setIICs] = useState<IIC[]>([]);

  const deployIIC = (iic: IIC) => {
    setIICs((iics) => [...iics, iic]);
  };

  const removeIIC = (iic: IIC) => {
    setIICs((iics) => iics.filter((i) => i !== iic));
  };

  const iicElements = iics.map((Component, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <Component key={i} afterMount={() => removeIIC(Component)} />
  ));

  return [iicElements, deployIIC];
};
