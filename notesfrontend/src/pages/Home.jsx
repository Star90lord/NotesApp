import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Funnel, Search, Sparkles, Star } from "lucide-react";
import { Notecontext } from "../context/noteContext";
import Notecard from "../components/Notecard";
import { NOTE_COLORS } from "../utils/noteHelpers";

const sortNotes = (notes, sortBy) => {
  const notesCopy = [...notes];

  switch (sortBy) {
    case "oldest":
      return notesCopy.sort(
        (firstNote, secondNote) =>
          new Date(firstNote.createdAt) - new Date(secondNote.createdAt),
      );
    case "title-asc":
      return notesCopy.sort((firstNote, secondNote) =>
        firstNote.title.localeCompare(secondNote.title),
      );
    case "title-desc":
      return notesCopy.sort((firstNote, secondNote) =>
        secondNote.title.localeCompare(firstNote.title),
      );
    case "favorites":
      return notesCopy.sort(
        (firstNote, secondNote) =>
          Number(secondNote.isFavorite) - Number(firstNote.isFavorite),
      );
    default:
      return notesCopy.sort(
        (firstNote, secondNote) =>
          new Date(secondNote.updatedAt || secondNote.createdAt) -
          new Date(firstNote.updatedAt || firstNote.createdAt),
      );
  }
};

const Home = () => {
  const { notes, loading, error } = useContext(Notecontext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const availableTags = Array.from(
    new Set(notes.flatMap((note) => note.tags || [])),
  ).sort((firstTag, secondTag) => firstTag.localeCompare(secondTag));

  const filteredNotes = sortNotes(
    notes.filter((note) => {
      const searchableText = [
        note.title,
        note.content,
        ...(note.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
      const matchesColor =
        selectedColor === "all" ? true : note.color === selectedColor;
      const matchesTag =
        selectedTag === "all" ? true : note.tags?.includes(selectedTag);
      const matchesFavorite = favoritesOnly ? note.isFavorite : true;

      return matchesSearch && matchesColor && matchesTag && matchesFavorite;
    }),
    sortBy,
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-[var(--text-secondary)]">Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 rounded-[2rem] border border-rose-400/30 bg-rose-500/10 p-8 text-center">
        <h2 className="text-2xl font-semibold text-rose-300">
          Unable to load notes
        </h2>
        <p className="text-sm text-rose-200/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)]">
              <Sparkles className="h-4 w-4" />
              Internship-ready notes workspace
            </span>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
              Search, filter, color, star, and preview your notes from one responsive dashboard.
            </h1>
            <p className="max-w-2xl text-[var(--text-secondary)]">
              This notes app now supports markdown, attachments, tags, favorite notes, color-coded cards, and filtering tools that work across laptop, tablet, and mobile layouts.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <p className="text-sm text-[var(--text-muted)]">Total notes</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
                {notes.length}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <p className="text-sm text-[var(--text-muted)]">Starred notes</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
                {notes.filter((note) => note.isFavorite).length}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <p className="text-sm text-[var(--text-muted)]">Unique tags</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
                {availableTags.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
          <label className="input-shell flex items-center gap-3 rounded-[1.25rem] px-4 py-3">
            <Search className="h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="search"
              placeholder="Search title, markdown content, or tags"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </label>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="input-shell rounded-[1.25rem] px-4 py-3 outline-none"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="title-asc">Sort: Title A-Z</option>
            <option value="title-desc">Sort: Title Z-A</option>
            <option value="favorites">Sort: Favorites first</option>
          </select>

          <select
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
            className="input-shell rounded-[1.25rem] px-4 py-3 outline-none"
          >
            <option value="all">All colors</option>
            {NOTE_COLORS.map((colorOption) => (
              <option key={colorOption.value} value={colorOption.value}>
                {colorOption.label}
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(event) => setSelectedTag(event.target.value)}
            className="input-shell rounded-[1.25rem] px-4 py-3 outline-none"
          >
            <option value="all">All tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFavoritesOnly((currentValue) => !currentValue)}
            className={`rounded-[1.25rem] px-4 py-3 font-medium transition ${
              favoritesOnly
                ? "bg-amber-400 text-slate-950"
                : "input-shell text-[var(--text-primary)]"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Star className="h-4 w-4" />
              Starred only
            </span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2">
            <Funnel className="h-4 w-4" />
            Showing {filteredNotes.length} of {notes.length} notes
          </span>
          <Link
            to="/create"
            className="rounded-full bg-[var(--accent)] px-4 py-2 font-semibold text-slate-950 transition hover:opacity-90"
          >
            Create a new note
          </Link>
        </div>
      </section>

      {!notes.length ? (
        <div className="glass-panel mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-5 rounded-[2rem] p-10 text-center">
          <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
            No notes yet
          </h2>
          <p className="max-w-md text-[var(--text-secondary)]">
            Start by creating a markdown note with tags, colors, and attachments.
          </p>
          <Link
            to="/create"
            className="rounded-full bg-[var(--accent)] px-5 py-3 font-semibold text-slate-950 transition hover:opacity-90"
          >
            Create your first note
          </Link>
        </div>
      ) : filteredNotes.length ? (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <Notecard key={note._id} note={note} />
          ))}
        </div>
      ) : (
        <div className="glass-panel flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-[2rem] p-8 text-center">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            No notes match these filters
          </h2>
          <p className="max-w-lg text-[var(--text-secondary)]">
            Try another search term, tag, color, sort order, or turn off starred-only mode.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
