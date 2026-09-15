import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";

// UWAGA — tryb demonstracyjny:
// Zgodnie z decyzją klienta ta wersja NIE wysyła realnych e-maili ani
// zaproszeń kalendarzowych. Endpoint waliduje dane, zapisuje rezerwację
// w pamięci procesu (znika po restarcie serwera) i loguje zdarzenie,
// które w produkcji powinno wyzwalać:
//   1) wysyłkę e-maila potwierdzającego do klienta (z załącznikiem .ics),
//   2) wysyłkę powiadomienia/zaproszenia do zespołu sprzedaży (Outlook/Google Calendar).
// Zobacz README.md, sekcja "Podłączenie realnej wysyłki e-mail".

type Booking = {
  id: string;
  date: string;
  time: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  topic: string;
  message?: string;
  createdAt: string;
};

declare global {
  var __rsm365Bookings: Booking[] | undefined;
}

function getBookingsStore(): Booking[] {
  if (!global.__rsm365Bookings) {
    global.__rsm365Bookings = [];
  }
  return global.__rsm365Bookings;
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const bookings = getBookingsStore();
  const taken = bookings
    .filter((b) => !date || b.date === date)
    .map((b) => ({ date: b.date, time: b.time }));
  return NextResponse.json({ taken });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowy format danych." },
      { status: 400 }
    );
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Formularz zawiera błędy.",
        issues: parsed.data ? undefined : parsed.error.flatten(),
      },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const bookings = getBookingsStore();

  const alreadyTaken = bookings.some(
    (b) => b.date === data.date && b.time === data.time
  );
  if (alreadyTaken) {
    return NextResponse.json(
      { error: "Ten termin został już zarezerwowany. Wybierz inny." },
      { status: 409 }
    );
  }

  const booking: Booking = {
    id: crypto.randomUUID(),
    date: data.date,
    time: data.time,
    name: data.name,
    company: data.company || undefined,
    phone: data.phone,
    email: data.email || undefined,
    topic: data.topic,
    message: data.message || undefined,
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);

  // Tryb demonstracyjny: logujemy zamiast wysyłać e-mail/zaproszenie.
  console.log(
    "[RSM365] Nowa rezerwacja rozmowy (e-mail NIE został wysłany — tryb demo):",
    booking
  );

  return NextResponse.json({ booking }, { status: 201 });
}
