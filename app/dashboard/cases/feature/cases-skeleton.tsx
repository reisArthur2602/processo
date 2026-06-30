const CasesSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
      <div className="space-y-3">
        <div className="h-3 w-40 rounded bg-line" />
        <div className="h-12 w-80 rounded-lg bg-line" />
        <div className="h-4 w-96 rounded bg-line" />
      </div>
      <div className="h-11 w-44 rounded-control bg-line" />
    </section>

    <section className="grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-28 rounded-card border border-line bg-white shadow-panel"
        />
      ))}
    </section>

    <div className="overflow-hidden rounded-card border border-line bg-white shadow-panel">
      <div className="border-b border-line px-5 py-4">
        <div className="h-9 w-72 rounded-lg bg-line" />
      </div>
      <div className="divide-y divide-line">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="h-4 w-36 rounded bg-line" />
            <div className="h-4 flex-1 rounded bg-line" />
            <div className="h-6 w-20 rounded-full bg-line" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export { CasesSkeleton };
