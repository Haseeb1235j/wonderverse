import { sourceSentences } from "../utils/sourceText.js";

// A guided reading of the article, without adding unsupported narrative claims.
export function generateStoryPanels(title, extract = "") {
  const sentences = sourceSentences(extract);
  const panels = sentences.slice(0, 6).map((text, index) => ({
    id: index + 1,
    type: "excerpt",
    panelClass: "panel-source",
    character: "",
    title:
      index === 0 ? `Introducing ${title}` : `From the article · ${index + 1}`,
    text,
    style: "fact-card",
  }));
  if (!panels.length)
    panels.push({
      id: 1,
      type: "empty",
      character: "",
      title: "Not enough source material",
      text: "Open the original article for more information.",
      style: "fact-card",
    });
  panels.push({
    id: panels.length + 1,
    type: "callToAction",
    character: "",
    title: "Keep exploring",
    text: "Read more context, explore the article map, or check your recall of the source.",
    style: "cta-card",
    hasNavButtons: true,
  });
  return panels;
}
