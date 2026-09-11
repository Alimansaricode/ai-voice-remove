import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-16 text-white sm:py-20">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">

          {/* Hero */}
          <section className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
              About AI Voice
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Clean Your Voice with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="mt-6 text-base leading-7 text-slate-400 sm:text-lg">
              AI Voice is a browser-based voice enhancement tool designed to
              remove unwanted background noise and make your voice clearer.
            </p>
          </section>

          {/* About Card */}
          <section className="mt-16 grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                🎙️
              </div>

              <h2 className="text-2xl font-semibold">
                What is AI Voice?
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                AI Voice processes your audio directly inside your browser.
                It uses DeepFilterNet3 technology to reduce background noise
                while keeping your voice natural and clear.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">
                🤖
              </div>

              <h2 className="text-2xl font-semibold">
                AI Noise Reduction
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Background sounds such as fan noise, room noise and other
                unwanted sounds can be reduced to help produce a cleaner
                voice recording.
              </p>
            </div>

          </section>

          {/* Features */}
          <section className="mt-16">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold">
                Why Use AI Voice?
              </h2>

              <p className="mt-3 text-slate-400">
                Simple, private and easy to use.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="text-3xl">⚡</div>
                <h3 className="mt-4 font-semibold">Fast Processing</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Process your voice quickly in your browser.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="text-3xl">🔒</div>
                <h3 className="mt-4 font-semibold">Private</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Your audio can be processed locally in the browser.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="text-3xl">🎧</div>
                <h3 className="mt-4 font-semibold">Clear Audio</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Reduce unwanted background noise from recordings.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="text-3xl">🌐</div>
                <h3 className="mt-4 font-semibold">Browser Based</h3>
                <p className="mt-2 text-sm text-slate-400">
                  No separate desktop application is required.
                </p>
              </div>

            </div>
          </section>

          {/* Technology */}
          <section className="mt-16 rounded-3xl border border-blue-400/10 bg-gradient-to-br from-blue-500/10 via-violet-500/5 to-transparent p-8 text-center backdrop-blur-xl sm:p-12">

            <div className="mx-auto max-w-3xl">
              <div className="mb-4 text-4xl">🧠</div>

              <h2 className="text-3xl font-bold">
                Powered by DeepFilterNet3
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                AI Voice uses DeepFilterNet3-based noise suppression to
                process voice recordings and reduce unwanted background noise.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  DeepFilterNet3
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  WebAssembly
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  React
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  Vite
                </span>
              </div>
            </div>

          </section>

          {/* Footer */}
          <footer className="mt-16 border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-slate-500">
              AI Voice — Voice Enhancement powered by AI
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Runs directly in your browser
            </p>
          </footer>

        </div>
      </main>
    </>
  );
}

export default About;