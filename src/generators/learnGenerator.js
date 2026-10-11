import { sourceSentences, SOURCE_GAP } from "../utils/sourceText.js";

export function generateLearnContent(title, extract = "") {
  const sentences = sourceSentences(extract);
  const overview = sentences.slice(0, 2).join(" ") || SOURCE_GAP;
  const whyItMatters = sentences.slice(2, 4).join(" ") || SOURCE_GAP;
  const howItWorks = sentences.slice(4).join(" ") || SOURCE_GAP;
  const realExamples =
    sentences.find((sentence) =>
      /\b(for example|such as|for instance)\b/i.test(sentence),
    ) || "No explicit example was found in the retrieved introduction.";
  const ignored = new Set([
    "which",
    "there",
    "their",
    "these",
    "those",
    "about",
    "other",
    "where",
    "between",
    "through",
    "because",
    "including",
    "called",
    "known",
    "often",
    "during",
  ]);
  const terms = [
    ...new Map(
      (extract.match(/\b[A-Za-z][A-Za-z-]{5,}\b/g) || [])
        .filter((word) => !ignored.has(word.toLowerCase()))
        .map((word) => [word.toLowerCase(), word]),
    ).values(),
  ].slice(0, 6);
  const first = (value) => sourceSentences(value)[0] || value;
  return {
    overview,
    whyItMatters,
    howItWorks,
    realExamples,
    eli10_overview: first(overview),
    eli10_whyItMatters: first(whyItMatters),
    eli10_howItWorks: first(howItWorks),
    eli10_realExamples: first(realExamples),
    eli5: first(overview),
    keyFacts: sentences.slice(0, 5),
    keyTerms: terms.map((term) => ({
      term,
      definition:
        sentences.find((sentence) => sentence.includes(term)) || SOURCE_GAP,
    })),
    quickSummary: overview,
    sourceName: "Wikipedia",
    isFromSummary: true,
  };
}
