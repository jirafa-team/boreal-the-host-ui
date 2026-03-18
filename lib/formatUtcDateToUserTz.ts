import moment from 'moment-timezone';
import { DEFAULT_TIMEZONE } from './timezone-context';

export function formatUtcDateToUserTz(
  date: string | Date,
  timezone: string = DEFAULT_TIMEZONE,
  format: string = 'DD/MM/YYYY',
): string {
  return moment.utc(date).tz(timezone).format(format);
}
