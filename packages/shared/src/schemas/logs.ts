import { z } from 'zod';

export const logSchema = z.object({
  startTime: z.number(),
  endTime: z.number(),
  descriptions: z.array(z.string()),
});

export type LogSchema = z.infer<typeof logSchema>;

export const getLogsQueryParamSchema = logSchema
  .extend({
    startTime: z.string().regex(/^\d+$/u).transform(Number),
    endTime: z.string().regex(/^\d+$/u).transform(Number),
  })
  .omit({
    descriptions: true,
  });

export type GetLogsQueryParamSchema = z.infer<typeof getLogsQueryParamSchema>;

export const logJsonEntrySchema = logSchema.extend({
  id: z.number(),
});

export type LogJsonEntrySchema = z.infer<typeof logJsonEntrySchema>;

export const logIdParamSchema = z.object({
  logId: z.string().regex(/^\d+$/u).transform(Number),
});

export type LogIdParamSchema = z.infer<typeof logIdParamSchema>;
