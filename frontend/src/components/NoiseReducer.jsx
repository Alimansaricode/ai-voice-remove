import { useState } from "react";

function NoiseReducer({ file, onCleanAudio }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleRemoveNoise = async () => {
    if (!file || processing) return;

    setProcessing(true);
    setError("");

    let audioContext = null;
    let audio = null;
    let audioUrl = null;
    let source = null;
    let workletNode = null;
    let processor = null;
    let recorder = null;

    const chunks = [];

    try {
      // ==========================================
      // 1. Load DeepFilterNet3
      // ==========================================

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

      // ==========================================
      // 2. Create AudioContext
      // ==========================================

      audioContext = new AudioContext({
        sampleRate: 48000,
      });

      await audioContext.resume();

      console.log(
        "AudioContext:",
        audioContext.sampleRate,
        audioContext.state
      );

      // ==========================================
      // 3. Create DeepFilterNet3
      // ==========================================

      processor = new DeepFilterNet3Core({
        sampleRate: 48000,

        // Start with 0.
        // Suppression is set after initialization.
        noiseReductionLevel: 0,

        assetConfig: {
          cdnUrl: `${window.location.origin}/deepfilternet`,
        },
      });

      // ==========================================
      // 4. Load WASM + Model
      // ==========================================

      await processor.initialize();

      console.log(
        "DeepFilterNet3 WASM + model loaded successfully."
      );

      // ==========================================
      // 5. Create AudioWorklet
      // ==========================================

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

      // ==========================================
      // 6. Set Noise Reduction
      // ==========================================

      processor.setSuppressionLevel(80);

      console.log(
        "Noise suppression level: 80"
      );

      // ==========================================
      // 7. Load Audio File
      // ==========================================

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

      // ==========================================
      // 8. Create Audio Source
      // ==========================================

      source =
        audioContext.createMediaElementSource(audio);

      // ==========================================
      // 9. Create Recording Destination
      // ==========================================

      const destination =
        audioContext.createMediaStreamDestination();

      // ==========================================
      // AUDIO FLOW
      //
      // Audio File
      //     ↓
      // MediaElementSource
      //     ↓
      // DeepFilterNet3
      //     ↓
      // MediaStreamDestination
      //     ↓
      // MediaRecorder
      // ==========================================

      source.connect(workletNode);

      workletNode.connect(destination);

      // ==========================================
      // 10. MediaRecorder
      // ==========================================

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

      // ==========================================
      // 11. Start Recording
      // ==========================================

      recorder.start();

      console.log(
        "DeepFilterNet3 processing started."
      );

      // ==========================================
      // 12. Play Audio
      // ==========================================

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

      // ==========================================
      // 13. Stop Recording
      // ==========================================

      if (recorder.state !== "inactive") {
        recorder.stop();
      }

      await recordingFinished;

      // ==========================================
      // 14. Check Output
      // ==========================================

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

      // ==========================================
      // 15. Create Clean File
      // ==========================================

      const cleanFile = new File(
        [cleanBlob],
        "clean-voice.webm",
        {
          type: mimeType,
        }
      );

      // ==========================================
      // 16. Send to Home.jsx
      // ==========================================

      onCleanAudio(cleanFile);

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
      // ==========================================
      // Cleanup
      // ==========================================

      try {
        if (recorder && recorder.state !== "inactive") {
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
    <div className="mt-6 w-full max-w-2xl">
      <button
        onClick={handleRemoveNoise}
        disabled={processing}
        className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing
          ? "AI Removing Noise..."
          : "Remove Noise with AI"}
      </button>

      {processing && (
        <div className="mt-4 rounded-xl bg-white p-4 text-center shadow">
          <p className="font-medium text-gray-800">
            AI is cleaning your voice...
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Please wait until processing is complete.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-100 p-4">
          <p className="font-medium text-red-700">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

export default NoiseReducer;