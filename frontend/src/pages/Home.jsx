import { useEffect, useState } from "react";

import UploadBox from "../components/UploadBox";
import AudioPlayer from "../components/AudioPlayer";
import NoiseReducer from "../components/NoiseReducer";
import Navbar from "../components/Navbar";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cleanAudio, setCleanAudio] = useState(null);

  const [cleanUrl, setCleanUrl] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setCleanAudio(null);
  };

  useEffect(() => {
    if (!cleanAudio) {
      setCleanUrl(null);
      return;
    }

    const url = URL.createObjectURL(cleanAudio);
    setCleanUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [cleanAudio]);

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-16 text-white sm:py-20">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

          <div className="absolute left-[-150px] top-[40%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px]" />

          <div className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />

        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">

          {/* Hero */}

          <div className="mb-10 text-center">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">

              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />

              AI POWERED VOICE ENHANCEMENT

            </div>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">

              Clean Your{" "}

              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Voice
              </span>

            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Remove unwanted background noise and make your
              voice clearer with AI-powered audio processing.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-400">
                🎙️ AI Noise Removal
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-400">
                ⚡ Fast Processing
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-400">
                🔒 Browser Processing
              </span>

            </div>

          </div>

          {/* Upload */}

          <div className="w-full">
            <UploadBox onFileSelect={handleFileSelect} />
          </div>

          {/* Processing */}

          {selectedFile && (
            <div className="mt-8 flex w-full flex-col items-center">

              <div className="mb-2 flex w-full max-w-3xl items-center gap-4">

                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs font-medium uppercase tracking-widest text-slate-600">
                  Audio Processing
                </span>

                <div className="h-px flex-1 bg-white/10" />

              </div>

              <AudioPlayer file={selectedFile} />

              <NoiseReducer
                file={selectedFile}
                onCleanAudio={setCleanAudio}
              />

            </div>
          )}

          {/* Clean Audio */}

          {cleanAudio && cleanUrl && (
            <div className="mt-10 w-full max-w-3xl">

              <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">

                    <svg
                      className="h-6 w-6 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>

                  </div>

                  <div>

                    <p className="font-semibold text-emerald-300">
                      AI Noise Removal Complete
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Your voice has been successfully processed.
                    </p>

                  </div>

                </div>

              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 p-1 shadow-2xl shadow-blue-950/20">

                <div className="relative rounded-[22px] border border-white/10 bg-slate-900/80 p-6 sm:p-7">

                  <div className="mb-5 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">

                        <svg
                          className="h-6 w-6 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 18V5l12-2v13"
                          />

                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />

                        </svg>

                      </div>

                      <div>

                        <h2 className="font-bold text-white sm:text-lg">
                          Clean Audio
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          AI enhanced voice
                        </p>

                      </div>

                    </div>

                    <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                      CLEANED

                    </span>

                  </div>

                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">

                    <div className="h-2 w-2 rounded-full bg-emerald-400" />

                    <p className="min-w-0 flex-1 truncate text-sm text-slate-300">
                      clean-voice.webm
                    </p>

                    <span className="shrink-0 text-xs text-slate-500">
                      {(cleanAudio.size / 1024 / 1024).toFixed(2)} MB
                    </span>

                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">

                    <audio
                      controls
                      src={cleanUrl}
                      className="w-full"
                    />

                  </div>

                  <a
                    href={cleanUrl}
                    download="clean-voice.webm"
                    className="group mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                  >

                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"
                      />
                    </svg>

                    Download Clean Audio

                  </a>

                </div>

              </div>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  setCleanAudio(null);
                }}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Process Another Audio
              </button>

            </div>
          )}

          {/* Features */}

          <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                ⚡
              </div>

              <h3 className="font-semibold text-white">
                Fast
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Process your audio directly in the browser.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-lg">
                🧠
              </div>

              <h3 className="font-semibold text-white">
                AI Powered
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                DeepFilterNet3 helps reduce unwanted noise.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
                🔒
              </div>

              <h3 className="font-semibold text-white">
                Private
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Audio processing happens on your device.
              </p>
            </div>

          </div>

          <p className="mt-10 text-center text-xs text-slate-600">
            Powered by DeepFilterNet3 • AI Voice Enhancement
          </p>

        </div>

      </main>
    </>
  );
}

export default Home;