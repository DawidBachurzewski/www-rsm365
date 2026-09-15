import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { differentiators } from "@/data/content";

export function WhyUs() {
  return (
    <section id="dlaczego-my" className="bg-slate-50 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Dlaczego RSM365"
          title="Technologia, która nadąża za rozwojem Twojej firmy"
          description="Nie wdrażamy jednego uniwersalnego pakietu. Budujemy architekturę IT dopasowaną do etapu, w którym jest Twój biznes — i planujemy jej rozwój razem z Tobą."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {differentiators.map((item) => (
            <div key={item.title} className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-accent-400">
                <ServiceIcon icon={item.icon} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
