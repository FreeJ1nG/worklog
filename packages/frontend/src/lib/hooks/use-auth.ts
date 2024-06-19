import { useEffect, useState } from 'react';

import { getCurrentUser } from '@/lib/services/auth';

export const useAuth = (): boolean => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUser()
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((e: any) => console.log(e));
  }, []);

  return isAuthenticated;
};
