import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type LogSchema } from 'worklog-shared';

import { SESSION_ID_KEY } from './constants';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const daysInMonth = ({
  month,
  year,
}: {
  month: number;
  year: number;
}): number => {
  const currentDate = new Date(year, month, 0);
  return currentDate.getDate();
};

export const getTimeString = (timeInMinutes: number): string => {
  if (!Number.isInteger(timeInMinutes))
    throw new Error('timeInMinutes must be an integer');
  const minutes = Math.floor(timeInMinutes / 60);
  const seconds = timeInMinutes % 60;
  return `${Math.floor(minutes / 10)}${minutes % 10}:${Math.floor(seconds / 10)}${seconds % 10}`;
};

export const getLogDynamicStyles = (
  log: LogSchema,
  selectedYear: number,
  selectedMonth: number,
  date: number,
): { left: string; right: string } => {
  const startDate = new Date(
    Math.max(
      log.startTime,
      new Date(selectedYear, selectedMonth - 1, date).getTime(),
    ),
  );
  const endDate = new Date(
    Math.min(
      log.endTime,
      new Date(selectedYear, selectedMonth - 1, date + 1).getTime() - 1,
    ),
  );
  const startInMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endInMinutes = endDate.getHours() * 60 + endDate.getMinutes();
  return {
    left: `${(startInMinutes / 1440) * 100}%`,
    right: `${((1440 - endInMinutes) / 1440) * 100}%`,
  };
};

export const getAuthHeader = (): Record<string, string> => {
  let sessionId: string | undefined;
  document.cookie
    .split(';')
    .map((s) => s.trim())
    .forEach((keyValue) => {
      const [key, value] = keyValue.split('=');
      if (key === SESSION_ID_KEY) {
        sessionId = value;
        return;
      }
    });
  if (!sessionId) return {};

  return {
    Authorization: `SessionId ${sessionId}`,
  };
};

export const getLogDuration = (
  log: LogSchema,
  selectedYear: number,
  selectedMonth: number,
  date: number,
  format: 'hour' | 'ms',
): number => {
  const startOfNextDay = new Date(
    selectedYear,
    selectedMonth - 1,
    date + 2,
  ).getTime();
  const startOfDay = new Date(
    selectedYear,
    selectedMonth - 1,
    date + 1,
  ).getTime();

  const endTime = Math.min(log.endTime, startOfNextDay - 1);
  const startTime = Math.max(log.startTime, startOfDay);
  const durationMs = endTime - startTime;

  return format === 'hour'
    ? +(durationMs / (1000 * 60 * 60)).toFixed(4)
    : durationMs;
};
