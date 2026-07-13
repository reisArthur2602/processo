const ClientDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="mb-8 flex items-center justify-between gap-4">
      <div className="h-5 w-48 rounded bg-line" />
      <div className="h-10 w-10 rounded-xl bg-line" />
    </div>

    <section className="mb-8">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="h-6 w-20 rounded-full bg-line" />
          </div>
          <div className="h-14 w-[480px] max-w-full rounded-lg bg-line" />
          <div className="h-4 w-64 rounded bg-line" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-control bg-line" />
        </div>
      </div>
    </section>

    <div className="grid items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-5">
        <div className="h-72 rounded-card border border-line bg-white shadow-panel" />
      </aside>
      <div className="h-[500px] rounded-card border border-line bg-white shadow-panel" />
    </div>
  </div>
);

export { ClientDetailSkeleton };
