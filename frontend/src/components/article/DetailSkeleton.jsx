/**
 * Skeleton loader for the ArticleDetail page.
 * Matches the detail layout: hero image, title, meta, content sections.
 */
export default function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-12 bg-slate-200 rounded" />
        <div className="h-3 w-3 bg-slate-200 rounded" />
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-3 w-3 bg-slate-200 rounded" />
        <div className="h-3 w-24 bg-slate-200 rounded" />
      </div>

      {/* Hero image skeleton */}
      <div className="w-full h-48 sm:h-64 lg:h-80 bg-slate-200 rounded-xl mb-8" />

      {/* Content skeleton */}
      <div className="max-w-3xl">
        {/* Category + meta */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-5 w-24 bg-slate-200 rounded-md" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-1 bg-slate-200 rounded-full" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>

        {/* Title */}
        <div className="h-9 w-full bg-slate-200 rounded mb-3" />
        <div className="h-9 w-3/4 bg-slate-200 rounded mb-6" />

        {/* Subtitle */}
        <div className="h-5 w-full bg-slate-200 rounded mb-2" />
        <div className="h-5 w-5/6 bg-slate-200 rounded mb-6" />

        {/* Author bar */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200 mb-8">
          <div className="w-9 h-9 bg-slate-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        </div>

        {/* TOC skeleton */}
        <div className="bg-slate-100 rounded-xl p-5 mb-8 space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 bg-slate-200 rounded" style={{ width: `${60 + i * 8}%` }} />
          ))}
        </div>

        {/* Content paragraphs */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-4 bg-slate-200 rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
          ))}
        </div>

        {/* Section heading */}
        <div className="h-7 w-48 bg-slate-200 rounded mt-10 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-slate-200 rounded" style={{ width: `${80 + (i % 4) * 5}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
