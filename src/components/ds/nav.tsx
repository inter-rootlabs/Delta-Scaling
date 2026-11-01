"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarDays, Moon, Sun } from "lucide-react";
import { LiquidGlass } from "@/components/bits/LiquidGlass";
import { BOOKING_URL } from "@/content/site";
import logo from "../../../public/logo-gold.png";
import { setTheme, useTheme } from "./signals";
import { StaggeredMenu } from "./staggered-menu";

const links = [
  { label: "Case Studies", href: "#case-studies" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
];

/**
 * Floating bubble of clear liquid glass (same build as the Abhishta site): inset from
 * the edges, a bright rim, the page bending slightly at its edge. Desktop: logo, links,
 * theme toggle and the Book a call button. Phones: logo, toggle and the staggered menu.
 */
export function DsNav() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="ds-nav">
      <div className="ds-nav__bubble" data-solid={solid || undefined}>
        <LiquidGlass aria-hidden className="ds-nav__glass" />
        <nav aria-label="Main" className="ds-nav__inner">
          <a href="#top" className="ds-nav__brand" aria-label="Delta Scaling, back to top">
            <Image src={logo} alt="" width={22} height={22} priority />
            <span className="ds-wordmark">
              Delta Scaling<sup>®</sup>
            </span>
          </a>

          <ul className="ds-nav__links">
            {links.map((l, i) => (
              <li key={l.href}>
                <a href={l.href} className="ds-navlink">
                  {i === 0 && <span className="ds-navlink__dot" aria-hidden />}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ds-nav__right">
            <button type="button" onClick={() => setTheme(next)} aria-label="Toggle colour theme" className="ds-nav__toggle">
              <Moon size={15} className="ds-theme-icon-moon" aria-hidden />
              <Sun size={15} className="ds-theme-icon-sun" aria-hidden />
            </button>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-nav__cta">
              Book a call
              <CalendarDays size={14} aria-hidden />
            </a>
            <div className="ds-nav__menu">
              <StaggeredMenu links={links} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
