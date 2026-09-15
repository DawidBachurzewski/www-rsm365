"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CalendarCheck,
  Check,
  Clock,
  Download,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { bookingSchema, type BookingInput } from "@/lib/validation";
import { combineDateAndTime, getAvailableSlots } from "@/lib/slots";
import { buildIcsContent, downloadIcsFile } from "@/lib/ics";
import { bookingTopics, siteConfig } from "@/data/content";

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; booking: BookingInput }
  | { status: "error"; message: string };

export function BookingSection() {
  const days = useMemo(() => getAvailableSlots(), []);
  const [selectedDate, setSelectedDate] = useState(days[0]?.date ?? "");
  const [takenTimes, setTakenTimes] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  const [selectedTime, setSelectedTime] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      topic: bookingTopics[0],
      message: "",
      date: days[0]?.date ?? "",
      time: "",
      consent: false,
    },
  });

  useEffect(() => {
    let cancelled = false;
    async function loadTaken() {
      try {
        const res = await fetch(
          `/api/booking?date=${encodeURIComponent(selectedDate)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setTakenTimes(
            (data.taken as { date: string; time: string }[]).map(
              (t) => t.time
            )
          );
        }
      } catch {
        // Brak połączenia z API nie powinien blokować formularza —
        // po prostu nie wyszarzamy zajętych slotów.
      }
    }
    if (selectedDate) loadTaken();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const activeDay = days.find((d) => d.date === selectedDate);

  const onSubmit = async (values: BookingInput) => {
    setSubmitState({ status: "loading" });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitState({
          status: "error",
          message: data.error ?? "Nie udało się zapisać terminu.",
        });
        return;
      }
      setSubmitState({ status: "success", booking: values });
    } catch {
      setSubmitState({
        status: "error",
        message: "Brak połączenia z serwerem. Spróbuj ponownie.",
      });
    }
  };

  const handleDownloadIcs = (booking: BookingInput) => {
    const start = combineDateAndTime(booking.date, booking.time);
    const content = buildIcsContent({
      uid: `${booking.date}-${booking.time}-${Date.now()}@rsm365.eu`,
      start,
      durationMinutes: 30,
      title: `Rozmowa telefoniczna: ${siteConfig.name} i ${booking.name}`,
      description: [
        `Temat: ${booking.topic}`,
        `Telefon kontaktowy: ${booking.phone}`,
        booking.company ? `Firma: ${booking.company}` : "",
        booking.message ? `Wiadomość: ${booking.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      organizerEmail: siteConfig.contact.email,
      attendeeEmail: booking.email || undefined,
    });
    downloadIcsFile(`rozmowa-rsm365-${booking.date}-${booking.time}.ics`, content);
  };

  if (submitState.status === "success") {
    const { booking } = submitState;
    const day = days.find((d) => d.date === booking.date);
    return (
      <section id="kontakt" className="bg-slate-50 py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-xl shadow-emerald-500/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              Termin rozmowy zarezerwowany
            </h3>
            <p className="mt-3 text-slate-600">
              Zadzwonimy do Ciebie{" "}
              <strong>
                {day?.label ?? booking.date} o {booking.time}
              </strong>{" "}
              na numer <strong>{booking.phone}</strong>. Nasz zespół
              skontaktuje się wcześniej, aby potwierdzić termin.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                onClick={() => handleDownloadIcs(booking)}
              >
                <Download className="h-4 w-4" />
                Pobierz zaproszenie (.ics)
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSubmitState({ status: "idle" });
                  reset();
                }}
              >
                Umów kolejny termin
              </Button>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Uwaga: to wersja demonstracyjna formularza — automatyczne
              wysyłanie zaproszenia na e-mail nie jest jeszcze aktywne (patrz
              README repozytorium). Zaproszenie możesz na razie pobrać i dodać
              do kalendarza ręcznie.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="kontakt" className="bg-slate-50 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Kontakt"
          title="Umów bezpłatną rozmowę telefoniczną"
          description="Podaj swój numer telefonu, wybierz dogodny termin, a my oddzwonimy, żeby porozmawiać o Twoich potrzebach IT."
        />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-navy-900 p-8 text-white">
              <h3 className="font-display text-xl font-bold">
                Dlaczego warto porozmawiać?
              </h3>
              <ul className="mt-6 space-y-4 text-sm text-slate-300">
                <li className="flex gap-3">
                  <CalendarCheck className="h-5 w-5 shrink-0 text-accent-400" />
                  Wybierasz termin, który Ci pasuje — bez czekania na odpowiedź mailową.
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-accent-400" />
                  Krótka rozmowa (ok. 30 minut) o Twoich potrzebach IT, bez zobowiązań.
                </li>
                <li className="flex gap-3">
                  <MessageSquare className="h-5 w-5 shrink-0 text-accent-400" />
                  Wstępne rekomendacje i wycena już podczas pierwszego kontaktu.
                </li>
              </ul>
              <div className="mt-8 space-y-2 border-t border-white/10 pt-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {siteConfig.contact.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {siteConfig.contact.email}
                </div>
                <div>{siteConfig.contact.hours}</div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-3"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <User className="h-3.5 w-3.5" /> Imię i nazwisko*
                </label>
                <input
                  {...register("name")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="Jan Kowalski"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Firma
                </label>
                <input
                  {...register("company")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="Nazwa firmy (opcjonalnie)"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Phone className="h-3.5 w-3.5" /> Numer telefonu*
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="+48 600 000 000"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Mail className="h-3.5 w-3.5" /> E-mail
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="jan@firma.pl (opcjonalnie)"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Temat rozmowy*
                </label>
                <select
                  {...register("topic")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                >
                  {bookingTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <MessageSquare className="h-3.5 w-3.5" /> Wiadomość
                </label>
                <textarea
                  {...register("message")}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="Krótko opisz swoją sytuację lub potrzeby (opcjonalnie)"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <label className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <CalendarDays className="h-3.5 w-3.5" /> Wybierz dzień*
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    type="button"
                    key={day.date}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setValue("date", day.date);
                      setValue("time", "");
                      setSelectedTime("");
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      selectedDate === day.date
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-slate-200 text-slate-600 hover:border-brand-300"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.date && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.date.message}
                </p>
              )}

              <label className="mt-5 mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Clock className="h-3.5 w-3.5" /> Wybierz godzinę*
              </label>
              <div className="flex flex-wrap gap-2">
                {activeDay?.times.length ? (
                  activeDay.times.map((time) => {
                    const isTaken = takenTimes.includes(time);
                    return (
                      <button
                        type="button"
                        key={time}
                        disabled={isTaken}
                        onClick={() => {
                          setValue("time", time);
                          setSelectedTime(time);
                        }}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          isTaken
                            ? "cursor-not-allowed border-slate-100 text-slate-300 line-through"
                            : selectedTime === time
                              ? "border-accent-500 bg-accent-500 text-white"
                              : "border-slate-200 text-slate-600 hover:border-accent-300"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">
                    Brak wolnych terminów tego dnia — wybierz inny dzień.
                  </p>
                )}
              </div>
              {errors.time && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.time.message}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3">
              <input
                {...register("consent")}
                type="checkbox"
                id="consent"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="consent" className="text-xs text-slate-500">
                Wyrażam zgodę na kontakt telefoniczny i e-mailowy w celu
                omówienia zapytania zgodnie z{" "}
                <a href="#" className="underline hover:text-brand-600">
                  polityką prywatności
                </a>
                .*
              </label>
            </div>
            {errors.consent && (
              <p className="mt-1 text-xs text-red-600">
                {errors.consent.message}
              </p>
            )}

            {submitState.status === "error" && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitState.message}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="mt-8 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Zapisywanie...
                </>
              ) : (
                "Umów rozmowę"
              )}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
