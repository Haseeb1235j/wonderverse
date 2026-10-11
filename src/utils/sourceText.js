// Preserve source wording, including numbers, qualifications, and punctuation.
export function sourceSentences(text = "") {
  if (typeof text !== "string" || !text.trim()) return [];
  const parts =
    typeof Intl.Segmenter === "function"
      ? [
          ...new Intl.Segmenter("en", { granularity: "sentence" }).segment(
            text,
          ),
        ].map((part) => part.segment.trim())
      : text.trim().split(/(?<=[.!?])\s+(?=[A-Z0-9“"‘'])/u);
  const result = [];
  for (const part of parts.filter(Boolean)) {
    const previous = result.at(-1);
    if (
      previous &&
      /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|e\.g|i\.e)\.$/i.test(previous)
    )
      result[result.length - 1] += ` ${part}`;
    else result.push(part);
  }
  return result;
}

export const SOURCE_GAP =
  "The retrieved source does not provide this information.";

export function wikiArticleURL(title) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}
