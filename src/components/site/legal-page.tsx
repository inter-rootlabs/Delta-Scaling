import Link from "next/link";
import { Logo } from "./logo";
import { Footer } from "./footer";

// Shared shell for /privacy and /terms (uses the V1 tokens).
export function LegalPage({ html }: { html: string }) {
  return (
    <div className="theme-v1 min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link href="/" aria-label="Delta Scaling home">
          <Logo />
        </Link>
        <Link href="/" className="text-[14px] text-muted-foreground hover:text-foreground">
          Back to site
        </Link>
      </header>
      <article
        className="legal mx-auto max-w-3xl px-5 pt-8 pb-24 text-[16px] leading-[1.75] text-foreground/85 [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_h1]:mb-2 [&_h1]:text-5xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-foreground [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:mb-1.5 [&_p]:mb-4 [&_section]:scroll-mt-8 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_.legal-date]:text-[14px] [&_.legal-date]:text-muted-foreground [&_.legal-toc]:my-8 [&_.legal-toc]:rounded-2xl [&_.legal-toc]:border [&_.legal-toc]:border-border [&_.legal-toc]:bg-card [&_.legal-toc]:p-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Footer />
    </div>
  );
}
