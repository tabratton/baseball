import { formatDuration } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

const locales = new Map();
locales.set('en-US', enUS);
locales.set('es', es);

export default function durationFormat(duration, options) {
  return formatDuration(duration, options);
}
