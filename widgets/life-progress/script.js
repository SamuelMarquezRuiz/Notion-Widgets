/**
 * Life Progress Widget
 * Computes real-time elapsed percentage for Year, Month, Week (Mon-Sun), and Day
 * using the device's local time, updating automatically every minute.
 */
(function () {
  const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const rawDecimals = Number(window.NotionTheme?.getParam("decimals", "1"));
  const decimals = Number.isInteger(rawDecimals) && rawDecimals >= 0 && rawDecimals <= 2
    ? rawDecimals
    : 1;

  const elements = {
    time: document.getElementById("current-time"),
    year: {
      percent: document.getElementById("percent-year"),
      detail: document.getElementById("detail-year"),
      fill: document.getElementById("fill-year"),
      track: document.getElementById("track-year"),
    },
    month: {
      percent: document.getElementById("percent-month"),
      detail: document.getElementById("detail-month"),
      fill: document.getElementById("fill-month"),
      track: document.getElementById("track-month"),
    },
    week: {
      percent: document.getElementById("percent-week"),
      detail: document.getElementById("detail-week"),
      fill: document.getElementById("fill-week"),
      track: document.getElementById("track-week"),
    },
    day: {
      percent: document.getElementById("percent-day"),
      detail: document.getElementById("detail-day"),
      fill: document.getElementById("fill-day"),
      track: document.getElementById("track-day"),
    },
  };

  function clampPercent(value) {
    return Math.min(100, Math.max(0, value));
  }

  function pad2(num) {
    return String(num).padStart(2, "0");
  }

  function calculateProgress(now) {
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    // Year: Jan 1 00:00:00 -> next Jan 1 00:00:00
    const yearStart = new Date(year, 0, 1, 0, 0, 0, 0);
    const yearEnd = new Date(year + 1, 0, 1, 0, 0, 0, 0);
    const yearPct = ((now - yearStart) / (yearEnd - yearStart)) * 100;
    const totalDaysInYear = Math.round((yearEnd - yearStart) / 86400000);
    const currentDayOfYear = Math.floor((now - yearStart) / 86400000) + 1;

    // Month: 1st of month 00:00:00 -> 1st of next month 00:00:00
    const monthStart = new Date(year, month, 1, 0, 0, 0, 0);
    const monthEnd = new Date(year, month + 1, 1, 0, 0, 0, 0);
    const monthPct = ((now - monthStart) / (monthEnd - monthStart)) * 100;
    const daysInMonth = Math.round((monthEnd - monthStart) / 86400000);

    // Week (Monday = 0 ... Sunday = 6)
    const dayIndexMonday = (now.getDay() + 6) % 7;
    const weekStart = new Date(year, month, date - dayIndexMonday, 0, 0, 0, 0);
    const weekEnd = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + 7,
      0, 0, 0, 0
    );
    const weekPct = ((now - weekStart) / (weekEnd - weekStart)) * 100;

    // Day: today 00:00:00 -> tomorrow 00:00:00
    const dayStart = new Date(year, month, date, 0, 0, 0, 0);
    const dayEnd = new Date(year, month, date + 1, 0, 0, 0, 0);
    const dayPct = ((now - dayStart) / (dayEnd - dayStart)) * 100;

    return {
      year: {
        pct: clampPercent(yearPct),
        detail: `${year} · ${currentDayOfYear}/${totalDaysInYear}`,
      },
      month: {
        pct: clampPercent(monthPct),
        detail: `${MONTH_NAMES[month]} · ${date}/${daysInMonth}`,
      },
      week: {
        pct: clampPercent(weekPct),
        detail: `${WEEKDAY_NAMES[dayIndexMonday]} · ${dayIndexMonday + 1}/7`,
      },
      day: {
        pct: clampPercent(dayPct),
        detail: `${pad2(now.getHours())}:${pad2(now.getMinutes())}`,
      },
    };
  }

  function render() {
    const now = new Date();
    const data = calculateProgress(now);

    elements.time.textContent = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

    for (const unit of ["year", "month", "week", "day"]) {
      const item = elements[unit];
      const { pct, detail } = data[unit];
      const formatted = `${pct.toFixed(decimals)}%`;

      item.percent.textContent = formatted;
      item.detail.textContent = detail;
      item.fill.style.width = `${pct.toFixed(2)}%`;
      item.track.setAttribute("aria-valuenow", pct.toFixed(decimals));
    }
  }

  function scheduleNextMinuteTick() {
    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;

    window.setTimeout(() => {
      render();
      window.setInterval(render, 60000);
    }, Math.max(250, msUntilNextMinute));
  }

  render();
  scheduleNextMinuteTick();
})();
