export default function dateFormat(date, locale, formatStr = 'D') {
  return date.toFormat(formatStr);
}
