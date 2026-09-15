import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Industries } from "@/components/sections/Industries";
import { BookingSection } from "@/components/sections/BookingSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <Industries />
      <BookingSection />
    </>
  );
}
