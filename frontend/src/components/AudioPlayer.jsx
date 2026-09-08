function AudioPlayer({ file }) {
  if (!file) return null;

  const audioUrl = URL.createObjectURL(file);

  return (
    <div className="mt-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow">
      <h3 className="mb-3 font-semibold text-gray-800">
        Original Audio
      </h3>

      <p className="mb-4 text-sm text-gray-500">
        {file.name}
      </p>

      <audio
        controls
        src={audioUrl}
        className="w-full"
      />
    </div>
  );
}

export default AudioPlayer;