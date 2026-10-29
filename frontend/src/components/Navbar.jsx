import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    function syncUser() {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
    }

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  }

  const linkClass =
    "rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-white/[0.05]";

  const navLinkClass =
    "text-sm font-medium text-slate-400 transition hover:text-white";

  const authLinks = (
    <>
      {user ? (
        <>
          <span className="max-w-32 truncate rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {user.username || user.email || "Account"}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-red-400/40 hover:text-red-300"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:scale-105"
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-3">
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
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <Link to="/" className="text-sm font-medium text-white transition hover:text-blue-400">Home</Link>
          <Link to="/features" className={navLinkClass}>Features</Link>
          <Link to="/how-it-works" className={navLinkClass}>How It Works</Link>
          <Link to="/about" className={navLinkClass}>About</Link>
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            AI Online
          </div>

          {authLinks}

          <a
            href="https://github.com/Alimansaricode"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
          >
            GitHub
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-red-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className={`${linkClass} text-white`}>Home</Link>
            <Link to="/features" onClick={() => setMenuOpen(false)} className={`${linkClass} text-slate-400 hover:text-white`}>Features</Link>
            <Link to="/how-it-works" onClick={() => setMenuOpen(false)} className={`${linkClass} text-slate-400 hover:text-white`}>How It Works</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className={`${linkClass} text-slate-400 hover:text-white`}>About</Link>

            {user && (
              <div className="mt-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                Logged in as {user.username || user.email || "Account"}
              </div>
            )}

            <div className="my-2 h-px bg-white/10" />

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                AI Online
              </div>
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
