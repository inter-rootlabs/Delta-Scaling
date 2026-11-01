"use client";

import { useMemo, useSyncExternalStore } from "react";
import FlexCarousel from "@/components/FlexCarousel";
import { useIntroLive, useTheme } from "./signals";

// Poster images rendered from ./posters.tsx (see /poster-sheet and scripts/render-posters.cjs).
const POSTERS = [
  { id: "meta", alt: "Poster: Meta ads, qualified demos" },
  { id: "arr", alt: "Poster: $200–500K new ARR per month" },
  { id: "funnel", alt: "Poster: funnels" },
  { id: "dots", alt: "Poster: ARR, not impressions" },
  { id: "booked", alt: "Poster: booked calls" },
  { id: "systems", alt: "Poster: paid ads, funnels, sales systems" },
  { id: "payback", alt: "Poster: payback under 4 months" },
];

// Wide screens: a continuous marquee. Phones and tablets: stop-and-glide steps.
const WIDE = "(min-width: 1024px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Background band of posters on the React Bits FlexCarousel, tuned calm: a light
 * ribbon bend (no colour split, no liquid), no wobble, a steady marquee on wide
 * screens and a slow critically-damped glide between steps on smaller ones, and no input — it's scenery behind the statue.
 */
export function PosterCarousel() {
  const theme = useTheme();
  // Mount as the loader lifts, so the carousel's own rise-in is the entrance.
  const live = useIntroLive();
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => true);
  const items = useMemo(() => POSTERS.map((p) => ({ src: `/posters/${p.id}-${theme}.webp`, alt: p.alt })), [theme]);

  return (
    <div className="ds-band" aria-hidden inert>
      {live && (
        <FlexCarousel
          items={items}
          preset="ribbon"
          intro="rise"
          cardHeight={0.5}
          gap={28}
          radius={14}
          fit="natural"
          bend={0.08}
          reach={0.2}
          dispersion={0}
          liquid={0}
          squeeze={0.04}
          autoplay={!wide}
          marquee={wide ? 34 : 0}
          interval={2.4}
          stiffness={14}
          sturdy
          captions={false}
          captureWheel={false}
          focusOnClick={false}
        />
      )}
    </div>
  );
}
