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
    let mediaElement = null;
    let mediaUrl = null;
    let source = null;
    let workletNode = null;
    let destination = null;
    let processor = null;
    let recorder = null;

    const chunks = [];

    try {
      console.log("=================================");
      console.log("Loading DeepFilterNet3...");
      console.log("File:", file.name);
      console.log("Type:", file.type);
      console.log("Size:", file.size);
      console.log("=================================");

      // =====================================================
      // 1. Load DeepFilterNet3
      // =====================================================

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

      console.log("DeepFilterNet3 module loaded.");

      // =====================================================
      // 2. Create AudioContext
      // =====================================================

      audioContext = new AudioContext({
        sampleRate: 48000,
      });

      console.log(
        "AudioContext created:",
        audioContext.sampleRate,
        audioContext.state
      );

      if (audioContext.state !== "running") {
        await audioContext.resume();
      }

      console.log(
        "AudioContext running:",
        audioContext.state
      );

      // =====================================================
      // 3. Create DeepFilterNet3
      // =====================================================

      processor = new DeepFilterNet3Core({
        sampleRate: 48000,
        noiseReductionLevel: 80,

        assetConfig: {
          cdnUrl: `${window.location.origin}/deepfilternet`,
        },
      });

      console.log("Initializing DeepFilterNet3...");

      await processor.initialize();

      console.log(
        "DeepFilterNet3 WASM + model loaded successfully."
      );

      // =====================================================
      // 4. Create AudioWorklet
      // =====================================================

      console.log(
        "Creating DeepFilter AudioWorklet..."
      );

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
        "DeepFilter AudioWorklet created successfully."
      );

      // =====================================================
      // 5. Set Noise Suppression
      // =====================================================

      processor.setSuppressionLevel(80);

      console.log(
        "Noise suppression level:",
        80
      );

      // =====================================================
      // 6. Detect Audio / Video
      // =====================================================

      const isVideo = file.type.startsWith("video/");

      console.log(
        "Media type:",
        isVideo ? "VIDEO" : "AUDIO"
      );

      // =====================================================
      // 7. Create Internal Media Element
      // =====================================================

      mediaElement = document.createElement(
        isVideo ? "video" : "audio"
      );

      mediaUrl = URL.createObjectURL(file);

      mediaElement.src = mediaUrl;
      mediaElement.preload = "auto";

      if (isVideo) {
        mediaElement.playsInline = true;
      }

      /*
       * IMPORTANT:
       *
       * We DO NOT connect the media source to
       * audioContext.destination.
       *
       * Therefore the internal processing media
       * will not play through the speaker.
       *
       * Do NOT use:
       *
       * mediaElement.muted = true;
       * mediaElement.volume = 0;
       *
       * because we want the Web Audio graph to
       * receive the actual audio signal.
       */

      // =====================================================
      // 8. Wait Until Media Is Loaded
      // =====================================================

      await new Promise((resolve, reject) => {
        let finished = false;

        const cleanup = () => {
          mediaElement.removeEventListener(
            "loadedmetadata",
            handleLoaded
          );

          mediaElement.removeEventListener(
            "canplay",
            handleCanPlay
          );

          mediaElement.removeEventListener(
            "error",
            handleError
          );
        };

        const handleLoaded = () => {
          if (finished) return;

          finished = true;
          cleanup();

          console.log(
            "Media metadata loaded."
          );

          resolve();
        };

        const handleCanPlay = () => {
          if (finished) return;

          finished = true;
          cleanup();

          console.log(
            "Media can play."
          );

          resolve();
        };

        const handleError = () => {
          if (finished) return;

          finished = true;
          cleanup();

          reject(
            new Error(
              "Unable to load the uploaded audio/video file."
            )
          );
        };

        mediaElement.addEventListener(
          "loadedmetadata",
          handleLoaded
        );

        mediaElement.addEventListener(
          "canplay",
          handleCanPlay
        );

        mediaElement.addEventListener(
          "error",
          handleError
        );

        mediaElement.load();
      });

      console.log(
        "Media loaded successfully."
      );

      console.log(
        "Duration:",
        mediaElement.duration,
        "seconds"
      );

      // =====================================================
      // 9. Create MediaElementSource
      // =====================================================

      source =
        audioContext.createMediaElementSource(
          mediaElement
        );

      console.log(
        "MediaElementSource created."
      );

      // =====================================================
      // 10. Create Recording Destination
      // =====================================================

      destination =
        audioContext.createMediaStreamDestination();

      console.log(
        "MediaStreamDestination created."
      );

      // =====================================================
      // 11. Connect Audio Pipeline
      //
      // Media Element
      //      ↓
      // MediaElementSource
      //      ↓
      // DeepFilter AudioWorklet
      //      ↓
      // MediaStreamDestination
      //      ↓
      // MediaRecorder
      //
      // IMPORTANT:
      //
      // We DO NOT connect:
      //
      // workletNode → audioContext.destination
      //
      // So processed audio is not played
      // through the speaker.
      // =====================================================

      source.connect(workletNode);

      workletNode.connect(destination);

      console.log(
        "Audio processing pipeline connected."
      );

      // =====================================================
      // 12. Check MediaRecorder Format
      // =====================================================

      let mimeType = "";

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ];

      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      if (!mimeType) {
        throw new Error(
          "Your browser does not support a suitable audio recording format."
        );
      }

      console.log(
        "MediaRecorder MIME type:",
        mimeType
      );

      // =====================================================
      // 13. Create MediaRecorder
      // =====================================================

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

          console.log(
            "Recorded chunk:",
            event.data.size,
            "bytes"
          );
        }
      };

      const recordingFinished =
        new Promise((resolve, reject) => {
          recorder.onstop = () => {
            console.log(
              "MediaRecorder stopped."
            );

            resolve();
          };

          recorder.onerror = (event) => {
            reject(
              event.error ||
                new Error(
                  "MediaRecorder error."
                )
            );
          };
        });

      // =====================================================
      // 14. Start Recorder
      // =====================================================

      recorder.start(250);

      console.log(
        "MediaRecorder started."
      );

      console.log(
        "DeepFilterNet3 processing started."
      );

      // =====================================================
      // 15. Wait For Media To End
      // =====================================================

      const mediaFinished =
        new Promise((resolve, reject) => {
          const handleEnded = () => {
            cleanup();

            console.log(
              "Media playback ended."
            );

            resolve();
          };

          const handleError = () => {
            cleanup();

            reject(
              new Error(
                "Media playback failed during processing."
              )
            );
          };

          const cleanup = () => {
            mediaElement.removeEventListener(
              "ended",
              handleEnded
            );

            mediaElement.removeEventListener(
              "error",
              handleError
            );
          };

          mediaElement.addEventListener(
            "ended",
            handleEnded
          );

          mediaElement.addEventListener(
            "error",
            handleError
          );
        });

      // =====================================================
      // 16. Start Processing
      // =====================================================

      try {
        await mediaElement.play();
      } catch (playError) {
        throw new Error(
          `Unable to start media processing: ${playError.message}`
        );
      }

      console.log(
        "Internal media playback started."
      );

      await mediaFinished;

      // =====================================================
      // 17. Give AudioWorklet Time To Flush
      // =====================================================

      /*
       * DeepFilter has an internal frame/ring buffer.
       *
       * If recorder.stop() happens immediately when
       * media ends, the last processed frames can be lost.
       *
       * Give the Web Audio graph a little time to finish.
       */

      console.log(
        "Waiting for DeepFilter output buffer..."
      );

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      console.log(
        "Stopping recorder..."
      );

      // =====================================================
      // 18. Stop Recorder
      // =====================================================

      if (
        recorder &&
        recorder.state !== "inactive"
      ) {
        recorder.stop();
      }

      await recordingFinished;

      // =====================================================
      // 19. Validate Chunks
      // =====================================================

      console.log(
        "Total recorded chunks:",
        chunks.length
      );

      if (chunks.length === 0) {
        throw new Error(
          "No processed audio was produced."
        );
      }

      // =====================================================
      // 20. Create Clean Blob
      // =====================================================

      const cleanBlob = new Blob(
        chunks,
        {
          type: mimeType,
        }
      );

      console.log(
        "Clean audio generated:",
        cleanBlob.size,
        "bytes"
      );

      if (cleanBlob.size === 0) {
        throw new Error(
          "The processed audio file is empty."
        );
      }

      // =====================================================
      // 21. Create Clean File
      // =====================================================

      const extension =
        mimeType.includes("ogg")
          ? "ogg"
          : "webm";

      const cleanFile = new File(
        [cleanBlob],
        `clean-voice.${extension}`,
        {
          type: mimeType,
        }
      );

      console.log(
        "Clean audio file created:",
        cleanFile.name,
        cleanFile.size,
        "bytes"
      );

      // =====================================================
      // 22. Send To Home.jsx
      // =====================================================

      onCleanAudio(cleanFile);

      setCompleted(true);

      console.log(
        "================================="
      );

      console.log(
        "DeepFilterNet3 processing completed."
      );

      console.log(
        "================================="
      );
    } catch (err) {
      console.error(
        "================================="
      );

      console.error(
        "DeepFilterNet3 noise removal failed:"
      );

      console.error(err);

      console.error(
        "================================="
      );

      setError(
        err?.message ||
          "AI noise removal failed."
      );
    } finally {
      // =====================================================
      // Cleanup Recorder
      // =====================================================

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

      // =====================================================
      // Cleanup Media
      // =====================================================

      try {
        if (mediaElement) {
          mediaElement.pause();

          mediaElement.removeAttribute(
            "src"
          );

          mediaElement.load();
        }
      } catch (e) {
        console.error(
          "Media cleanup error:",
          e
        );
      }

      // =====================================================
      // Disconnect Source
      // =====================================================

      try {
        if (source) {
          source.disconnect();
        }
      } catch (e) {
        console.error(
          "Source disconnect error:",
          e
        );
      }

      // =====================================================
      // Disconnect Worklet
      // =====================================================

      try {
        if (workletNode) {
          workletNode.disconnect();
        }
      } catch (e) {
        console.error(
          "Worklet disconnect error:",
          e
        );
      }

      // =====================================================
      // Disconnect Destination
      // =====================================================

      try {
        if (destination) {
          destination.disconnect();
        }
      } catch (e) {
        console.error(
          "Destination cleanup error:",
          e
        );
      }

      // =====================================================
      // Destroy DeepFilter
      // =====================================================

      try {
        if (processor) {
          processor.destroy();
        }
      } catch (e) {
        console.error(
          "DeepFilter destroy error:",
          e
        );
      }

      // =====================================================
      // Close AudioContext
      // =====================================================

      try {
        if (
          audioContext &&
          audioContext.state !== "closed"
        ) {
          await audioContext.close();
        }
      } catch (e) {
        console.error(
          "AudioContext close error:",
          e
        );
      }

      // =====================================================
      // Revoke Object URL
      // =====================================================

      try {
        if (mediaUrl) {
          URL.revokeObjectURL(mediaUrl);
        }
      } catch (e) {
        console.error(
          "Object URL cleanup error:",
          e
        );
      }

      setProcessing(false);
    }
  };

  // =======================================================
  // No File
  // =======================================================

  if (!file) {
    return null;
  }

  const isVideo = file.type.startsWith("video/");

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="relative mx-auto mt-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 p-1 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">

      <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative rounded-[22px] border border-white/10 bg-slate-900/90 p-6 sm:p-8">

        {/* Header */}

        <div className="mb-7 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600">

              <svg
                className="h-7 w-7 text-white"
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

              <h2 className="text-xl font-bold text-white sm:text-2xl">
                AI Noise Remover
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                DeepFilterNet3 • Browser AI Processing
              </p>

            </div>

          </div>

          <div className="hidden rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300 sm:block">
            AI READY
          </div>

        </div>

        {/* File */}

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">

              <span className="text-xl">
                {isVideo ? "🎬" : "🎵"}
              </span>

            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate font-semibold text-white">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">

                {(file.size / 1024 / 1024).toFixed(2)} MB

                <span className="mx-2">
                  •
                </span>

                {isVideo
                  ? "Video audio will be extracted"
                  : "Ready for AI processing"}

              </p>

            </div>

          </div>

        </div>

        {/* Video Information */}

        {isVideo && (
          <div className="mb-6 rounded-2xl border border-violet-400/10 bg-violet-500/[0.05] p-4">

            <div className="flex items-start gap-3">

              <span className="text-lg">
                🎧
              </span>

              <div>

                <p className="text-sm font-semibold text-violet-300">
                  Audio Only
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Only the audio track will be processed.
                  The original video will not be modified.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* Processing */}

        {processing && (
          <div className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="font-semibold text-white">
                  AI is cleaning your voice
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Removing unwanted background noise...
                </p>

              </div>

              <div className="h-9 w-9 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />

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
                  Your clean audio is ready.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-5">

            <p className="font-semibold text-red-300">
              Noise removal failed
            </p>

            <p className="mt-1 break-words text-sm text-red-300/70">
              {error}
            </p>

          </div>
        )}

        {/* Button */}

        <button
          onClick={handleRemoveNoise}
          disabled={processing}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-4 font-bold text-white shadow-xl transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {processing
            ? "Processing Audio..."
            : completed
            ? "Process Again"
            : "Remove Noise with AI"}

        </button>

        {/* Footer */}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">

          <span>
            ● Runs in your browser
          </span>

          <span>
            •
          </span>

          <span>
            DeepFilterNet3 AI
          </span>

          <span>
            •
          </span>

          <span>
            48 kHz Processing
          </span>

        </div>

      </div>
    </div>
  );
}

export default NoiseReducer;