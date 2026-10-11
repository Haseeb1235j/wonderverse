import { sourceSentences } from "../utils/sourceText.js";

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
  "would",
  "could",
  "should",
  "after",
  "before",
]);
function shuffle(options) {
  const result = [...options];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// These are source-recall questions, not independently verified knowledge tests.
export function generateQuiz(title, extract = "") {
  const sentences = sourceSentences(extract);
  const terms = [
    ...new Map(
      (extract.match(/\b[A-Za-z][A-Za-z-]{4,}\b/g) || [])
        .filter((term) => !ignored.has(term.toLowerCase()))
        .map((term) => [term.toLowerCase(), term]),
    ).values(),
  ];
  if (terms.length < 5) return [];
  return terms.slice(0, 5).map((term) => {
    const sentence = sentences.find((value) =>
      new RegExp(`\\b${term}\\b`).test(value),
    );
    const masked = sentence.replace(new RegExp(`\\b${term}\\b`), "_____");
    const alternatives = terms
      .filter((value) => value.toLowerCase() !== term.toLowerCase())
      .slice(0, 3);
    const options = shuffle([term, ...alternatives]);
    return {
      type: "source-recall",
      question: `Which word completes this source excerpt? “${masked}”`,
      options,
      correctIndex: options.indexOf(term),
      explanation: `The source says: “${sentence}”`,
      sourceExcerpt: sentence,
    };
  });
}

export function scoreQuiz(questions, userAnswers) {
  const results = questions.map((question, index) => ({
    question: question.question,
    userAnswer: question.options[userAnswers[index]],
    correctAnswer: question.options[question.correctIndex],
    isCorrect: userAnswers[index] === question.correctIndex,
    explanation: question.explanation,
  }));
  const score = results.filter((result) => result.isCorrect).length;
  return {
    score,
    total: questions.length,
    percentage: questions.length
      ? Math.round((score / questions.length) * 100)
      : 0,
    results,
  };
}
