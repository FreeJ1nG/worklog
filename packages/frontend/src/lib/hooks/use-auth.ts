import { useEffect, useState } from 'react'

import { getCurrentUser } from '@/lib/services/auth'

export const useAuth = (): boolean => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    if (isAuthenticated) return
    getCurrentUser()
      .then(() => {
        setIsAuthenticated(true)
      })
      .catch((e: unknown) => console.log(e))
  }, [])

  return isAuthenticated
}
