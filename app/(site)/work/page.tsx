import { CyberSectionMarker } from "@/components/CyberDeco";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-4 flex items-center gap-4">
        <CyberSectionMarker />
        <div className="home-section-rule flex-1" aria-hidden>
          <div className="home-section-rule__line" />
        </div>
      </div>
      <h1 className="font-mono text-3xl font-medium tracking-[0.12em] uppercase">Work</h1>
      <p className="mt-4 max-w-xl text-muted">
        Project showcase for {siteConfig.name} is coming in a later phase.
      </p>
    </div>
  );
}
