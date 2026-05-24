import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, FileUp, PencilLine, Star } from "lucide-react";
import AttachmentList from "./AttachmentList";
import MarkdownPreview from "./MarkdownPreview";
import { API_BASE_URL } from "../api/Url";
import {
  getEmptyNoteDraft,
  NOTE_COLORS,
  noteToDraft,
} from "../utils/noteHelpers";

function NoteEditor({
  initialValue,
  onSubmit,
  onCancel,
  submitLabel,
  busyLabel,
  isSaving,
  heading,
  description,
}) {
  const [draft, setDraft] = useState(getEmptyNoteDraft());
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [error, setError] = useState("");
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  useEffect(() => {
    const normalizedDraft = noteToDraft(initialValue);
    setDraft(normalizedDraft);
    setTagInput(normalizedDraft.tags.join(", "));
  }, [initialValue]);

  const handleAttachmentChange = async (event) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    try {
      setIsUploadingFiles(true);
      setError("");

      const selectedFiles = Array.from(files);
      const formData = new FormData();

      if (draft.attachments.length + selectedFiles.length > 10) {
        setError("You can attach up to 10 files to one note.");
        return;
      }

      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await axios.post(`${API_BASE_URL}/uploads`, formData);
      const newAttachments = response.data.attachments || [];
      const combinedAttachments = [...draft.attachments, ...newAttachments];

      setDraft((currentDraft) => ({
        ...currentDraft,
        attachments: combinedAttachments,
      }));
    } catch (attachmentError) {
      setError(
        attachmentError.response?.data?.message ||
          attachmentError.message ||
          "Failed to add attachments.",
      );
    } finally {
      setIsUploadingFiles(false);
      event.target.value = "";
    }
  };

  const removeAttachment = (indexToRemove) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      attachments: currentDraft.attachments.filter(
        (_attachment, index) => index !== indexToRemove,
      ),
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!draft.title.trim() || !draft.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    const payload = {
      ...draft,
      title: draft.title.trim(),
      content: draft.content.trim(),
      tags: tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      await onSubmit(payload);
    } catch (submitError) {
      setError(submitError.message || "Failed to save note.");
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      {heading ? (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
            {heading}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm text-[var(--text-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter note title"
            value={draft.title}
            onChange={(event) =>
              setDraft((currentDraft) => ({
                ...currentDraft,
                title: event.target.value,
              }))
            }
            className="input-shell w-full rounded-[1.5rem] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Tags separated by commas"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              className="input-shell w-full rounded-[1.25rem] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />

            <label className="input-shell flex items-center justify-between gap-4 rounded-[1.25rem] px-4 py-3">
              <span className="text-sm text-[var(--text-secondary)]">
                Star this note
              </span>
              <button
                type="button"
                onClick={() =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    isFavorite: !currentDraft.isFavorite,
                  }))
                }
                className={`rounded-full p-2 transition ${
                  draft.isFavorite
                    ? "bg-amber-400 text-slate-950"
                    : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                }`}
              >
                <Star
                  className="h-4 w-4"
                  fill={draft.isFavorite ? "currentColor" : "none"}
                />
              </button>
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Pick a note color
              </p>
              <span className="text-xs text-[var(--text-muted)]">
                Used for quick visual grouping
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {NOTE_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      color: colorOption.value,
                    }))
                  }
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                    draft.color === colorOption.value
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent-soft)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-full ${colorOption.accent}`}
                  />
                  {colorOption.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-3">
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === "write"
                    ? "bg-[var(--accent)] text-slate-950"
                    : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <PencilLine className="h-4 w-4" />
                  Write
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === "preview"
                    ? "bg-[var(--accent)] text-slate-950"
                    : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </span>
              </button>
            </div>

            {activeTab === "write" ? (
              <textarea
                rows="12"
                placeholder="Write your note with markdown support. Try # headings, **bold**, *italic*, - lists, and [links](https://example.com)."
                value={draft.content}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    content: event.target.value,
                  }))
                }
                className="input-shell app-scrollbar w-full rounded-[1.25rem] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            ) : (
              <MarkdownPreview content={draft.content} />
            )}
          </div>

          <div className="space-y-3 rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  Attach images or files
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  Up to 10 attachments, 25 MB each. Any image shape is supported.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                <FileUp className="h-4 w-4" />
                {isUploadingFiles ? "Uploading..." : "Add files"}
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleAttachmentChange}
                />
              </label>
            </div>

            <AttachmentList
              attachments={draft.attachments}
              removable
              onRemove={removeAttachment}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]">
              Live summary
            </p>
            <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
              {draft.title || "Untitled note"}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {(tagInput
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean) || []
              ).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span>Theme color: {draft.color}</span>
              <span>{draft.attachments.length} attachments</span>
            </div>
          </div>

          <MarkdownPreview content={draft.content} />
        </div>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving || isUploadingFiles}
          className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? busyLabel : isUploadingFiles ? "Uploading files..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[var(--border)] px-5 py-3 text-[var(--text-primary)] transition hover:border-[var(--accent)]"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default NoteEditor;
