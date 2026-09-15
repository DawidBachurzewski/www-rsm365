// Treści serwisowe strony RSM365.
//
// UWAGA: Zawartość tego pliku powstała bez dostępu do obecnej strony
// https://rsm365.eu/ (domena jest zablokowana przez politykę sieciową
// środowiska, w którym powstawała ta wersja strony). Teksty, dane liczbowe
// i przykłady poniżej są przygotowane redakcyjnie na bazie briefu klienta
// i typowej oferty firmy zarządzanych usług IT / cloud w Polsce.
// Przed publikacją produkcyjną należy podmienić:
//  - dane kontaktowe (telefon, e-mail, adres, NIP/KRS jeśli wymagane),
//  - twarde liczby (lata działalności, liczba klientów, SLA) na faktyczne,
//  - loga klientów / referencje na prawdziwe, potwierdzone przez klientów.

export const siteConfig = {
  name: "RSM365",
  legalName: "RSM365",
  tagline: "Twoja infrastruktura IT. W chmurze. Bez przestojów.",
  description:
    "RSM365 zarządza infrastrukturą IT Twojej firmy w chmurze — kompleksowo, bezpiecznie i w tempie, w jakim rozwija się Twój biznes.",
  domain: "rsm365.eu",
  contact: {
    // Placeholder — do podmiany na docelowe dane kontaktowe firmy.
    email: "kontakt@rsm365.eu",
    phone: "+48 22 000 00 00",
    phoneHref: "+48220000000",
    addressLines: ["ul. Przykładowa 1", "00-000 Warszawa, Polska"],
    hours: "Pon–Pt, 8:00–18:00 (wsparcie krytyczne 24/7)",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/rsm365",
  },
};

export const nav = [
  { label: "Usługi", href: "#uslugi" },
  { label: "Jak działamy", href: "#jak-dzialamy" },
  { label: "Dlaczego my", href: "#dlaczego-my" },
  { label: "Branże", href: "#branze" },
  { label: "Kontakt", href: "#kontakt" },
];

export const heroStats = [
  { value: "24/7", label: "Monitoring i wsparcie krytyczne" },
  { value: "<15 min", label: "Reakcja na zgłoszenia priorytetowe*" },
  { value: "100%", label: "Rozwiązania oparte na chmurze" },
];

export const heroStatsNote =
  "* Docelowy czas reakcji definiowany indywidualnie w umowie SLA.";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  icon:
    | "cloud"
    | "shield"
    | "workflow"
    | "headset"
    | "database"
    | "gauge"
    | "compass"
    | "network"
    | "laptop"
    | "sparkles";
};

