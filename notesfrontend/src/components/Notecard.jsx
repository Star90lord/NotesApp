import { useContext, useState } from "react";
import {
  CalendarDays,
  FolderKanban,
  PencilLine,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { Notecontext } from "../context/noteContext";
import AttachmentList from "./AttachmentList";
import MarkdownPreview from "./MarkdownPreview";
import NoteEditor from "./NoteEditor";
import { getColorClasses, noteToDraft } from "../utils/noteHelpers";

function Notecard({ note }) {
  const { deleteNote, updateNote } = useContext(Notecontext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleUpdate = async (payload) => {
    setCardError("");
    setIsSaving(true);

    try {
      await updateNote(note._id, payload);
      setIsEditing(false);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update note.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setCardError("");
    setIsDeleting(true);

    try {
      await deleteNote(note._id);
    } catch (error) {
      setCardError(error.response?.data?.message || "Failed to delete note.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFavorite = async () => {
    setCardError("");

    try {
      await updateNote(note._id, { isFavorite: !note.isFavorite });
    } catch (error) {
      setCardError(
        error.response?.data?.message || "Failed to update favorite status.",
      );
    }
  };

  return (
    <>
      <article
        className={`glass-panel relative overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-5 ${getColorClasses(
          note.color,
        )}`}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-current opacity-70" />

        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                {note.color}
              </span>
              {note.isFavorite ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-950">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                  Starred
                </span>
              ) : null}
            </div>

            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {note.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={toggleFavorite}
            className={`rounded-full border p-2 transition ${
              note.isFavorite
                ? "border-amber-300 bg-amber-400 text-slate-950"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-amber-300 hover:text-amber-400"
            }`}
          >
            <Star className="h-4 w-4" fill={note.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="max-h-64 overflow-hidden rounded-[1.25rem]">
          <MarkdownPreview content={note.content} />
        </div>

        {note.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {note.attachments?.length ? (
          <div className="mt-4">
            <AttachmentList attachments={note.attachments} />
          </div>
        ) : null}

        {cardError ? (
          <p className="mt-4 text-sm text-rose-400">{cardError}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {new Date(note.updatedAt || note.createdAt).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}
            </span>
            <span className="inline-flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              {note.attachments?.length || 0} files
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <span className="inline-flex items-center gap-2">
                <PencilLine className="h-4 w-4" />
                Edit
              </span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-rose-500 px-4 py-2 font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </span>
            </button>
          </div>
        </div>
      </article>

      {isEditing ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-5xl rounded-[2rem] p-5 sm:p-8">
            <NoteEditor
              initialValue={noteToDraft(note)}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              submitLabel="Save changes"
              busyLabel="Saving changes..."
              isSaving={isSaving}
              heading="Edit note"
              description="Update the content, tags, color, favorite status, or attachments for this note."
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Notecard;
