import { useRef, useState } from "react";

function UploadBox({ onFileSelect }) {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith("audio/")) {
      onFileSelect(file);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />

      {/* Upload Card */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`group relative cursor-pointer overflow-hidden rounded-3xl border p-8 text-center backdrop-blur-xl transition-all duration-300 sm:p-12 ${
          dragging
            ? "scale-[1.01] border-blue-400 bg-blue-500/10 shadow-2xl shadow-blue-500/20"
            : "border-white/10 bg-slate-900/80 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-slate-900"
        }`}
      >
        {/* Animated Gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-violet-500/[0.06] opacity-0 transition duration-500 group-hover:opacity-100" />

        <div className="relative z-10">
          {/* Microphone Icon */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-xl shadow-blue-900/30 transition duration-300 group-hover:scale-105 group-hover:shadow-blue-500/30">
            
            {/* Glow */}
            <div className="absolute inset-0 animate-pulse rounded-3xl bg-blue-400/20" />

            <svg
              className="relative h-9 w-9 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <rect
                x="9"
                y="3"
                width="6"
                height="11"
                rx="3"
              />

              <path
                strokeLinecap="round"
                d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Upload Your Voice
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
            Upload an audio file and let AI remove unwanted
            background noise from your voice.
          </p>

          {/* Upload Button */}
          <div className="mx-auto mt-7 inline-flex items-center gap-3 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition duration-300 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-900/30">
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
                d="M12 16V4m0 0-4 4m4-4 4 4M5 20h14"
              />
            </svg>

            Choose Audio File
          </div>

          {/* Drag & Drop */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="h-px w-8 bg-white/10" />

            <span>
              or drag & drop your file here
            </span>

            <span className="h-px w-8 bg-white/10" />
          </div>

          {/* Supported Formats */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["MP3", "WAV", "M4A", "WEBM", "OGG"].map(
              (format) => (
                <span
                  key={format}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-slate-400 transition group-hover:border-blue-400/20 group-hover:text-slate-300"
                >
                  {format}
                </span>
              )
            )}
          </div>

          {/* Privacy */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <svg
              className="h-4 w-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 12 2 2 4-4"
              />
            </svg>

            Audio is processed directly in your browser
          </div>
        </div>

        {/* Hidden Input */}
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