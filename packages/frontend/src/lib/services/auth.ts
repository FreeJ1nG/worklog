import { type UserSchema } from 'worklog-shared'

import { getAuthHeader } from '@/lib/utils'

export const signIn = async (
  user: UserSchema,
): Promise<{ sessionId: string }> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/sign-in`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    method: 'POST',
    body: JSON.stringify(user),
  })
  if (!res.ok) {
    throw new Error(`Unable to sign in: ${(await res.json()).message}`)
  }
  return (await res.json()).data
}

export const getCurrentUser = async (): Promise<{ username: string }> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
    headers: {
      ...getAuthHeader(),
    },
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Unable to get current user: ${(await res.json()).message}`,
    )
  }
  return (await res.json()).data
}
