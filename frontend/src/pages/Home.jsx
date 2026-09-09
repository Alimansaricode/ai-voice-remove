import { useEffect, useState } from "react";
import UploadBox from "../components/UploadBox";
import AudioPlayer from "../components/AudioPlayer";
import NoiseReducer from "../components/NoiseReducer";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cleanAudio, setCleanAudio] = useState(null);

  const [originalUrl, setOriginalUrl] = useState(null);
  const [cleanUrl, setCleanUrl] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setCleanAudio(null);
  };

  // Original audio URL
  useEffect(() => {
    if (!selectedFile) {
      setOriginalUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Clean audio URL
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
    <main className="min-h-screen bg-gray-100 px-4 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center">

        {/* Heading */}
        <h1 className="text-center text-5xl font-bold text-gray-900">
          AI Voice
        </h1>

        <p className="mt-4 text-center text-lg text-gray-600">
          Remove background noise from your voice
        </p>

        <p className="mt-2 text-center text-gray-500">
          Upload your audio and make your voice cleaner.
        </p>

        {/* Upload */}
        <div className="mt-10 w-full flex justify-center">
          <UploadBox onFileSelect={handleFileSelect} />
        </div>

        {/* Original Audio */}
        {selectedFile && (
          <div className="w-full flex flex-col items-center">

            <AudioPlayer file={selectedFile} />

            {/* Noise Reducer */}
            <NoiseReducer
              file={selectedFile}
              onCleanAudio={setCleanAudio}
            />

          </div>
        )}

        {/* Clean Audio */}
        {cleanAudio && cleanUrl && (
          <div className="mt-10 w-full max-w-2xl">

            {/* Success message */}
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <p className="font-semibold text-green-700">
                ✓ Noise reduction completed
              </p>

              <p className="mt-1 text-sm text-green-600">
                Your cleaned audio is ready.
              </p>
            </div>

            {/* Clean Audio Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-xl font-bold text-gray-800">
                  Clean Audio
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  Cleaned
                </span>

              </div>

              <audio
                controls
                src={cleanUrl}
                className="w-full"
              />

              {/* Download */}
              <a
                href={cleanUrl}
                download="clean-voice.wav"
                className="mt-5 block w-full rounded-xl bg-green-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-green-700"
              >
                Download Clean Audio
              </a>

            </div>

            {/* Process Again */}
            <button
              onClick={() => setCleanAudio(null)}
              className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Process Again
            </button>

          </div>
        )}

      </div>
    </main>
  );
}

export default Home;