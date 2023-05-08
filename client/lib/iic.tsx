import React, { FC, useEffect, useLayoutEffect, ReactElement, useState } from 'react';

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

export const iic = (
  render: IICRenderFn,
  baseProps: IICRenderProps = {}
): IIC => (props: IICRenderProps) => (
  <ImmediatelyInvokedComponent
    render={render}
    {...baseProps}
    {...props}
  />
);

export const useDeployIICs = (): [ReactElement[], (iic: IIC) => void] => {
  const [iics, setIICs] = useState<IIC[]>([]);

  const deployIIC = (iic: IIC) => {
    setIICs((iics) => [...iics, iic]);
  };

  const removeIIC = (iic: IIC) => {
    setIICs((iics) => iics.filter((i) => i !== iic));
  };

  const iicElements = iics.map((Component, i) => (
    <Component key={i} afterMount={() => removeIIC(Component)} />
  ));

  return [iicElements, deployIIC];
}
