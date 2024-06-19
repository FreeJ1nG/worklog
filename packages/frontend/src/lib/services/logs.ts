import {
  type GetLogsQueryParamSchema,
  type LogJsonEntrySchema,
  type LogSchema,
} from 'worklog-shared';

export const getLogs = async ({
  startTime,
  endTime,
}: GetLogsQueryParamSchema): Promise<LogJsonEntrySchema[]> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/logs?startTime=${startTime}&endTime=${endTime}`,
    { method: 'GET' },
  );
  if (!res.ok) throw new Error('Something went wrong while fetching logs');
  return (await res.json()).data;
};

export const createLog = async (
  log: LogSchema,
): Promise<LogJsonEntrySchema[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logs`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(log),
  });
  if (!res.ok)
    throw new Error(
      `Something went wrong while creating logs: ${(await res.json()).message}`,
    );
  return (await res.json()).data;
};

export const deleteLog = async (id: number): Promise<void> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logs/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok)
    throw new Error(
      `Something went wrong while deleting logs: ${(await res.json()).message}`,
    );
  return;
};

export const updateLog = async ({
  id,
  log,
}: {
  id: number;
  log: LogSchema;
}): Promise<LogJsonEntrySchema[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logs/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(log),
  });
  if (!res.ok)
    throw new Error(
      `Something went wrong while updating logs: ${(await res.json()).message}`,
    );
  return (await res.json()).data;
};
