export function getTodayIndex(length: number): number {
  const now = new Date();

  const start = new Date(now.getFullYear(), 0, 0);

  const diff =
    now.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) *
      60 *
      1000;

  const day = Math.floor(diff / (1000 * 60 * 60 * 24));

  return day % length;
}