import Navbar from "../components/Navbar";

function Features() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-6xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
            AI Voice Features
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            Powerful Voice Enhancement
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Everything you need to make your voice recordings cleaner and
            clearer.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-3xl">🎙️</div>
              <h2 className="mt-4 text-xl font-semibold">
                Noise Removal
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Reduce unwanted background noise from your voice recordings.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-3xl">⚡</div>
              <h2 className="mt-4 text-xl font-semibold">
                Fast Processing
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Process audio quickly directly inside your browser.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-3xl">🔒</div>
              <h2 className="mt-4 text-xl font-semibold">
                Privacy
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Audio processing happens directly in your browser.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <div className="text-3xl">🎧</div>
              <h2 className="mt-4 text-xl font-semibold">
                Clear Voice
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Improve voice clarity by reducing unwanted sounds.
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default Features;