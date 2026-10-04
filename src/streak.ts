export function updateStreak(
  currentStreak: number
): number {
  const today = new Date();

  const todayString = today.toDateString();

  const lastDate =
    localStorage.getItem("brain_last_completed");

  if (!lastDate) {
    localStorage.setItem(
      "brain_last_completed",
      todayString
    );

    return 1;
  }

  const previous = new Date(lastDate);

  const difference =
    today.getTime() - previous.getTime();

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days === 0) {
    return currentStreak;
  }

  if (days === 1) {
    const newStreak = currentStreak + 1;

    localStorage.setItem(
      "brain_last_completed",
      todayString
    );

    return newStreak;
  }

  localStorage.setItem(
    "brain_last_completed",
    todayString
  );

  return 1;
}