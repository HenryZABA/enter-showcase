/** Canvas fillText(maxWidth) squeezes glyphs; truncate instead of distorting labels. */
export function fitGalleryLabel(text: string, maxWidth: number, measure: (value: string) => number): string {
  if (measure(text) <= maxWidth) return text;
  if (measure("…") > maxWidth) return "";
  const characters = Array.from(text);
  while (characters.length && measure(`${characters.join("")}…`) > maxWidth) characters.pop();
  return `${characters.join("")}…`;
}
