"use client";

import React, { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

/**
 * Brand LiquidGlass — rebuilt from glasscn's liquid-glass
 * (ported from the Abhishta site). A pane of
 * glass whose rounded rim bends what is behind it, like Apple's liquid glass:
 * a displacement map is drawn for the element's own size and radius, and the
 * backdrop is pushed outward along the curved edge while the middle stays flat.
 * Only Chromium renders SVG filters in backdrop-filter, so other browsers get
 * the same pane with a plain blur. A thin rim catches the light along the top
 * and bottom. Shape, fill and position come from `className` (it needs a
 * position — relative or absolute — for the rim); pair it with `glass()`.
 */
type Geometry = { width: number; height: number; radius: number; bezel: number };

const MAX_TEXTURE = 480;
const EDGE_TAPER = 1.25;
const maps = new Map<string, string>();

function displacementMap({ width, height, radius, bezel }: Geometry) {
  const key = `${width}:${height}:${radius}:${bezel}`;
  const hit = maps.get(key);
  if (hit !== undefined) return hit;

  const scale = Math.min(1, MAX_TEXTURE / Math.max(width, height));
  const tw = Math.max(2, Math.round(width * scale));
  const th = Math.max(2, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(tw, th);
  const d = img.data;
  const hw = width / 2;
  const hh = height / 2;
  const r = Math.min(radius, hw, hh);
  const band = Math.max(1, bezel * Math.min(hw, hh));

  for (let ty = 0; ty < th; ty++) {
    for (let tx = 0; tx < tw; tx++) {
      // texel centre in element space, origin at the centre; signed distance to the rounded rectangle and its normal
      const px = ((tx + 0.5) / tw) * width - hw;
      const py = ((ty + 0.5) / th) * height - hh;
      const qx = Math.abs(px) - (hw - r);
      const qy = Math.abs(py) - (hh - r);
      let dist: number;
      let nx = 0;
      let ny = 0;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy);
        dist = len - r;
        nx = (Math.sign(px) * qx) / len;
        ny = (Math.sign(py) * qy) / len;
      } else if (qx > qy) {
        dist = qx - r;
        nx = Math.sign(px);
      } else {
        dist = qy - r;
        ny = Math.sign(py);
      }
      const i = (ty * tw + tx) * 4;
      const inside = -dist;
      let m = 0;
      if (inside > 0) {
        // strongest at the rim, flat in the middle
        const t = Math.min(1, inside / band);
        m = (1 - Math.pow(1 - Math.pow(1 - t, 4), 0.25)) * Math.min(1, inside / EDGE_TAPER);
      }
      d[i] = Math.round(128 + nx * m * 127);
      d[i + 1] = Math.round(128 + ny * m * 127);
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = canvas.toDataURL("image/png");
  maps.set(key, url);
  return url;
}

// Safari and Firefox parse url() in backdrop-filter but don't render it, so only Chromium gets the bend.
const noop = () => () => {};
const chromium = () => /Chrom(e|ium)|Edg\//.test(navigator.userAgent) && !/Firefox/.test(navigator.userAgent);

export function LiquidGlass({
  blur = 2,
  refraction = 15,
  bezel = 0.34,
  saturation = 1.28,
  as: Tag = "div",
  className = "",
  style,
  children,
  "aria-hidden": ariaHidden,
}: {
  /** extra blur after the bend */
  blur?: number;
  /** how far the rim bends the backdrop */
  refraction?: number;
  /** share of the half-height used as the curved rim */
  bezel?: number;
  saturation?: number;
  /** "span" inside buttons and links */
  as?: "div" | "span";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  "aria-hidden"?: boolean;
}) {
  const id = `liquid-glass-${useId().replace(/:/g, "")}`;
  const ref = useRef<HTMLElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const supported = useSyncExternalStore(noop, chromium, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // the observer fires once on observe, then on every resize
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (!width || !height) return;
      const parsed = Number.parseFloat(getComputedStyle(el).borderTopLeftRadius);
      const radius = Math.min(Number.isFinite(parsed) ? parsed : Math.min(width, height) / 2, width / 2, height / 2);
      setGeo((g) => (g && g.width === width && g.height === height && g.radius === radius && g.bezel === bezel ? g : { width, height, radius, bezel }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [bezel]);

  const map = useMemo(() => (supported && geo ? displacementMap(geo) : ""), [supported, geo]);
  const filter = map ? `url(#${id}) blur(${blur}px) saturate(${saturation})` : `blur(${blur + 2}px) saturate(${saturation})`;

  return (
    <>
      <Tag
        ref={ref as React.Ref<HTMLDivElement & HTMLSpanElement>}
        aria-hidden={ariaHidden}
        className={`overflow-hidden ${className}`}
        style={{ ...style, backdropFilter: filter, WebkitBackdropFilter: filter }}
      >
        {children}
        {/* the rim: a light streak along the top and bottom, a faint dark one down the sides, fading at the corners */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            padding: "var(--liquid-glass-rim-width, 0.5px)",
            background:
              "linear-gradient(to right, transparent, var(--liquid-glass-rim-light, rgb(255 255 255 / 0.25)) var(--liquid-glass-rim-fade, 18%), var(--liquid-glass-rim-light, rgb(255 255 255 / 0.25)) calc(100% - var(--liquid-glass-rim-fade, 18%)), transparent), " +
              "linear-gradient(to bottom, transparent, var(--liquid-glass-rim-dark, rgb(0 0 0 / 0.2)) var(--liquid-glass-rim-fade, 18%), var(--liquid-glass-rim-dark, rgb(0 0 0 / 0.2)) calc(100% - var(--liquid-glass-rim-fade, 18%)), transparent)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
          }}
        />
      </Tag>
      {map ? (
        <svg aria-hidden="true" className="absolute size-0 overflow-hidden">
          <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage href={map} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={refraction} xChannelSelector="R" yChannelSelector="G" result="bent" />
            <feGaussianBlur in="bent" stdDeviation="0.15" />
          </filter>
        </svg>
      ) : null}
    </>
  );
}

/**
 * glasscn's liquid-refract surface as a backing layer: drop it inside any
 * positioned element that has `isolate` (see `glass()`), and that element
 * becomes a pane of refracting glass in its own shape, its content on top.
 * glasscn's defaults throughout: an 8% white fill, 2px blur, refraction 15.
 * `fill` replaces the fill (a bare bg class next to the default would lose to
 * it), e.g. a milky "bg-white/75" for frosted glass behind text over photos.
 */
export function GlassFill({
  className = "",
  fill = "bg-white/[0.08]",
  ...props
}: Omit<Parameters<typeof LiquidGlass>[0], "as" | "children"> & { fill?: string }) {
  return (
    <LiquidGlass
      as="span"
      aria-hidden
      {...props}
      className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] ${fill} [--liquid-glass-rim-fade:8%] [--liquid-glass-rim-light:rgb(255_255_255/0.55)] [--liquid-glass-rim-width:1.5px] ${className}`}
    />
  );
}
