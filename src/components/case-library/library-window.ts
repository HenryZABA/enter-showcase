export function libraryWindow(total: number, expanded: boolean, focused: boolean, page: number) {
  const preview = !expanded && !focused;
  const size = preview ? 9 : 24;
  const pages = Math.max(1, Math.ceil(total / size));
  const current = Math.max(1, Math.min(page, pages));
  return { start: (current - 1) * size, size, more: preview && total > 9, pages, current };
}
