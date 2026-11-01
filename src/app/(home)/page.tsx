import { DsHero } from "@/components/ds/hero";
import { Loader } from "@/components/ds/loader";
import { DsNav } from "@/components/ds/nav";

// Revamp: loader + hero only for now. Sections below the hero come in later passes.
export default function Page() {
  return (
    <>
      <noscript>
        <style>{`.ds-loader{display:none!important}.ds-mask>span,.ds-rise,.ds-pop,.ds-figure{animation:none!important;opacity:1!important}.ds-mask>span{transform:none!important}`}</style>
      </noscript>
      <Loader />
      <DsNav />
      <main>
        <DsHero />
      </main>
    </>
  );
}
