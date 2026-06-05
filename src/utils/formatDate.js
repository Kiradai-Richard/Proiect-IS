export function formatRoDate(value) {
  if (!value) return '—';
  const iso = String(value).split('T')[0];
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return String(value);
  return `${day}.${month}.${year}`;
}
