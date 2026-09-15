import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/content";

export function Process() {
  return (
    <section id="jak-dzialamy" className="bg-navy-900 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Jak działamy"
          title="Prosty proces, przewidywalny efekt"
          description="Każde wdrożenie prowadzimy w czterech krokach — od audytu, przez plan i wdrożenie, po stałą opiekę nad środowiskiem."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item, idx) => (
            <div key={item.step} className="relative">
              <div className="font-display text-5xl font-bold text-white/10">
                {item.step}
              </div>
              <h3 className="-mt-6 text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
              {idx < processSteps.length - 1 && (
                <div className="absolute top-6 right-0 hidden h-px w-8 translate-x-full bg-white/10 lg:block" />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
