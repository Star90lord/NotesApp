import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { ThemeContext } from "../context/themeContext";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const location = useLocation();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="container mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="text-2xl tracking-wide text-[var(--text-primary)]">
            NoteKeeper
          </span>
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium sm:text-base">
            <Link
              to="/"
              className={`rounded-full px-4 py-2 transition ${
                location.pathname === "/"
                  ? "bg-[var(--accent)] text-slate-950"
                  : "text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              }`}
            >
              Home
            </Link>
            <Link
              to="/create"
              className={`rounded-full px-4 py-2 transition ${
                location.pathname === "/create"
                  ? "bg-[var(--accent)] text-slate-950"
                  : "text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              }`}
            >
              Create Note
            </Link>
          </div>

          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
