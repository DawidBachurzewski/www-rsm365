// Logika generowania dostępnych terminów rozmowy telefonicznej.
// Godziny robocze: pon-pt, 9:00-17:00, sloty co 30 minut.
// To prosta reguła biznesowa do dostosowania (np. integracja z realnym
// kalendarzem pracownika) w kolejnym etapie wdrożenia.

export type DaySlots = {
  date: string; // YYYY-MM-DD
  label: string; // np. "pon., 22 wrz"
  times: string[]; // ["09:00", "09:30", ...]
};

const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 17;
const SLOT_MINUTES = 30;
const DAYS_AHEAD = 14;
const MIN_LEAD_HOURS = 4; // najbliższy możliwy termin to co najmniej 4h od teraz

const dayLabelFormatter = new Intl.DateTimeFormat("pl-PL", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildTimesForDay(date: Date, now: Date): string[] {
  const times: string[] = [];
  const cursor = new Date(date);
  cursor.setHours(BUSINESS_START_HOUR, 0, 0, 0);
  const end = new Date(date);
  end.setHours(BUSINESS_END_HOUR, 0, 0, 0);
  const minAllowed = new Date(now.getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000);

  while (cursor < end) {
    if (cursor >= minAllowed) {
      const hh = String(cursor.getHours()).padStart(2, "0");
      const mm = String(cursor.getMinutes()).padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
  }
  return times;
}

/** Generuje listę najbliższych dni roboczych wraz z dostępnymi godzinami. */
export function getAvailableSlots(now: Date = new Date()): DaySlots[] {
  const days: DaySlots[] = [];
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  let daysChecked = 0;
  while (days.length < 10 && daysChecked < DAYS_AHEAD) {
    if (!isWeekend(cursor)) {
      const times = buildTimesForDay(cursor, now);
      if (times.length > 0) {
        days.push({
          date: toDateKey(cursor),
          label: dayLabelFormatter.format(cursor),
          times,
        });
      }
    }
    cursor.setDate(cursor.getDate() + 1);
    daysChecked += 1;
  }
  return days;
}

export function combineDateAndTime(date: string, time: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}
