# RSM365 — strona internetowa (statyczny HTML/CSS/JS)

Nowa strona firmowa RSM365. Czysty HTML/CSS/JS — **bez frameworka, bez backendu, bez procesu
budowania**. Wystarczy wgrać pliki na dowolny hosting statyczny (cPanel, GitHub Pages itp.).

## Struktura plików

```
index.html         — strona główna (wszystkie sekcje)
dziekujemy.html     — strona podziękowania po wysłaniu formularza
css/style.css       — wszystkie style (kolory jako zmienne CSS w :root)
js/main.js          — nawigacja mobilna, scroll-reveal, sloty godzinowe, animacja 3D w hero
img/favicon.svg     — favicon
```

## ⚠️ Wymagany jednorazowy krok: aktywacja formularza (FormSubmit.co)

Formularz rezerwacji rozmowy (`#kontakt`) wysyła zgłoszenia mailem **bez żadnego własnego
backendu** — korzysta z darmowego serwisu [FormSubmit.co](https://formsubmit.co/), do którego
formularz HTML wysyła zapytanie bezpośrednio z przeglądarki.

Docelowy adres to `dawid.bachurzewski@rsm365.eu` (zmienisz go w `index.html`, atrybut `action`
formularza `#bookingForm`).

**Zanim formularz zacznie działać:**
1. Opublikuj stronę na docelowym hostingu.
2. Wypełnij i wyślij formularz raz (dowolne dane testowe).
3. FormSubmit wyśle na `dawid.bachurzewski@rsm365.eu` wiadomość z linkiem aktywacyjnym —
   trzeba go kliknąć (jednorazowo, potwierdza że to Twój adres i chroni przed spamem).
4. Od tego momentu każde kolejne zgłoszenie z formularza trafia od razu na maila, w czytelnej
   tabeli (imię, telefon, e-mail, dzień, godzina, temat, wiadomość).

Jeśli chcesz zmienić docelowy e-mail, adres CC, temat wiadomości czy stronę przekierowania po
wysłaniu — edytuj pola `action` oraz ukryte pola `_subject`, `_cc`, `_next` w formularzu
(`index.html`, sekcja `<form class="booking-form">`). Pełna dokumentacja: https://formsubmit.co/

Alternatywa (jeśli FormSubmit przestanie odpowiadać potrzebom): serwis
[Web3Forms](https://web3forms.com/) — działa analogicznie, też bez backendu, wymaga tylko
darmowego klucza dostępu wklejonego jako ukryte pole `access_key`.

## Do uzupełnienia przed publikacją

- `kontakt@rsm365.eu` i numer telefonu w stopce/sekcji kontaktowej — jeśli firma używa innego
  adresu/numeru, podmień we wszystkich miejscach (wyszukaj `kontakt@rsm365.eu` w `index.html`).
- Prawdziwe dane liczbowe w sekcji hero (24/7, <15 min, 100%) — obecnie to wartości docelowe/
  orientacyjne, opisane gwiazdką jako indywidualnie ustalane w SLA.
- Favicon (`img/favicon.svg`) — obecnie prosty monogram „R” w kolorach marki; można podmienić na
  właściwe logo.

## Kolory i identyfikacja wizualna

Paleta została odtworzona na podstawie zrzutów ekranu z obecnej strony rsm365.eu (WordPress,
motyw „Saas Company”): fiolet jako kolor przewodni marki + akcenty teal/blue/coral. Wszystkie
kolory są zdefiniowane jako zmienne CSS na początku `css/style.css` (`:root { --violet-600: ...
}`) — zmiana wartości tam automatycznie zmienia kolorystykę całej strony.

## Animacja 3D w hero

Delikatna, obracająca się sieć punktów i połączeń w tle sekcji hero, zrealizowana przez
Three.js (ładowane z CDN `cdn.jsdelivr.net`, tylko gdy jest dostępny internet i użytkownik nie
ma włączonej opcji „ogranicz animacje” w systemie). Jeśli z jakiegoś powodu biblioteka się nie
załaduje, strona działa normalnie — po prostu bez animowanego tła.

## Formularz — dostępne terminy

Selektor godzin w formularzu generowany jest w `js/main.js` (stała `BUSINESS_START_HOUR = 9`,
`BUSINESS_END_HOUR = 17`, `SLOT_MINUTES = 30`) — pon.–pt., 9:00–17:00 co 30 minut. Wybór soboty/
niedzieli w polu daty jest blokowany komunikatem walidacyjnym. Zmiana godzin pracy = zmiana tych
trzech stałych.

## Rozwój strony

Treści (usługi, filary bezpieczeństwa M365, proces współpracy, wyróżniki, branże) są wpisane
bezpośrednio w `index.html` — nie ma osobnego pliku z danymi (to celowe uproszczenie, żeby
strona pozostała w 100% statycznym HTML). Aby dodać/zmienić usługę, skopiuj blok
`<article class="card service-card">...</article>` w sekcji `#oferta` i zmodyfikuj treść.
