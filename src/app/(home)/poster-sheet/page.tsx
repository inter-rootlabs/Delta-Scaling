import type { Metadata } from "next";
import {
  PosterArr,
  PosterBooked,
  PosterDots,
  PosterFunnel,
  PosterMeta,
  PosterPayback,
  PosterSystems,
} from "@/components/ds/posters";

// Internal: lays the posters out flat so scripts/render-posters.cjs can save them as
// the images the hero carousel uses. Not linked anywhere and not indexed.
export const metadata: Metadata = { title: "Poster sheet", robots: { index: false, follow: false } };

const posters = [
  { id: "meta", el: <PosterMeta /> },
  { id: "arr", el: <PosterArr /> },
  { id: "funnel", el: <PosterFunnel /> },
  { id: "dots", el: <PosterDots /> },
  { id: "booked", el: <PosterBooked /> },
  { id: "systems", el: <PosterSystems /> },
  { id: "payback", el: <PosterPayback /> },
];

export default function Page() {
  return (
    <main className="ds-sheet">
      {posters.map((p) => (
        <div key={p.id} className="ds-poster-wrap" data-poster={p.id}>
          {p.el}
        </div>
      ))}
    </main>
  );
}
