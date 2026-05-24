const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatInlineMarkdown = (value) =>
  value
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );

export const renderMarkdown = (markdown = "") => {
  const safeMarkdown = escapeHtml(markdown.trim());

  if (!safeMarkdown) {
    return "<p>Add markdown content to preview your note.</p>";
  }

  const lines = safeMarkdown.split("\n");
  const html = [];
  let isListOpen = false;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      if (isListOpen) {
        html.push("</ul>");
        isListOpen = false;
      }

      return;
    }

    if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      if (!isListOpen) {
        html.push("<ul>");
        isListOpen = true;
      }

      html.push(`<li>${formatInlineMarkdown(trimmedLine.slice(2))}</li>`);
      return;
    }

    if (isListOpen) {
      html.push("</ul>");
      isListOpen = false;
    }

    if (trimmedLine.startsWith("### ")) {
      html.push(`<h3>${formatInlineMarkdown(trimmedLine.slice(4))}</h3>`);
      return;
    }

    if (trimmedLine.startsWith("## ")) {
      html.push(`<h2>${formatInlineMarkdown(trimmedLine.slice(3))}</h2>`);
      return;
    }

    if (trimmedLine.startsWith("# ")) {
      html.push(`<h1>${formatInlineMarkdown(trimmedLine.slice(2))}</h1>`);
      return;
    }

    if (trimmedLine.startsWith("> ")) {
      html.push(
        `<blockquote>${formatInlineMarkdown(trimmedLine.slice(2))}</blockquote>`,
      );
      return;
    }

    html.push(`<p>${formatInlineMarkdown(trimmedLine)}</p>`);
  });

  if (isListOpen) {
    html.push("</ul>");
  }

  return html.join("");
};
