import { useState } from "react";

function NoiseReducer({ file, onCleanAudio }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleRemoveNoise = async () => {
    if (!file || processing) return;

    setProcessing(true);
    setError("");
    setCompleted(false);

    let audioContext = null;
    let audio = null;
    let audioUrl = null;
    let source = null;
    let workletNode = null;
    let processor = null;
    let recorder = null;

    const chunks = [];

    try {
      console.log("Loading DeepFilterNet3...");

      const module = await import(
        /* @vite-ignore */
        `${window.location.origin}/deepfilternet/index.esm.js`
      );

      const { DeepFilterNet3Core } = module;

      if (!DeepFilterNet3Core) {
        throw new Error(
          "DeepFilterNet3Core could not be loaded."
        );
      }

      audioContext = new AudioContext({
        sampleRate: 48000,
      });

      await audioContext.resume();

      console.log(
        "AudioContext:",
        audioContext.sampleRate,
        audioContext.state
      );

      processor = new DeepFilterNet3Core({
        sampleRate: 48000,
        noiseReductionLevel: 0,

        assetConfig: {
          cdnUrl: `${window.location.origin}/deepfilternet`,
        },
      });

      await processor.initialize();

      console.log(
        "DeepFilterNet3 WASM + model loaded successfully."
      );

      console.log("Creating DeepFilter AudioWorklet...");

      workletNode =
        await processor.createAudioWorkletNode(
          audioContext
        );

      if (!workletNode) {
        throw new Error(
          "DeepFilter AudioWorklet could not be created."
        );
      }

      console.log(
        "DeepFilter AudioWorklet created."
      );

      processor.setSuppressionLevel(80);

      console.log(
        "Noise suppression level: 80"
      );

      audio = new Audio();

      audioUrl = URL.createObjectURL(file);

      audio.src = audioUrl;
      audio.preload = "auto";

      await new Promise((resolve, reject) => {
        audio.oncanplay = resolve;

        audio.onerror = () => {
          reject(
            new Error(
              "Unable to load the uploaded audio file."
            )
          );
        };

        audio.load();
      });

      console.log(
        "Audio file loaded successfully."
      );

      source =
        audioContext.createMediaElementSource(audio);

      const destination =
        audioContext.createMediaStreamDestination();

      source.connect(workletNode);

      workletNode.connect(destination);

      const mimeType =
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus"
        )
          ? "audio/webm;codecs=opus"
          : "audio/webm";

      recorder = new MediaRecorder(
        destination.stream,
        {
          mimeType,
        }
      );

      recorder.ondataavailable = (event) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          chunks.push(event.data);
        }
      };

      const recordingFinished =
        new Promise((resolve, reject) => {
          recorder.onstop = resolve;

          recorder.onerror = (event) => {
            reject(
              event.error ||
                new Error(
                  "Audio recording failed."
                )
            );
          };
        });

      recorder.start();

      console.log(
        "DeepFilterNet3 processing started."
      );

      const audioFinished =
        new Promise((resolve, reject) => {
          audio.onended = resolve;

          audio.onerror = () => {
            reject(
              new Error(
                "Audio playback failed."
              )
            );
          };
        });

      await audio.play();

      await audioFinished;

      if (recorder.state !== "inactive") {
        recorder.stop();
      }

      await recordingFinished;

      if (chunks.length === 0) {
        throw new Error(
          "DeepFilterNet3 did not produce any audio output."
        );
      }

      const cleanBlob = new Blob(chunks, {
        type: mimeType,
      });

      if (cleanBlob.size === 0) {
        throw new Error(
          "Cleaned audio file is empty."
        );
      }

      console.log(
        "Cleaned audio generated:",
        cleanBlob.size,
        "bytes"
      );

      const cleanFile = new File(
        [cleanBlob],
        "clean-voice.webm",
        {
          type: mimeType,
        }
      );

      onCleanAudio(cleanFile);

      setCompleted(true);

      console.log(
        "DeepFilterNet3 processing completed."
      );
    } catch (err) {
      console.error(
        "DeepFilterNet3 noise removal failed:",
        err
      );

      setError(
        err?.message ||
          "AI noise removal failed."
      );
    } finally {
      try {
        if (
          recorder &&
          recorder.state !== "inactive"
        ) {
          recorder.stop();
        }
      } catch (e) {
        console.error(
          "Recorder cleanup error:",
          e
        );
      }

      try {
        if (audio) {
          audio.pause();
          audio.removeAttribute("src");
          audio.load();
        }

        if (source) {
          source.disconnect();
        }

        if (workletNode) {
          workletNode.disconnect();
        }

        if (processor) {
          processor.destroy();
        }

        if (
          audioContext &&
          audioContext.state !== "closed"
        ) {
          await audioContext.close();
        }

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
      } catch (cleanupError) {
        console.error(
          "Cleanup error:",
          cleanupError
        );
      }

      setProcessing(false);
    }
  };

  if (!file) {
    return null;
  }

  return (
    <div className="relative mx-auto mt-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 p-1 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">

      {/* Animated Background Glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative rounded-[22px] border border-white/10 bg-slate-900/90 p-6 sm:p-8">

        {/* Header */}
        <div className="mb-7 flex items-center justify-between">

          <div className="flex items-center gap-4">

            {/* AI Icon */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">

              <div className="absolute inset-0 animate-pulse rounded-2xl bg-blue-400/20" />

              <svg
                className="relative h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v18m4-15v12m4-8v4M8 6v12M4 9v6"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                AI Noise Remover
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                DeepFilterNet3 • Browser AI Processing
              </p>
            </div>
          </div>

          {/* AI Badge */}
          <div className="hidden items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300 sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            AI READY
          </div>
        </div>

        {/* Audio File Card */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.06]">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <svg
                className="h-6 w-6 text-blue-400"
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

            <div className="min-w-0 flex-1">

              <p className="truncate font-semibold text-white">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
                <span className="mx-2">•</span>
                Ready for AI processing
              </p>

            </div>

            <div className="hidden rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 sm:block">
              Ready
            </div>

          </div>
        </div>

        {/* Processing Visualizer */}
        {processing && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <p className="font-semibold text-white">
                  AI is cleaning your voice
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Removing unwanted background noise...
                </p>
              </div>

              {/* Spinner */}
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />

            </div>

            {/* Sound Wave */}
            <div className="flex h-12 items-center justify-center gap-1.5">

              {[4, 8, 14, 22, 30, 18, 26, 12, 20, 32, 16, 28, 10, 24, 14, 30, 18, 8, 22, 12].map(
                (height, index) => (
                  <div
                    key={index}
                    className="w-1.5 animate-pulse rounded-full bg-blue-400"
                    style={{
                      height: `${height}px`,
                      animationDelay: `${index * 70}ms`,
                    }}
                  />
                )
              )}

            </div>

            {/* Processing Steps */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs">

              <div className="rounded-lg bg-white/[0.04] p-2 text-blue-300">
                ✓ Analyze Audio
              </div>

              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-300">
                ● Remove Noise
              </div>

              <div className="rounded-lg bg-white/[0.04] p-2 text-slate-500">
                ○ Generate Voice
              </div>

            </div>

          </div>
        )}

        {/* Success */}
        {completed && !processing && (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-5">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15">

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
                  Noise removed successfully
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Your cleaned voice is ready.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-5">

            <div className="flex gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">

                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3Z"
                  />
                </svg>

              </div>

              <div>
                <p className="font-semibold text-red-300">
                  Noise removal failed
                </p>

                <p className="mt-1 break-words text-sm text-red-300/70">
                  {error}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={handleRemoveNoise}
          disabled={processing}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-4 font-bold text-white shadow-xl shadow-blue-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >

          {/* Button Shine */}
          {!processing && (
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          )}

          <span className="relative flex items-center justify-center gap-3">

            {processing ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing Audio...
              </>
            ) : completed ? (
              <>
                <svg
                  className="h-5 w-5"
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

                Process Again
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v18m4-15v12m4-8v4M8 6v12M4 9v6"
                  />
                </svg>

                Remove Noise with AI
              </>
            )}

          </span>
        </button>

        {/* Footer Info */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">

          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Runs in your browser
          </span>

          <span>•</span>

          <span>DeepFilterNet3 AI</span>

          <span>•</span>

          <span>48 kHz Processing</span>

        </div>

      </div>
    </div>
  );
}

export default NoiseReducer;