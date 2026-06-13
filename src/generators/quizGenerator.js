// Quiz Generator — Summary to quiz questions
import { helpers } from "../utils/helpers.js";

export function generateQuiz(title, extract) {
  const sentences = extract.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 25);
  const questions = [];

  // Q1: Definition question (always generated)
  questions.push(randomizeOptions({
    type: 'multiple-choice',
    question: `What is ${title} primarily about?`,
    options: generateDefinitionOptions(title, extract, sentences),
    correctIndex: 0,
    explanation: sentences[0] ? `${sentences[0]}.` : `${title} is a significant topic in its domain.`
  }));

  // Q2: True/False from second sentence
  if (sentences[1]) {
    questions.push({
      type: 'true-false',
      question: `True or false: "${cleanSentence(sentences[1])}"`,
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: `This is directly stated in the information about ${title}.`
    });
  } else {
    questions.push({
      type: 'true-false',
      question: `True or false: "${title} has wide-ranging implications in its domain of study."`,
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: `${title} is widely recognized for its importance.`
    });
  }

  // Q3: Fill-in concept / association
  questions.push(randomizeOptions({
    type: 'multiple-choice',
    question: `Which of the following is most closely associated with ${title}?`,
    options: generateAssociationOptions(title, extract),
    correctIndex: 0,
    explanation: `This concept is central to understanding the mechanics of ${title}.`
  }));

  // Q4: Importance question
  questions.push(randomizeOptions({
    type: 'multiple-choice',
    question: `Why is ${title} considered important?`,
    options: generateImportanceOptions(title, extract, sentences),
    correctIndex: 0,
    explanation: sentences[2] ? `${sentences[2]}.` : `${title} has significant implications in its field.`
  }));

  // Q5: Best description
  const descSentence = sentences[Math.min(3, sentences.length - 1)] || sentences[sentences.length - 1] || `${title} is a multifaceted subject.`;
  questions.push(randomizeOptions({
    type: 'best-description',
    question: `Which statement best describes ${title}?`,
    options: [
      descSentence,
      `${title} is a simple concept with limited applications.`,
      `${title} was discovered only recently and has no legacy.`,
      `${title} has no practical real-world applications.`
    ],
    correctIndex: 0,
    explanation: `The description aligns directly with what is verified about ${title}.`
  }));

  return questions.slice(0, 5);
}

function cleanSentence(sentence) {
  // strip ending periods and make it a clean statement
  return sentence.replace(/[.]+$/, '').trim();
}

function generateDefinitionOptions(title, extract, sentences) {
  const correct = sentences[0] || `${title} is a key topic of interest.`;
  return [
    correct,
    `A mathematical theorem used primarily in cryptanalysis.`,
    `A geological process of rock stratification over centuries.`,
    `A biological cellular barrier found in prokaryotes.`
  ];
}

function generateAssociationOptions(title, extract) {
  // Extract a keyword from extract to make it semi-related
  const words = extract.toLowerCase().match(/\b[a-z]{6,}\b/g) || [];
  const relatedWord = words.find(w => !['system', 'process', 'energy', 'volume', 'matter', 'nature'].includes(w)) || 'scientific research';
  
  return [
    `Analyzing ${helpers.capitalize(relatedWord)} and surrounding system behaviors.`,
    `Industrial thermodynamics and steam turbine designs.`,
    `The linguistic evolution of ancient dialects.`,
    `Plate tectonics and volcanic faultline classifications.`
  ];
}

function generateImportanceOptions(title, extract, sentences) {
  const correct = sentences[1] || `${title} provides foundational knowledge in its field.`;
  return [
    correct,
    `It is the global standard for regulating marine commerce.`,
    `It is the direct catalyst for computer graphics rendering.`,
    `It allows scientists to synthesize synthetic heavy metals.`
  ];
}

// Shuffle options so correct answer isn't always first
function randomizeOptions(question) {
  const correct = question.options[question.correctIndex];
  const shuffled = [...question.options].sort(() => Math.random() - 0.5);
  return {
    ...question,
    options: shuffled,
    correctIndex: shuffled.indexOf(correct)
  };
}

export function scoreQuiz(questions, userAnswers) {
  const results = questions.map((q, i) => ({
    question: q.question,
    userAnswer: q.options[userAnswers[i]],
    correctAnswer: q.options[q.correctIndex],
    isCorrect: userAnswers[i] === q.correctIndex,
    explanation: q.explanation
  }));
  const score = results.filter(r => r.isCorrect).length;
  return { 
    score, 
    total: questions.length, 
    percentage: Math.round((score / questions.length) * 100), 
    results 
  };
}
