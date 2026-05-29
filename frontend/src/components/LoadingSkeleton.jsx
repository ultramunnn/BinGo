const Pulse = ({ className = "" }) => (
  <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
);

const AuthVariant = () => (
  <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
    <div className="hidden lg:flex lg:w-1/2 h-full relative bg-slate-200 animate-pulse">
      <div className="absolute inset-0 bg-slate-300/40" />
      <div className="relative z-20 flex flex-col justify-between h-full px-10 py-8">
        <Pulse className="h-9 w-28 bg-slate-300" />
        <div className="space-y-3 mb-4">
          <Pulse className="h-7 w-72 bg-slate-300" />
          <Pulse className="h-7 w-56 bg-slate-300" />
          <Pulse className="h-4 w-80 bg-slate-300 mt-2" />
          <Pulse className="h-4 w-64 bg-slate-300" />
        </div>
      </div>
      <svg className="absolute top-0 -right-1 h-full w-32 z-10 fill-white" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 0 C 50 0, 50 100, 100 100 L 100 0 Z" />
      </svg>
    </div>

    <div className="w-full lg:w-1/2 h-full flex flex-col relative">
      <div className="lg:hidden flex items-center ml-8 px-6 py-5">
        <Pulse className="h-9 w-28" />
      </div>
      <div className="flex-1 flex flex-col items-center px-6 md:px-12 py-12">
        <div className="w-full max-w-[420px] my-auto space-y-6">
          <Pulse className="h-5 w-20" />
          <div className="space-y-2">
            <Pulse className="h-8 w-48" />
            <Pulse className="h-4 w-64" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Pulse className="h-3 w-16" />
              <Pulse className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-12 w-full rounded-xl" />
            </div>
          </div>
          <Pulse className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="px-8 py-5 text-center">
        <Pulse className="h-3 w-64 mx-auto" />
      </div>
    </div>
  </div>
);

const ProfileVariant = () => (
  <div className="min-h-screen bg-slate-50">
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-6">
        <Pulse className="h-8 w-24" />
        <div className="hidden lg:flex items-center gap-6">
          <Pulse className="h-4 w-20" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
        </div>
        <Pulse className="w-8 h-8 rounded-full" />
      </div>
    </header>

    <main className="max-w-3xl mx-auto px-4 py-6 lg:py-10 space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex flex-col items-center pt-4 space-y-4">
          <Pulse className="w-24 h-24 rounded-full" />
          <Pulse className="h-6 w-40" />
          <Pulse className="h-4 w-52" />
        </div>
      </div>

      <div>
        <Pulse className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
            <Pulse className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Pulse className="h-8 w-12" />
              <Pulse className="h-4 w-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
            <Pulse className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Pulse className="h-8 w-20" />
              <Pulse className="h-4 w-28" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

const HistoryVariant = () => (
  <div className="min-h-screen bg-slate-50">
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-6">
        <Pulse className="h-8 w-24" />
        <div className="hidden lg:flex items-center gap-6">
          <Pulse className="h-4 w-20" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
        </div>
        <Pulse className="w-8 h-8 rounded-full" />
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-8 space-y-6">
      <div className="space-y-2">
        <Pulse className="h-8 w-48" />
        <Pulse className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-2">
          <Pulse className="h-3 w-20" />
          <Pulse className="h-7 w-16" />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-2">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-7 w-20" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Pulse className="h-11 flex-1 rounded-xl" />
        <Pulse className="h-11 w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <Pulse className="h-36 md:h-44 w-full rounded-none" />
            <div className="px-3 pt-2.5 pb-3 md:px-4 md:pt-3 md:pb-4 space-y-2">
              <Pulse className="h-5 w-24" />
              <Pulse className="h-4 w-16 rounded-md" />
              <Pulse className="h-3 w-32" />
              <div className="pt-2.5 border-t border-slate-100">
                <Pulse className="h-5 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

const variants = {
  auth: AuthVariant,
  profile: ProfileVariant,
  history: HistoryVariant,
};

const LoadingSkeleton = ({ variant = "auth" }) => {
  const Component = variants[variant] || AuthVariant;
  return <Component />;
};

export default LoadingSkeleton;
