const IntakeDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="mb-8 flex items-center justify-between gap-4">
      <div className="h-5 w-48 rounded bg-line" />
    </div>

    <section className="mb-8 space-y-3">
      <div className="h-6 w-32 rounded-full bg-line" />
      <div className="h-12 w-96 max-w-full rounded-lg bg-line" />
      <div className="h-4 w-64 rounded bg-line" />
    </section>

    <div className="h-[640px] rounded-card border border-line bg-white shadow-panel" />
  </div>
);

export { IntakeDetailSkeleton };
