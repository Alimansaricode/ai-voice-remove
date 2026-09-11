import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* Logo */}
        <a
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-900/30 transition duration-300 group-hover:scale-105">

            <div className="absolute inset-0 animate-pulse rounded-xl bg-blue-400/20" />

            <svg
              className="relative h-6 w-6 text-white"
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
            <h1 className="text-lg font-bold tracking-tight text-white">
              AI Voice
            </h1>

            <p className="hidden text-[10px] uppercase tracking-widest text-slate-500 sm:block">
              Voice Enhancement
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          {/* Home */}
          <a
            href="/"
            className="text-sm font-medium text-white transition hover:text-blue-400"
          >
            Home
          </a>

          {/* Features */}
          <a
            href="/features"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Features
          </a>

          {/* How It Works */}
          <a
            href="/how-it-works"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            How It Works
          </a>

          {/* About */}
          <a
            href="/about"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            About
          </a>

        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-4 md:flex">

          {/* AI Online */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            AI Online

          </div>

          {/* GitHub */}
          <a
            href="https://github.com/Alimansaricode"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
          >
            GitHub
          </a>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
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
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          ) : (
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-5 py-5 md:hidden">

          <div className="flex flex-col gap-2">

            {/* Home */}
            <a
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.05]"
            >
              Home
            </a>

            {/* Features */}
            <a
              href="/features"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              Features
            </a>

            {/* How It Works */}
            <a
              href="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              How It Works
            </a>

            {/* About */}
            <a
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              About
            </a>

            <div className="my-2 h-px bg-white/10" />

            {/* Mobile Bottom */}
            <div className="flex items-center justify-between px-4 py-3">

              {/* AI Online */}
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">

                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                AI Online

              </div>

              {/* GitHub */}
              <a
                href="https://github.com/Alimansaricode"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300"
              >
                GitHub
              </a>

            </div>

          </div>

        </div>
      )}
    </nav>
  );
}

export default Navbar;