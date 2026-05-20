import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-medium tracking-tight">Work</h1>
      <p className="mt-4 max-w-xl text-muted">
        Project showcase for {siteConfig.name} is coming in a later phase.
      </p>
    </div>
  );
}
