export function formatTime(milli) {
  const t = new Date(parseInt(milli));
  return t.toLocaleString();
}
