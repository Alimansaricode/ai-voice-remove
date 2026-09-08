import { useRef } from "react";

function UploadBox({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        onClick={() => fileInputRef.current.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-white p-10 text-center transition hover:border-blue-500 hover:bg-blue-50"
      >
        <div className="mb-4 text-5xl">🎙️</div>

        <h2 className="text-xl font-semibold text-gray-800">
          Upload your audio
        </h2>

        <p className="mt-2 text-gray-500">
          Click here to select an audio file
        </p>

        <p className="mt-2 text-sm text-gray-400">
          MP3, WAV, M4A supported
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default UploadBox;