import { siGooglecalendar, siMeta } from "simple-icons";

// Poster-style graphics made for the hero. Violet leads; sun yellow only marks the
// key number or action. All copy comes from the site's own claims.

function Glyph({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d={path} fill="currentColor" />
    </svg>
  );
}

/** Meta ads: big Meta mark, "Qualified demos". */
export function PosterMeta() {
  return (
    <div className="ds-poster ds-poster--meta">
      <div className="ds-poster__top">
        <span>PAID ADS</span>
        <span>01</span>
      </div>
      <Glyph path={siMeta.path} className="ds-poster__meta-logo" />
      <div className="ds-poster__title">
        QUALIFIED
        <br />
        DEMOS
      </div>
      <div className="ds-poster__foot">not likes, not vanity</div>
    </div>
  );
}

/** ARR chart: rising violet bars, the last one in sun yellow. */
export function PosterArr() {
  const bars = [22, 30, 38, 50, 62, 78, 100];
  return (
    <div className="ds-poster ds-poster--arr">
      <div className="ds-poster__top">
        <span>NEW ARR / MONTH</span>
      </div>
      <div className="ds-poster__big ds-display">$200–500K</div>
      <div className="ds-poster__bars" aria-hidden>
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} className={i === bars.length - 1 ? "is-sun" : undefined} />
        ))}
      </div>
    </div>
  );
}

/** Funnel: stacked bars narrowing to a booked call. */
export function PosterFunnel() {
  const steps = ["ADS", "PAGE", "CRM", "CALL"];
  return (
    <div className="ds-poster ds-poster--funnel">
      <div className="ds-poster__title">FUNNELS</div>
      <div className="ds-poster__funnel" aria-hidden>
        {steps.map((s, i) => (
          <span key={s} style={{ width: `${100 - i * 20}%` }} className={i === steps.length - 1 ? "is-sun" : undefined}>
            {s}
          </span>
        ))}
      </div>
      <div className="ds-poster__foot">landing page · CRM · sequences</div>
    </div>
  );
}

/** Payback sticker: the one loud yellow piece. */
export function PosterPayback() {
  return (
    <div className="ds-poster ds-poster--sticker">
      <span className="ds-poster__sticker-label">PAYBACK</span>
      <span className="ds-poster__sticker-big">&lt;4</span>
      <span className="ds-poster__sticker-unit">MONTHS</span>
    </div>
  );
}

/** Booked calls: a calendar with filled slots and the Google Calendar mark. */
export function PosterBooked() {
  const filled = new Set([1, 4, 6, 9, 11, 14, 15, 18]);
  return (
    <div className="ds-poster ds-poster--booked">
      <div className="ds-poster__top">
        <span>BOOKED CALLS</span>
        <Glyph path={siGooglecalendar.path} className="ds-poster__gcal" />
      </div>
      <div className="ds-poster__cal" aria-hidden>
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className={i === 15 ? "is-sun" : filled.has(i) ? "is-on" : undefined} />
        ))}
      </div>
      <div className="ds-poster__title">
        BOOKED
        <br />
        CALLS
      </div>
    </div>
  );
}

/** Halftone dots + serif line from the lede. */
export function PosterDots() {
  return (
    <div className="ds-poster ds-poster--dots">
      <div className="ds-poster__dots-field" aria-hidden />
      <div className="ds-poster__serif ds-display">
        ARR,
        <br />
        <em>not impressions.</em>
      </div>
    </div>
  );
}

/** Systems: three services stacked as bold type. */
export function PosterSystems() {
  return (
    <div className="ds-poster ds-poster--systems">
      <div className="ds-poster__stack">
        <span>PAID ADS</span>
        <span>FUNNELS</span>
        <span>SALES</span>
        <span>SYSTEMS</span>
      </div>
      <div className="ds-poster__delta ds-display" aria-hidden>
        Δ
      </div>
    </div>
  );
}
