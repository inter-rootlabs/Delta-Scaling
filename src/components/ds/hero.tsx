import { BOOKING_URL } from "@/content/site";
import { HeroFigure } from "./hero-figure";
import { PosterCarousel } from "./poster-carousel";
import { RotatingWord } from "./rotating-word";
import { BrandMark } from "./brand-mark";

const v = (o: Record<string, string | number>) => o as React.CSSProperties;

const WORDS = ["growth engine.", "ARR velocity.", "paid funnels.", "sales systems."];

// Layout follows the reference hero: headline top-left, statue centred and cut by
// the bottom edge, a poster carousel behind it, a CTA pill bottom-left and a small
// paper note bottom-right.
export function DsHero() {
  return (
    <section id="top" className="ds-hero" aria-labelledby="ds-hero-title">
      <h1 id="ds-hero-title" className="ds-h1 ds-display">
        <span className="ds-mask" style={v({ "--i": 0 })}>
          <span>We install</span>
        </span>
        <span className="ds-mask" style={v({ "--i": 1 })}>
          <span>your</span>
        </span>
        <span className="ds-mask" style={v({ "--i": 2 })}>
          <span>
            <RotatingWord words={WORDS} className="ds-h1__box" />
          </span>
        </span>
      </h1>

      <PosterCarousel />

      <HeroFigure />

      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-pill ds-rise" style={v({ "--d": "0.9s" })}>
        <span className="ds-pill__mark" aria-hidden>
          <BrandMark size={20} />
        </span>
        Book a call
      </a>

      {/* The lede on a pasted paper scrap, held by a strip of tape, to match the poster collage. */}
      <div className="ds-note ds-rise" style={v({ "--d": "1s" })}>
        <span className="ds-note__tape" aria-hidden />
        <p>
          Paid ads, funnels, and sales systems for <mark className="ds-hl">B2B SaaS</mark> companies that already have a product worth buying. We
          measure in ARR, not impressions.
        </p>
      </div>
    </section>
  );
}
