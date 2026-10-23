// Highlights today's consulting slot(s) in the schedule lists and hour tables (Bucharest time).
export function initSchedule() {
  const rows = document.querySelectorAll<HTMLElement>('[data-day]');
  if (!rows.length) return;
  let today: number;
  try {
    const name = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Bucharest' }).format(new Date());
    today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(name);
  } catch {
    today = new Date().getDay();
  }
  const label = document.documentElement.lang === 'en' ? 'Today' : 'Azi';
  rows.forEach(row => {
    if (Number(row.dataset.day) !== today) return;
    row.classList.add('is-today');
    row.setAttribute('aria-current', 'date');
    const badge = document.createElement('span');
    badge.className = 'today-badge';
    badge.textContent = label;
    (row.querySelector('.week__day, th') ?? row).append(' ', badge);
  });
}
