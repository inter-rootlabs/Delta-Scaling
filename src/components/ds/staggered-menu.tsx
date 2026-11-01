"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BOOKING_URL } from "@/content/site";

/**
 * Phone menu, adapted from the React Bits StaggeredMenu used on the Abhishta site:
 * two violet layers sweep in from the right, the dark panel lands on top, and the
 * links rise one after another, each with its number. Escape closes it, focus
 * moves into the panel and back to the toggle, and page scroll is held.
 */
export function StaggeredMenu({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wasOpen = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const layers = root.querySelectorAll("[data-prelayer]");
      const panel = panelRef.current;
      const items = root.querySelectorAll("[data-menu-link]");
      const numbers = root.querySelectorAll("[data-menu-num]");
      const extras = root.querySelectorAll("[data-menu-extra]");
      gsap.set([...layers, panel], { xPercent: 101 });
      root.querySelector<HTMLElement>("[data-menu-overlay]")?.setAttribute("data-ready", "");

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      if (reduce) {
        tl.to([...layers, panel], { xPercent: 0, duration: 0.01 });
      } else {
        tl.to(layers, { xPercent: 0, duration: 0.55, stagger: 0.08 })
          .to(panel, { xPercent: 0, duration: 0.7 }, 0.14)
          .fromTo(items, { yPercent: 120 }, { yPercent: 0, duration: 0.9, stagger: 0.07 }, 0.32)
          .fromTo(numbers, { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.07, ease: "power2.out" }, 0.6)
          .fromTo(extras, { opacity: 0, y: 13 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.5);
      }
      tlRef.current = tl;
    }, root);
    return () => ctx.revert();
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!open && !wasOpen.current) return;
    wasOpen.current = open;
    if (open) {
      tl.timeScale(1).play();
      document.body.style.overflow = "hidden";
      panelRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      tl.timeScale(1.6).reverse();
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a, button")].filter(
          Boolean,
        ) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={rootRef} className="ds-smenu">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="ds-site-menu"
        onClick={() => setOpen((v) => !v)}
        className="ds-smenu__toggle"
        data-open={open || undefined}
      >
        <span className="ds-smenu__roll">
          <span>Menu</span>
          <span>Close</span>
        </span>
      </button>

      <div data-menu-overlay="" className="ds-smenu__overlay" data-open={open || undefined} aria-hidden={!open}>
        <button type="button" tabIndex={-1} aria-label="Close menu" onClick={close} className="ds-smenu__scrim" />
        <div data-prelayer="" className="ds-smenu__layer ds-smenu__layer--a" />
        <div data-prelayer="" className="ds-smenu__layer ds-smenu__layer--b" />
        <nav id="ds-site-menu" ref={panelRef} aria-label="Site" inert={!open} className="ds-smenu__panel">
          <ul className="ds-smenu__list">
            {links.map((link, i) => (
              <li key={link.href}>
                <a data-menu-link="" href={link.href} onClick={close} className="ds-smenu__link">
                  {link.label}
                  <span data-menu-num="" aria-hidden="true" className="ds-smenu__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="ds-smenu__extras">
            <a data-menu-extra="" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-smenu__cta">
              Book a call
            </a>
            <a data-menu-extra="" href="mailto:team@deltascaling.com" className="ds-smenu__mail">
              team@deltascaling.com
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
