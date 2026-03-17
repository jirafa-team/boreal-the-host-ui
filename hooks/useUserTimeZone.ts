import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import type { RootState } from '@/store/store';
import { DEFAULT_TIMEZONE } from '@/lib/timezone-context';

function formatUtcDateToUserTz(
  date: string | Date,
  timezone: string,
  format: string,
): string {
  return moment.utc(date).tz(timezone).format(format);
}

export const useUserTimeZone = () => {
  const timezone = useSelector((state: RootState) => state.auth.timezone) ?? DEFAULT_TIMEZONE;
  const dateFormat = useSelector((state: RootState) => state.auth.dateFormat) ?? 'DD/MM/YYYY';

  const formatDate = useCallback(
    (date: string | Date) => {
      if (!date) return '';
      return formatUtcDateToUserTz(date, timezone, dateFormat);
    },
    [timezone, dateFormat],
  );

  const formatDateTime = useCallback(
    (date: string | Date) => {
      if (!date) return '';
      return formatUtcDateToUserTz(date, timezone, `${dateFormat} HH:mm`);
    },
    [timezone, dateFormat],
  );

  const formatTime = useCallback(
    (time: string) => {
      if (!time) return '';
      const today = moment.utc().format('YYYY-MM-DD');
      return moment.utc(`${today} ${time}`).tz(timezone).format('HH:mm');
    },
    [timezone],
  );

  const toUtcTime = useCallback(
    (time: string) => {
      if (!time) return '';
      const today = moment.utc().format('YYYY-MM-DD');
      return moment.tz(`${today} ${time}`, timezone).utc().format('HH:mm');
    },
    [timezone],
  );

  return {
    timezone,
    dateFormat,
    formatDate,
    formatDateTime,
    formatTime,
    toUtcTime,
  };
};
