"use client";

import { useEffect, useRef } from "react";

type Ring = { cx: number; cy: number; rx: number; ry: number; tilt: number };

// Ring shape as fractions of the hero box; tilt in degrees (negative drops the left side).
const RINGS: { query: string; ring: Ring }[] = [
  { query: "(max-width: 767px)", ring: { cx: 0.5, cy: 0.72, rx: 0.46, ry: 0.13, tilt: -6 } },
  { query: "(max-width: 1023px)", ring: { cx: 0.52, cy: 0.66, rx: 0.42, ry: 0.2, tilt: -10 } },
  { query: "all", ring: { cx: 0.52, cy: 0.6, rx: 0.4, ry: 0.27, tilt: -14 } },
];
const REVOLUTION_S = 90; // one full lap
const FADE_OVER = ".ds-h1, .ds-note, .ds-pill"; // posters fade while passing behind these

const pickRing = () => RINGS.find((r) => window.matchMedia(r.query).matches)!.ring;
const overlaps = (a: DOMRect, b: DOMRect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/**
 * Posters on a slow, continuous orbit around the statue, like a marquee ring.
 * Front-of-ring posters are slightly larger; anything passing behind the copy fades.
 */
export function Orbit({ children }: { children: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const hero = root?.parentElement;
    if (!root || !hero) return;
    const items = Array.from(root.children) as HTMLElement[];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ring = pickRing();
    let raf = 0;
    let visible = true;
    let blockers: DOMRect[] = [];
    let active = items;
    let statue: DOMRect | null = null;
    const start = performance.now();

    const measure = () => {
      ring = pickRing();
      active = items.filter((el) => getComputedStyle(el).display !== "none");
      const box = hero.getBoundingClientRect();
      blockers = Array.from(hero.querySelectorAll(FADE_OVER)).map((el) => {
        const r = el.getBoundingClientRect();
        return new DOMRect(r.left - box.left - 12, r.top - box.top - 12, r.width + 24, r.height + 24);
      });
      // The statue's solid core: posters passing behind it dim so they don't fight the dots.
      const fig = hero.querySelector(".ds-figure")?.getBoundingClientRect();
      statue = fig
        ? new DOMRect(fig.left - box.left + fig.width * 0.26, fig.top - box.top + fig.height * 0.12, fig.width * 0.5, fig.height)
        : null;
    };

    const place = (now: number) => {
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      const t = reduce ? 0 : (now - start) / 1000;
      const spin = (t / REVOLUTION_S) * Math.PI * 2;
      const tilt = (ring.tilt * Math.PI) / 180;
      active.forEach((el, i) => {
        const a = spin + (i / active.length) * Math.PI * 2;
        const ex = Math.cos(a) * ring.rx * w;
        const ey = Math.sin(a) * ring.ry * h;
        const x = ring.cx * w + ex * Math.cos(tilt) - ey * Math.sin(tilt);
        const y = ring.cy * h + ex * Math.sin(tilt) + ey * Math.cos(tilt);
        const depth = (Math.sin(a) + 1) / 2; // 0 = back of ring, 1 = front
        const scale = 0.8 + 0.3 * depth;
        const ew = el.offsetWidth * scale;
        const eh = el.offsetHeight * scale;
        const rect = new DOMRect(x - ew / 2, y - eh / 2, ew, eh);
        const hidden = blockers.some((b) => overlaps(rect, b));
        el.style.transform = `translate3d(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px, 0) scale(${scale.toFixed(3)})`;
        const behind = statue ? overlaps(new DOMRect(x - 1, y - 1, 2, 2), statue) : false;
        el.style.opacity = hidden ? "0.1" : behind ? "0.22" : String((0.7 + 0.3 * depth).toFixed(3));
      });
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      place(now);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    measure();
    place(performance.now());
    wake();
    const ro = new ResizeObserver(() => {
      measure();
      place(performance.now());
    });
    ro.observe(hero);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    });
    io.observe(hero);
    document.addEventListener("visibilitychange", wake);
    // The headline settles after its entrance; re-measure once fonts and motion are done.
    const late = window.setTimeout(measure, 2600);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.clearTimeout(late);
    };
  }, []);

  return (
    <div ref={ref} className="ds-orbit" aria-hidden>
      {children}
    </div>
  );
}
