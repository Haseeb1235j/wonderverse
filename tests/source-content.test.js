import test from "node:test";
import assert from "node:assert/strict";
import { sourceSentences, SOURCE_GAP } from "../src/utils/sourceText.js";
import { generateLearnContent } from "../src/generators/learnGenerator.js";
import { generateStoryPanels } from "../src/generators/storyGenerator.js";
import { generateDiagram } from "../src/generators/diagramGenerator.js";
import { generateQuiz, scoreQuiz } from "../src/generators/quizGenerator.js";
import { SourceNote } from "../src/components/SourceNote.js";

const extract =
  "Dr. Avery measured an acceleration of 9.81 m/s² in the experiment. The measurement is approximate and depends on location. For example, local conditions may affect the measured value. Further investigation is required before drawing a conclusion.";

test("sentence splitting preserves decimals, abbreviations, punctuation, and qualifications", () => {
  const sentences = sourceSentences(extract);
  assert.equal(sentences.length, 4);
  assert.equal(sentences.join(" "), extract);
  assert.match(sentences[0], /Dr\. Avery.*9\.81/);
});

test("empty source produces gaps, never generic facts, terms, or quiz answers", () => {
  const content = generateLearnContent("Unknown subject", "");
  assert.equal(content.overview, SOURCE_GAP);
  assert.equal(content.whyItMatters, SOURCE_GAP);
  assert.equal(content.howItWorks, SOURCE_GAP);
  assert.deepEqual(content.keyFacts, []);
  assert.deepEqual(content.keyTerms, []);
  assert.deepEqual(generateQuiz("Unknown subject", ""), []);
  assert.ok(
    !generateStoryPanels("Unknown subject", "").some((panel) =>
      panel.text.includes("undefined"),
    ),
  );
});

test("shorter reading uses complete source sentences without changing technical terms", () => {
  const content = generateLearnContent("Measurement", extract);
  assert.equal(content.eli10_overview, sourceSentences(extract)[0]);
  assert.match(content.eli10_overview, /acceleration of 9\.81/);
  for (const fact of content.keyFacts) assert.ok(extract.includes(fact));
  for (const term of content.keyTerms)
    assert.ok(extract.includes(term.definition));
  assert.equal(
    new Set(content.keyTerms.map((term) => term.term.toLowerCase())).size,
    content.keyTerms.length,
  );
});

test("story panels and diagrams use source excerpts instead of guessed scientific structures", () => {
  for (const panel of generateStoryPanels("Measurement", extract).filter(
    (panel) => panel.type === "excerpt",
  ))
    assert.ok(extract.includes(panel.text));
  const diagram = generateDiagram("earth", {
    title: "<script>alert(1)</script>",
    extract,
  });
  assert.match(diagram, /ARTICLE READING MAP/);
  assert.ok(!diagram.includes("Evaporation"));
  assert.ok(!diagram.includes("<script>"));
});

test("every correct quiz choice restores a real source excerpt, with matching evidence", () => {
  const questions = generateQuiz("Measurement", extract);
  assert.equal(questions.length, 5);
  for (const question of questions) {
    assert.ok(extract.includes(question.sourceExcerpt));
    assert.ok(question.question.includes("_____"));
    assert.ok(
      question.sourceExcerpt.includes(question.options[question.correctIndex]),
    );
    assert.ok(question.explanation.includes(question.sourceExcerpt));
    assert.equal(
      new Set(question.options.map((option) => option.toLowerCase())).size,
      question.options.length,
    );
  }
  assert.equal(
    scoreQuiz(
      questions,
      questions.map((question) => question.correctIndex),
    ).percentage,
    100,
  );
  assert.equal(scoreQuiz([], []).percentage, 0);
});

test("source note uses the revision belonging to the displayed lead, not the summary revision", () => {
  const html = SourceNote.render({
    summary: {
      title: "Measurement",
      revision: 11,
      timestamp: "2026-01-01T00:00:00Z",
    },
    leadExtract: extract,
    articleSource: { revision: 22, timestamp: "2026-02-01T00:00:00Z" },
    fetchedAt: Date.now(),
  });
  assert.match(html, /oldid=22/);
  assert.ok(!html.includes("oldid=11"));
  assert.match(html, /not been independently verified/);
  const missing = SourceNote.render({
    summary: { title: "Measurement", revision: 11 },
    leadExtract: extract,
    fetchedAt: Date.now(),
  });
  assert.ok(!missing.includes("oldid=11"));
  assert.match(missing, /Source edit date unavailable/);
});
