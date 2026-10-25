export default function Loading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-7 w-40 rounded-lg bg-gray-200 dark:bg-slate-800" />
      <div className="h-4 w-64 rounded bg-gray-100 dark:bg-slate-800/80" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}
