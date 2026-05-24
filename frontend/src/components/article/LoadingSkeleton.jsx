/**
 * Skeleton loader matching ArticleCard layout.
 * Renders `count` placeholder cards with pulse animation.
 */
export default function LoadingSkeleton({ count = 3, featured = true }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {featured && <FeaturedSkeleton />}
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </section>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="sm:col-span-2 lg:col-span-2 bg-white rounded-xl border border-slate-200/60 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 h-48 md:h-auto bg-slate-100 animate-pulse" />
        <div className="md:w-3/5 p-6 sm:p-8 flex flex-col justify-center gap-4">
          <div className="h-5 w-24 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-7 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-7 w-3/4 bg-slate-100 rounded animate-pulse" />
          <div className="space-y-2 mt-2">
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="flex justify-between mt-4">
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-12 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
      <div className="h-0.5 bg-slate-100" />
      <div className="h-36 bg-slate-100 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-20 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-5 w-full bg-slate-100 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-slate-100 rounded animate-pulse" />
        <div className="space-y-2 mt-2">
          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="flex justify-between pt-3 border-t border-slate-100 mt-4">
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
