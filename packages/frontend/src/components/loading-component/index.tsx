import { type ReactNode } from 'react';

export interface LoadingComponentProps {
  fallback?: ReactNode;
  children?: ReactNode;
  loading: boolean;
}

export const LoadingComponent = ({
  fallback,
  children,
  loading,
}: LoadingComponentProps): ReactNode => {
  return loading ? fallback : children;
};
