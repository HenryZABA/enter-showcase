/**
 * Replace anything that is not a safe filename character, collapse repeats and
 * trim separators, so a Chinese or punctuation-heavy case title still produces a
 * valid download name instead of a broken or empty one.
 */
export const sanitizeFilename = (value: string, fallback = "prompt"): string => {
  const cleaned = value
    .normalize("NFKD")
    // Anything that is not a letter, number, dot, underscore or hyphen becomes a
    // hyphen. This also neutralizes path separators and control characters,
    // while keeping CJK characters intact via \p{Letter}.
    .replace(/[^\p{Letter}\p{Number}._-]+/gu, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, 80);

  return cleaned.length > 0 ? cleaned : fallback;
};

/**
 * Trigger a download of `content` as UTF-8 text. Returns false when the content
 * is empty or the browser blocks the download, so callers can report honestly
 * instead of showing an unconditional success message.
 */
export const downloadTextFile = (fileName: string, content: string): boolean => {
  if (content.length === 0) return false;

  try {
    const mimeType = fileName.toLowerCase().endsWith(".md")
      ? "text/markdown;charset=utf-8"
      : "text/plain;charset=utf-8";
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
};

/** Copy text to the clipboard, reporting the real outcome. */
export const copyText = async (content: string): Promise<boolean> => {
  if (!content) return false;

  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
};
