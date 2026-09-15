"use client";

import dynamic from "next/dynamic";

// Scena WebGL renderowana wyłącznie w przeglądarce — ssr:false jest
// dozwolone tylko wewnątrz komponentu klienckiego (stąd osobny wrapper).
const NetworkScene = dynamic(
  () => import("./NetworkScene").then((mod) => mod.NetworkScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900/40" />
    ),
  }
);

export function HeroCanvas() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <NetworkScene />
    </div>
  );
}
