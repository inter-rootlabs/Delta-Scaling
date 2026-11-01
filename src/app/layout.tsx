import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono-face", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Delta Scaling — We install your growth engine",
  description:
    "We add $200–500K ARR per month to PMF-validated B2B SaaS companies using paid ads, funnels, and a systemised sales process — with payback periods under 4 months.",
};

// Runs before first paint: applies the saved theme (dark by default) and skips the
// intro loader when motion is reduced.
const bootScript = `(function(){var d=document.documentElement;try{d.dataset.theme=localStorage.getItem("ds-theme")==="light"?"light":"dark"}catch(e){d.dataset.theme="dark"}try{if(matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.dsLoader="skip";d.dataset.dsIntro="go"}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
