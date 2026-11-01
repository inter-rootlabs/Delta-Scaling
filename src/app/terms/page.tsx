import type { Metadata } from "next";
import { termsHtml } from "@/content/legal";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Terms of Service — Delta Scaling" };

export default function Page() {
  return <LegalPage html={termsHtml} />;
}
