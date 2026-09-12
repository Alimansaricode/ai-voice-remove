import { useEffect, useState } from "react";

function AudioPlayer({ file }) {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setAudioUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file || !audioUrl) return null;

  const isVideo = file.type.startsWith("video/");

  return (
    <div className="relative mx-auto mt-6 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 p-1 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">

      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative rounded-[22px] border border-white/10 bg-slate-900/90 p-6 sm:p-7">

        <div className="mb-5 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
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

            <div>
              <h3 className="font-bold text-white sm:text-lg">
                Original {isVideo ? "Video" : "Audio"}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Your uploaded {isVideo ? "video" : "voice"}
              </p>
            </div>

          </div>

          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400 sm:block">
            ORIGINAL
          </span>

        </div>

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">

          <div className="h-2 w-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />

          <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-300">
            {file.name}
          </p>

          <span className="shrink-0 text-xs text-slate-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>

        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">

          {isVideo ? (
            <video
              controls
              src={audioUrl}
              className="max-h-[420px] w-full rounded-xl"
            />
          ) : (
            <audio
              controls
              src={audioUrl}
              className="w-full"
            />
          )}

        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">

          <svg
            className="h-4 w-4 text-blue-400"
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

          Listen to your original recording before AI enhancement

        </div>

      </div>
    </div>
  );
}

export default AudioPlayer;