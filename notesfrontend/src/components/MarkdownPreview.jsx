import { renderMarkdown } from "../utils/markdown";

function MarkdownPreview({ content }) {
  return (
    <div
      className="markdown-body min-h-48 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}

export default MarkdownPreview;
