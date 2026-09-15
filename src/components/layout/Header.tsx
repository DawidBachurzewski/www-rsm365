"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, PhoneCall } from "lucide-react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { nav, siteConfig } from "@/data/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className={clsx(
            "font-display text-xl font-bold tracking-tight transition-colors",
            scrolled ? "text-navy-900" : "text-white"
          )}
        >
          {siteConfig.name}
          <span className="text-brand-500">.</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-brand-500",
                scrolled ? "text-slate-700" : "text-white/90"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className={clsx(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              scrolled ? "text-slate-700" : "text-white/90"
            )}
          >
            <PhoneCall className="h-4 w-4" />
            {siteConfig.contact.phone}
          </a>
          <Button href="#kontakt" variant="primary" className="!px-5 !py-2.5">
            Umów rozmowę
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
            scrolled ? "text-navy-900" : "text-white"
          )}
          aria-label="Otwórz menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-600 px-5 py-3 text-center text-base font-semibold text-white"
            >
              Umów rozmowę
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
