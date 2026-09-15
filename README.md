# RSM365 — nowa strona firmowa

Nowa wersja strony internetowej RSM365: Next.js (App Router) + TypeScript +
Tailwind CSS + React Three Fiber (elementy 3D) + formularz kontaktowy z
rezerwacją terminu rozmowy telefonicznej.

## Ważne zastrzeżenie: brak dostępu do rsm365.eu

Ta wersja strony powstała **bez dostępu do obecnej witryny** `https://rsm365.eu/`
— domena była zablokowana przez politykę sieciową środowiska, w którym
pracował asystent (żądania kończyły się błędem 403 na poziomie proxy, jeszcze
przed negocjacją TLS — to nie był problem z certyfikatem strony).

W związku z tym:

- **Treści** (opisy usług, nagłówki, sekcje) zostały napisane od podstaw na
  bazie briefu — nie są kopią obecnej strony.
- **Kolory** to nowa, profesjonalna paleta (granat + niebieski + cyan),
  a nie odwzorowanie palety `rsm365.eu`. Wszystkie kolory są zdefiniowane
  jako tokeny w `src/app/globals.css` (`--color-navy-*`, `--color-brand-*`,
  `--color-accent-*`) — podmiana na rzeczywiste kolory marki wymaga edycji
  tylko tego jednego miejsca.
- **Dane kontaktowe** (telefon, e-mail, adres w `src/data/content.ts` →
  `siteConfig.contact`) to placeholdery do podmiany na prawdziwe dane firmy.
- **Liczby i statystyki** (np. czas reakcji SLA) są przykładowe/orientacyjne —
  oznaczone gwiazdką i dopiskiem w interfejsie, do zastąpienia rzeczywistymi
  danymi.
- Nie umieszczono żadnych fikcyjnych referencji/opinii klientów ani logotypów
  klientów — to należy dodać dopiero z prawdziwymi, potwierdzonymi danymi.

Jeśli macie dostęp do treści/grafik obecnej strony, najprościej jest wkleić
tekst i kody HEX kolorów, a całą resztę (strukturę, animacje, formularz)
można zachować bez zmian.

## Co zawiera strona

- **Hero** z animowaną sceną 3D (React Three Fiber) — sieć węzłów
  symbolizująca chmurę/infrastrukturę IT, reagująca na ruch kursora.
- **Usługi** — rozbudowana oferta (10 usług), w tym punkty z briefu:
  zarządzana infrastruktura IT w chmurze, dopasowanie do klienta, wsparcie
  rozwoju firmy, automatyzacja i AI — plus dodatkowe, uzupełniające
  propozycje: Microsoft 365/Azure, cyberbezpieczeństwo, backup i disaster
  recovery, optymalizacja kosztów IT (FinOps), doradztwo IT, sieci i
  infrastruktura hybrydowa.
- **Jak działamy** — 4-etapowy proces współpracy.
- **Dlaczego RSM365** — sekcja różnicująca (dopasowanie do klienta, wsparcie
  rozwoju, automatyzacja/AI, bezpieczeństwo).
- **Branże** — sektory, którym firma może pomagać.
- **Kontakt / rezerwacja rozmowy** — formularz z wyborem dnia i godziny
  rozmowy telefonicznej (dni robocze, godz. 9–17, sloty co 30 minut),
  walidacją (Zod + React Hook Form), zapisem rezerwacji po stronie serwera
  i wykrywaniem zajętych terminów.

## Rezerwacja rozmowy i e-mail z zaproszeniem — stan obecny

Zgodnie z decyzją podjętą przy starcie prac, **ta wersja NIE wysyła
prawdziwych e-maili** (wymagałoby to danych dostępowych SMTP/API, których
asystent nie posiadał i nie mógł przetestować). Zaimplementowano pełną
resztę mechanizmu:

- formularz waliduje dane i zapisuje rezerwację (endpoint
  `POST /api/booking`, przechowywanie w pamięci procesu — do zastąpienia
  bazą danych w wersji produkcyjnej),
- `GET /api/booking?date=YYYY-MM-DD` zwraca zajęte godziny danego dnia, żeby
  formularz mógł je wyszarzyć,
- po rezerwacji użytkownik może **pobrać plik `.ics`** (kalendarzowe
  zaproszenie) wygenerowany w przeglądarce (`src/lib/ics.ts`) i dodać
  spotkanie do swojego kalendarza ręcznie,
- serwer loguje każdą rezerwację (`console.log`) w miejscu, gdzie docelowo
  powinna być wysyłka e-maila — patrz `src/app/api/booking/route.ts`.

Interfejs jawnie informuje użytkownika, że to wersja demonstracyjna i
zaproszenie trzeba na razie pobrać samodzielnie — żeby nie składać fałszywej
obietnicy "wysłaliśmy e-mail", skoro tego nie robimy.

### Podłączenie realnej wysyłki e-mail (kolejny krok)

Żeby formularz faktycznie wysyłał e-mail z zaproszeniem (do klienta i/lub do
zespołu sprzedaży), należy w `src/app/api/booking/route.ts`, w miejscu
komentarza `// Tryb demonstracyjny`, dodać wysyłkę np. przez:

- **Nodemailer + SMTP** (Microsoft 365 / Exchange Online, Gmail, dowolny
  serwer SMTP) — najbardziej uniwersalne rozwiązanie, dane logowania jako
  zmienne środowiskowe (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
  `SMTP_PASSWORD`, `BOOKING_NOTIFICATION_EMAIL`),
- transakcyjny dostawca e-mail (np. Resend, SendGrid, Postmark) — prostsze
  wdrożenie, wymaga klucza API dostawcy,
- Microsoft Graph API (`/me/sendMail`, `/me/events`) — jeśli firma korzysta
  z Microsoft 365, pozwala od razu utworzyć wydarzenie w kalendarzu Outlook
  i wysłać prawdziwe zaproszenie (a nie tylko plik `.ics`).

Treść `.ics` generowana w `src/lib/ics.ts` można wykorzystać jako gotowy
załącznik do wiadomości e-mail w każdym z powyższych wariantów.

## Struktura projektu

```
src/
  app/
    layout.tsx          — układ główny, fonty, metadane SEO
    page.tsx            — składa sekcje strony głównej
    globals.css         — tokeny kolorów i stylów (Tailwind v4)
    api/booking/route.ts— endpoint rezerwacji rozmowy (demo, patrz wyżej)
  components/
    layout/             — Header, Footer
    sections/           — Hero, Services, WhyUs, Process, Industries,
                           BookingSection
    three/               — scena 3D (NetworkScene, HeroCanvas)
    ui/                  — Container, Button, SectionHeading, ServiceIcon
  data/content.ts        — WSZYSTKIE treści strony (edytuj tutaj)
  lib/
    validation.ts        — schemat walidacji formularza (Zod)
    slots.ts             — logika dostępnych terminów rozmowy
    ics.ts               — generator pliku .ics
```

## Uruchomienie lokalne

```bash
npm install
npm run dev       # http://localhost:3000
```

Build produkcyjny:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Najczęstsze zmiany

- **Treści, oferta, dane kontaktowe:** `src/data/content.ts`.
- **Kolory / paleta marki:** `src/app/globals.css` (sekcja `:root`).
- **Godziny pracy / długość slotów rozmowy:** `src/lib/slots.ts`.
- **Wysyłka e-mail po rezerwacji:** `src/app/api/booking/route.ts` (patrz
  sekcja wyżej).
