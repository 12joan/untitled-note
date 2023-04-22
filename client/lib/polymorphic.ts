// From https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/
import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  PropsWithChildren,
} from 'react';

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type EmptyObject = Record<string, never>;

type PolyPropsWithoutRef<
  C extends ElementType,
  Props = EmptyObject
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolyProps<
  C extends ElementType,
  Props = EmptyObject
> = PolyPropsWithoutRef<C, Props> & {
  ref?: PolyRef<C>;
};

export type PolyRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];
