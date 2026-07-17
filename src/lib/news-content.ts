export type NewsContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; url: string };

const IMAGE_MARKER_RE = /\[image:([^\]]+)\]/g;

export function buildNewsImageMarker(url: string) {
  return `[image:${url}]`;
}

export function parseNewsContent(content: string): NewsContentBlock[] {
  const blocks: NewsContentBlock[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(IMAGE_MARKER_RE)) {
    const index = match.index ?? 0;
    const before = content.slice(lastIndex, index);

    if (before.trim()) {
      blocks.push({ type: "text", text: before.trim() });
    }

    const url = match[1]?.trim();
    if (url) {
      blocks.push({ type: "image", url });
    }

    lastIndex = index + match[0].length;
  }

  const after = content.slice(lastIndex);
  if (after.trim()) {
    blocks.push({ type: "text", text: after.trim() });
  }

  return blocks;
}

export function insertNewsImageMarker(
  content: string,
  imageUrl: string,
  selectionStart: number,
  selectionEnd: number,
) {
  const marker = `\n\n${buildNewsImageMarker(imageUrl)}\n\n`;
  return content.slice(0, selectionStart) + marker + content.slice(selectionEnd);
}
