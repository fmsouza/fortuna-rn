export function periodToDateInterval(period: Date): {from: Date; to: Date} {
  const year = period.getFullYear();
  const month = period.getMonth();
  const from = new Date(year, month, 1);
  const to = new Date(year, month + 1, 0);
  return {from, to};
}
