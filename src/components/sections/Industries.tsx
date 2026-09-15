import { Building2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries } from "@/data/content";

export function Industries() {
  return (
    <section id="branze" className="bg-white py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Branże"
          title="Wspieramy firmy z różnych sektorów"
          description="Doświadczenie zdobyte w różnych branżach pozwala nam szybciej rozpoznać, jakie rozwiązania IT realnie przełożą się na wyniki Twojej firmy."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {industries.map((industry) => (
            <div
              key={industry}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 px-4 py-6 text-center transition-colors hover:border-brand-200 hover:bg-brand-50/40"
            >
              <Building2 className="h-6 w-6 text-brand-500" strokeWidth={1.75} />
              <span className="text-sm font-medium text-slate-700">
                {industry}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
