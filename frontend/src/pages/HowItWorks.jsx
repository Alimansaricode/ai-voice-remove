import Navbar from "../components/Navbar";

function HowItWorks() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-400">
            How It Works
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            Clean Your Voice in 3 Steps
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Upload your audio, let AI remove the noise, and download your
            cleaned voice.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                1
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                Upload Audio
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Select your voice recording from your computer.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">
                2
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                AI Processing
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                DeepFilterNet3 processes the audio and reduces background
                noise.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                3
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                Download
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Preview your cleaned voice and download the processed audio.
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default HowItWorks;