export const services: Service[] = [
  {
    slug: "zarzadzana-infrastruktura-it",
    title: "Zarządzana infrastruktura IT w chmurze",
    short:
      "Kompleksowe zarządzanie całą infrastrukturą IT Twojej firmy w modelu chmurowym.",
    description:
      "Przejmujemy pełną odpowiedzialność za środowisko IT — od serwerów i sieci, przez systemy operacyjne, po aplikacje biznesowe — utrzymywane w chmurze publicznej, prywatnej lub hybrydowej.",
    bullets: [
      "Monitoring 24/7 i proaktywne zarządzanie incydentami",
      "Zarządzanie serwerami, sieciami i systemami w chmurze",
      "Aktualizacje, patche i utrzymanie bez przestojów w pracy zespołu",
    ],
    icon: "cloud",
  },
  {
    slug: "microsoft-365-azure",
    title: "Microsoft 365 i Azure",
    short:
      "Wdrożenia, licencjonowanie i optymalizacja środowiska Microsoft 365 oraz Azure.",
    description:
      "Projektujemy, wdrażamy i utrzymujemy środowiska oparte o Microsoft 365 i Azure — od poczty i pracy zespołowej, po tożsamość, zgodność i zaawansowane usługi chmurowe.",
    bullets: [
      "Migracja i konfiguracja Microsoft 365 (Exchange, Teams, SharePoint)",
      "Zarządzanie tożsamością i dostępem (Entra ID / Intune)",
      "Optymalizacja licencji i kosztów subskrypcji",
    ],
    icon: "laptop",
  },
  {
    slug: "migracja-do-chmury",
    title: "Migracja i modernizacja do chmury",
    short: "Bezpieczne przeniesienie infrastruktury on-premise do chmury.",
    description:
      "Planujemy i realizujemy migrację środowisk lokalnych do chmury — bez zakłóceń w codziennej pracy firmy, z jasnym planem, harmonogramem i oceną ryzyka.",
    bullets: [
      "Audyt obecnej infrastruktury i plan migracji",
      "Migracja serwerów, baz danych i aplikacji",
      "Testy, walidacja i wsparcie powdrożeniowe",
    ],
    icon: "database",
  },
  {
    slug: "cyberbezpieczenstwo",
    title: "Cyberbezpieczeństwo i zgodność",
    short: "Ochrona danych, systemów i użytkowników przed zagrożeniami.",
    description:
      "Wdrażamy wielowarstwowe zabezpieczenia — od ochrony poczty i urządzeń końcowych, przez zarządzanie podatnościami, po zgodność z wymaganiami regulacyjnymi (np. NIS2, RODO).",
    bullets: [
      "Ochrona endpointów, poczty i tożsamości",
      "Zarządzanie podatnościami i testy bezpieczeństwa",
      "Wsparcie w zgodności z RODO i NIS2",
    ],
    icon: "shield",
  },
  {
    slug: "automatyzacja-ai",
    title: "Automatyzacja procesów i rozwiązania AI",
    short: "Automatyzujemy powtarzalne procesy i wdrażamy narzędzia AI.",
    description:
      "Identyfikujemy procesy, które można przyspieszyć dzięki automatyzacji i sztucznej inteligencji — od automatyzacji zadań IT, po wdrożenia asystentów AI wspierających zespoły biznesowe.",
    bullets: [
      "Automatyzacja procesów IT i biznesowych (RPA, workflow)",
      "Wdrożenia rozwiązań AI (asystenci, analiza danych, Copilot)",
      "Integracje między systemami i chmurowymi aplikacjami SaaS",
    ],
    icon: "sparkles",
  },
  {
    slug: "helpdesk-wsparcie",
    title: "Wsparcie techniczne i helpdesk",
    short: "Wsparcie użytkowników i szybka reakcja na zgłoszenia.",
    description:
      "Zespół helpdesku wspiera pracowników Twojej firmy w codziennych sprawach IT — z jasno zdefiniowanym SLA i wieloma kanałami zgłoszeń.",
    bullets: [
      "Wsparcie zdalne i on-site dla pracowników",
      "Zgłoszenia telefonicznie, mailowo i przez portal",
      "Raportowanie i przegląd SLA",
    ],
    icon: "headset",
  },
  {
    slug: "backup-disaster-recovery",
    title: "Backup i ciągłość działania",
    short: "Kopie zapasowe i plany odtwarzania po awarii.",
    description:
      "Projektujemy strategie backupu i disaster recovery, dzięki którym Twoja firma jest przygotowana na awarię, atak ransomware czy błąd ludzki.",
    bullets: [
      "Automatyczne kopie zapasowe w chmurze",
      "Plany disaster recovery i testy odtwarzania",
      "Minimalizacja przestojów (RTO/RPO dopasowane do biznesu)",
    ],
    icon: "gauge",
  },
  {
    slug: "optymalizacja-kosztow-it",
    title: "Optymalizacja kosztów IT (FinOps)",
    short: "Przejrzysta kontrola wydatków na chmurę i licencje.",
    description:
      "Analizujemy wykorzystanie zasobów chmurowych i licencji, eliminując niepotrzebne koszty przy zachowaniu wydajności i bezpieczeństwa.",
    bullets: [
      "Audyt kosztów chmury i licencji",
      "Rekomendacje optymalizacji zasobów",
      "Bieżący monitoring wydatków IT",
    ],
    icon: "gauge",
  },
  {
    slug: "doradztwo-it",
    title: "Doradztwo IT i strategia cyfrowa",
    short: "Wsparcie w planowaniu rozwoju infrastruktury IT.",
    description:
      "Pomagamy zaplanować rozwój IT tak, aby nadążał za wzrostem firmy — od strategii technologicznej, po dobór rozwiązań dopasowanych do budżetu i celów biznesowych.",
    bullets: [
      "Audyt i strategia IT dopasowana do planów rozwoju firmy",
      "Doradztwo przy wyborze technologii i dostawców",
      "Wsparcie w budżetowaniu inwestycji IT",
    ],
    icon: "compass",
  },
  {
    slug: "siec-infrastruktura-hybrydowa",
    title: "Sieci i infrastruktura hybrydowa",
    short: "Projektowanie i utrzymanie sieci oraz środowisk hybrydowych.",
    description:
      "Zapewniamy stabilną i bezpieczną łączność między biurami, chmurą i pracownikami zdalnymi — z uwzględnieniem infrastruktury on-premise tam, gdzie jest to potrzebne.",
    bullets: [
      "Projektowanie sieci LAN/WAN i łączności VPN",
      "Środowiska hybrydowe (on-premise + chmura)",
      "Zarządzanie urządzeniami sieciowymi",
    ],
    icon: "network",
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Audyt i rozmowa o celach",
    description:
      "Poznajemy Twoją firmę, obecną infrastrukturę i cele biznesowe, żeby zaproponować rozwiązanie dopasowane do realnych potrzeb, a nie gotowy szablon.",
  },
  {
    step: "02",
    title: "Plan i architektura rozwiązania",
    description:
      "Przygotowujemy plan wdrożenia, harmonogram i architekturę środowiska — z jasno określonym zakresem, kosztem i poziomem SLA.",
  },
  {
    step: "03",
    title: "Wdrożenie bez przestojów",
    description:
      "Realizujemy migrację lub wdrożenie w sposób minimalizujący wpływ na bieżącą pracę zespołu, z pełną komunikacją na każdym etapie.",
  },
  {
    step: "04",
    title: "Stałe wsparcie i rozwój",
    description:
      "Monitorujemy środowisko 24/7, reagujemy na zgłoszenia i regularnie doradzamy, jak rozwijać infrastrukturę wraz ze wzrostem firmy.",
  },
];

