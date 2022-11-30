import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

const locales = new Map();
locales.set('en-US', enUS);
locales.set('es', es);

export default function dateFormat(
  date: Date,
  locale: string,
  formatStr = 'PPP'
) {
  return format(date, formatStr, { locale: locales.get(locale) });
}
