import { useState } from "react";
import UploadBox from "../components/UploadBox";
import AudioPlayer from "../components/AudioPlayer";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-16">

      <div className="mx-auto flex max-w-4xl flex-col items-center">

        <h1 className="text-center text-5xl font-bold text-gray-900">
          AI Voice
        </h1>

        <p className="mt-4 text-center text-lg text-gray-600">
          Remove background noise from your voice
        </p>

        <p className="mt-2 text-center text-gray-500">
          Upload your audio and make your voice cleaner.
        </p>

        <div className="mt-10 w-full flex justify-center">
          <UploadBox onFileSelect={setSelectedFile} />
        </div>

        {selectedFile && (
          <AudioPlayer file={selectedFile} />
        )}

      </div>

    </main>
  );
}

export default Home;