import type { Metadata } from "next";
import { privacyHtml } from "@/content/legal";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Privacy Policy — Delta Scaling" };

export default function Page() {
  return <LegalPage html={privacyHtml} />;
}
