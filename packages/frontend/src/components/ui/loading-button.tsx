import { LoaderCircle } from 'lucide-react';
import { type ReactNode } from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';

export interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  className: string;
}

export const LoadingButton = ({
  loading,
  children,
  disabled,
  ...other
}: LoadingButtonProps): ReactNode => {
  return (
    <Button {...other} disabled={disabled || loading}>
      {loading && <LoaderCircle className="mr-2 h-5 w-5" />}
      {!loading && children}
    </Button>
  );
};
