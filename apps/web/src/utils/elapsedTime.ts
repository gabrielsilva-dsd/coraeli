export type ElapsedTime = {
  years: number;
  months: number;
  days: number;
};

export function calculateElapsedTime(startDate: string): ElapsedTime | null {
  if (!startDate) return null;

  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(start.getTime()) || start > today) return null;

  const createClampedDate = (year: number, month: number, day: number) => {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(day, lastDayOfMonth));
  };

  let years = today.getFullYear() - start.getFullYear();
  let cursor = createClampedDate(
    start.getFullYear() + years,
    start.getMonth(),
    start.getDate(),
  );

  if (cursor > today) {
    years -= 1;
    cursor = createClampedDate(
      start.getFullYear() + years,
      start.getMonth(),
      start.getDate(),
    );
  }

  let months = 0;

  while (months < 11) {
    const nextMonth = createClampedDate(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      start.getDate(),
    );

    if (nextMonth > today) break;
    cursor = nextMonth;
    months += 1;
  }

  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const cursorUtc = Date.UTC(
    cursor.getFullYear(),
    cursor.getMonth(),
    cursor.getDate(),
  );
  const days = Math.round((todayUtc - cursorUtc) / 86_400_000);

  return { years, months, days };
}