// Generator pliku .ics (kalendarzowego zaproszenia) do pobrania po stronie
// klienta. W obecnej wersji strony wysyłka e-mail jest wyłączona (patrz
// README) — użytkownik może pobrać zaproszenie i dodać je do kalendarza
// ręcznie, a formularz jednocześnie zapisuje termin po stronie serwera.

export type IcsEventInput = {
  uid: string;
  start: Date;
  durationMinutes: number;
  title: string;
  description: string;
  organizerEmail: string;
  attendeeEmail?: string;
};

function toIcsDate(date: Date): string {
  // Format lokalny (bez konwersji do UTC), zgodny z VTIMEZONE Europe/Warsaw
  // pominiętym dla uproszczenia — większość klientów poczty poprawnie
  // zinterpretuje "floating time" jako czas lokalny odbiorcy.
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  );
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildIcsContent(input: IcsEventInput): string {
  const end = new Date(input.start.getTime() + input.durationMinutes * 60000);
  const now = new Date();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RSM365//Booking//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `DTSTAMP:${toIcsDate(now)}`,
    `DTSTART:${toIcsDate(input.start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(input.title)}`,
    `DESCRIPTION:${escapeIcsText(input.description)}`,
    `ORGANIZER:mailto:${input.organizerEmail}`,
  ];

  if (input.attendeeEmail) {
    lines.push(
      `ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:${input.attendeeEmail}`
    );
  }

  lines.push("STATUS:CONFIRMED", "SEQUENCE:0", "END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

export function downloadIcsFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
