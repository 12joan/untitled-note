import { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.log(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;
    return hasError ? fallback : children;
  }
}