export type Differentiator = {
  title: string;
  description: string;
  icon: "compass" | "shield" | "sparkles" | "gauge";
};

export const differentiators: Differentiator[] = [
  {
    title: "Rozwiązania dopasowane do klienta",
    description:
      "Nie sprzedajemy gotowych pakietów. Każde wdrożenie zaczynamy od analizy Twojego biznesu i budujemy architekturę IT dopasowaną do skali, budżetu i planów rozwoju.",
    icon: "compass",
  },
  {
    title: "Wsparcie w rozwoju firmy",
    description:
      "Infrastruktura IT rośnie razem z Twoją firmą. Planujemy skalowanie zasobów, zespołu i procesów tak, by technologia nigdy nie hamowała rozwoju biznesu.",
    icon: "gauge",
  },
  {
    title: "Automatyzacja i AI w praktyce",
    description:
      "Wdrażamy automatyzację i rozwiązania AI tam, gdzie realnie oszczędzają czas i pieniądze — od automatyzacji procesów IT po asystentów wspierających zespoły.",
    icon: "sparkles",
  },
  {
    title: "Bezpieczeństwo jako standard",
    description:
      "Każde wdrożenie uwzględnia bezpieczeństwo danych i zgodność z regulacjami od samego początku, a nie jako dodatek na końcu projektu.",
    icon: "shield",
  },
];

export const industries: string[] = [
  "Produkcja i przemysł",
  "Handel i e-commerce",
  "Usługi profesjonalne i doradztwo",
  "Finanse i księgowość",
  "Logistyka i transport",
  "Sektor publiczny",
];

export const bookingTopics = [
  "Zarządzana infrastruktura IT w chmurze",
  "Microsoft 365 / Azure",
  "Migracja do chmury",
  "Cyberbezpieczeństwo",
  "Automatyzacja i AI",
  "Inna sprawa",
];
