import { ArrowRight, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { heroStats, heroStatsNote, siteConfig } from "@/data/content";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-32 pb-40">
      <HeroCanvas />

      {/* Delikatna poświata pod treścią, żeby tekst był czytelny na scenie 3D */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900/10 via-navy-900/60 to-navy-900"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="animate-fade-in-up inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-300 backdrop-blur">
            Zarządzane usługi IT w chmurze
          </span>

          <h1
            className="animate-fade-in-up mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            {siteConfig.tagline}
          </h1>

          <p
            className="animate-fade-in-up mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            Projektujemy, wdrażamy i utrzymujemy infrastrukturę IT dopasowaną
            do Twojego biznesu — od chmury i cyberbezpieczeństwa, po
            automatyzację i sztuczną inteligencję.
          </p>

          <div
            className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <Button href="#kontakt" variant="primary" className="w-full sm:w-auto">
              <PhoneCall className="h-4 w-4" />
              Umów rozmowę telefoniczną
            </Button>
            <Button href="#uslugi" variant="ghost" className="w-full sm:w-auto">
              Zobacz ofertę
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className="animate-fade-in-up mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:grid-cols-3"
          style={{ animationDelay: "320ms" }}
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          {heroStatsNote}
        </p>
      </Container>
    </section>
  );
}
