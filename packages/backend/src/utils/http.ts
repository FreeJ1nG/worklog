import { type z } from 'zod'

export const parseWithSchema = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> | undefined => {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return undefined
  }
  return parsed.data
}
