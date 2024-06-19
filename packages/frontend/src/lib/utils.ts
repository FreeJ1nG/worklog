import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type LogSchema } from 'worklog-shared';

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
  date: number,
): { left: string; right: string } => {
  let startDate = new Date(log.startTime);
  if (startDate.getDate() < date) {
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), date);
  }
  const endDate = new Date(log.endTime);
  const startInMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endInMinutes = endDate.getHours() * 60 + endDate.getMinutes();
  return {
    left: `${(startInMinutes / 1440) * 100}%`,
    right: `${((1440 - endInMinutes) / 1440) * 100}%`,
  };
};
