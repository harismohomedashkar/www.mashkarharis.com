export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-navy-950 px-6 text-center text-white">
      {/* dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(var(--color-navy-700)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      {/* glow: 80% size, lighter blur on mobile, slower pulse */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[368px] w-[368px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-navy-600/50 via-blue-500/20 to-yellow-400/15 blur-2xl animate-[pulse_4s_ease-in-out_infinite] will-change-[opacity] motion-reduce:animate-none sm:blur-3xl"
      />

      <div className="relative flex flex-col items-center gap-3 py-4">
        <span className="rounded-full border border-navy-700 bg-navy-900/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-yellow-400 backdrop-blur">
          Welcome
        </span>

        <h1 className="bg-gradient-to-b from-white to-blue-200 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-7xl">
          Haris Space
        </h1>

        <p className="text-lg font-light tracking-wide text-blue-100/80 sm:text-3xl">
          Canvas for{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text font-medium text-transparent">
            Creativity
          </span>
        </p>
      </div>
    </main>
  );
}