import moment from 'moment-timezone';

const LATAM_TIMEZONES = [
  'America/Argentina/Buenos_Aires',
  'America/Santiago',
  'America/Bogota',
  'America/Caracas',
  'America/Lima',
  'America/Asuncion',
  'America/Montevideo',
  'America/La_Paz',
  'America/Mexico_City',
  'America/Panama',
  'America/Guatemala',
  'America/Costa_Rica',
  'America/Guayaquil',
  'America/Havana',
  'America/Santo_Domingo',
  'America/Sao_Paulo',
];

export const DEFAULT_TIMEZONE = 'America/Argentina/Buenos_Aires';

export const latamTimezones = LATAM_TIMEZONES.map((tz) => {
  const offset = moment.tz(tz).format('Z');
  const city = tz.split('/').pop()?.replace(/_/g, ' ');
  return {
    value: tz,
    label: `${city}, GMT${offset}`,
  };
});
