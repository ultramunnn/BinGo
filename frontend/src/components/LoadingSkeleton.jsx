import NavbarDashboard from "../components/NavbarDashboard";

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
      <svg
        className="absolute top-0 -right-1 h-full w-32 z-10 fill-white"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
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
    <NavbarDashboard />

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

      <div className="mt-6 relative">
        <pulse className="absolute inset-0 bg-white rounded-2xl blur-sm" />
        <div className="relative flex items-center rounded-2xl gap-4 px-6 py-5 bg-slate-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shrink-0">
          </div>
        </div>
      </div>
    </main>
  </div>
);

const HistoryVariant = () => (
  <div className="min-h-screen bg-slate-50">
    <NavbarDashboard />

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
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
          >
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

const BeachDetailVariant = () => (
  <div className="animate-pulse">
    <div className="w-full h-48 bg-slate-200" />
    <div className="px-5 pt-4 flex flex-col gap-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-4 h-4 bg-slate-200 rounded" />
        ))}
        <div className="h-3 bg-slate-200 rounded w-16 ml-2" />
      </div>
    </div>
    <div className="px-5 pt-3 pb-4 flex flex-col gap-2">
      <div className="h-3 bg-slate-200 rounded w-full" />

      <div className="h-3 bg-slate-200 rounded w-5/6" />
    </div>
    <div className="mx-5 border-t border-slate-100" />
    <div className="px-5 py-4 flex flex-col gap-3">
      <div className="h-3 bg-slate-200 rounded w-24" />
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-slate-100 rounded-xl p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-full" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-3 bg-slate-200 rounded w-20" />
              <div className="h-2 bg-slate-200 rounded w-14" />
            </div>
          </div>
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-4/5" />
        </div>
      ))}
    </div>
  </div>
);

const LeaderboardVariant = () => (
  <div className="animate-pulse">
    <div className="flex items-end justify-center gap-2 pb-4">
      {[2, 1, 3].map((rank) => (
        <div key={rank} className="flex flex-col items-center flex-1 max-w-32">
          <div className="flex flex-col items-center mb-3 h-24">
            <div
              className={`rounded-full bg-slate-200 ${rank === 1 ? "w-14 h-14" : "w-12 h-12"}`}
            />
            <div className="mt-2 h-3 bg-slate-200 rounded w-16" />
            <div className="mt-1 h-2 bg-slate-200 rounded w-10" />
          </div>
          <div
            className={`${rank === 1 ? "h-36" : rank === 2 ? "h-28" : "h-20"} w-full rounded-xl bg-slate-200`}
          />
        </div>
      ))}
    </div>
    <div className="mt-4 flex flex-col gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-1.5">
          <div className="w-4 h-3 bg-slate-200 rounded" />
          <div className="w-6 h-6 rounded-full bg-slate-200" />
          <div className="flex-1 h-3 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-200 rounded w-10" />
        </div>
      ))}
    </div>
  </div>
);

const variants = {
  auth: AuthVariant,
  profile: ProfileVariant,
  history: HistoryVariant,
  beachDetail: BeachDetailVariant,
  leaderboard: LeaderboardVariant,
};

const LoadingSkeleton = ({ variant = "auth" }) => {
  const Component = variants[variant] || AuthVariant;
  return <Component />;
};

export default LoadingSkeleton;
