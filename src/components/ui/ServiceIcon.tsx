import {
  Cloud,
  ShieldCheck,
  Workflow,
  Headset,
  Database,
  Gauge,
  Compass,
  Network,
  Laptop,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import type { Service } from "@/data/content";

const map: Record<Service["icon"], LucideIcon> = {
  cloud: Cloud,
  shield: ShieldCheck,
  workflow: Workflow,
  headset: Headset,
  database: Database,
  gauge: Gauge,
  compass: Compass,
  network: Network,
  laptop: Laptop,
  sparkles: Sparkles,
};

export function ServiceIcon({
  icon,
  className,
}: {
  icon: Service["icon"];
  className?: string;
}) {
  const Icon = map[icon];
  return <Icon className={className} strokeWidth={1.75} />;
}
