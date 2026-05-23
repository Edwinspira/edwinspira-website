type WorkEmptyStateProps = {
  title: string;
  description: string;
};

export function WorkEmptyState({ title, description }: WorkEmptyStateProps) {
  return (
    <div
      className="work-empty-state mt-10 rounded border border-[var(--home-stat-red)]/30 bg-black/40 px-6 py-12 text-center sm:mt-12"
      role="status"
    >
      <p className="font-mono text-sm font-semibold tracking-[0.14em] text-foreground uppercase">
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
