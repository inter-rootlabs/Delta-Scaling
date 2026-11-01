import type { Metadata } from "next";
import { Bricolage_Grotesque, Playfair_Display, Space_Mono } from "next/font/google";
import "./ds.css";

const display = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], style: ["normal", "italic"] });
// Headline face carried over from the V3 direction.
const head = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const mono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Delta Scaling — We install your growth engine",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${head.variable} ${mono.variable} ds-root`}>{children}</div>;
}
