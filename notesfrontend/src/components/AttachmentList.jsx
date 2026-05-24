import { Download, FileText, ImageIcon, Paperclip, X } from "lucide-react";
import { formatFileSize } from "../utils/noteHelpers";

const isImage = (type = "") => type.startsWith("image/");
const getAttachmentUrl = (attachment) => attachment.url || attachment.dataUrl || "#";

function AttachmentList({ attachments, removable = false, onRemove }) {
  if (!attachments.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment, index) => (
        <div
          key={`${attachment.name}-${index}`}
          className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-full bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
                {isImage(attachment.type) ? (
                  <ImageIcon className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {attachment.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {formatFileSize(attachment.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getAttachmentUrl(attachment)}
                download={attachment.name}
                className="rounded-full border border-[var(--border)] p-2 text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Download className="h-4 w-4" />
              </a>
              {removable ? (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="rounded-full border border-[var(--border)] p-2 text-[var(--text-secondary)] transition hover:border-rose-400 hover:text-rose-400"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          {isImage(attachment.type) ? (
            <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
              <img
                src={getAttachmentUrl(attachment)}
                alt={attachment.name}
                className="mx-auto max-h-80 w-auto max-w-full rounded-xl object-contain"
              />
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--text-secondary)]">
              <Paperclip className="h-4 w-4" />
              File stored with this note
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AttachmentList;
