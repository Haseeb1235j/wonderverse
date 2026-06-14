// Learn Content Generator
import { helpers } from "../utils/helpers.js";

export function generateLearnContent(title, extract, category) {
  const sentences = extract.split('. ').filter(s => s.trim().length > 10);
  const paragraphs = [];
  let currentPara = [];
  
  sentences.forEach(s => {
    currentPara.push(s);
    if (currentPara.length >= 3) { 
      paragraphs.push(currentPara.join('. ')); 
      currentPara = []; 
    }
  });
  if (currentPara.length) paragraphs.push(currentPara.join('. '));

  // Extract key terms: words with 6+ chars appearing 2+ times
  const stopWords = new Set(['the','and','for','with','this','that','from','they','have','been','more','also','other','some','such','when','than','into','over','after']);
  const termFreq = {};
  
  extract.toLowerCase().match(/\b[a-z]{6,}\b/g)?.forEach(w => {
    if (!stopWords.has(w)) termFreq[w] = (termFreq[w]||0)+1;
  });
  
  const keyTerms = Object.entries(termFreq)
    .filter(([,count]) => count >= 2)
    .sort((a,b) => b[1]-a[1])
    .slice(0,8)
    .map(([term]) => ({ 
      term: helpers.capitalize(term), 
      definition: `Key concept related to the study of ${title}.` 
    }));

  // ELI5 (Explain Like I'm 10)
  const eli5Sentence = sentences[0] || `${title} is a fascinating subject with unique features.`;
  const eli5 = `Imagine explaining ${title} to a 10-year-old: "${simplify(eli5Sentence, title)}"`;

  return {
    overview: paragraphs[0] || extract || `${title} is a topic from the field of ${category}.`,
    whyItMatters: paragraphs[1] || `${title} is important because it connects many vital ideas in ${category} and influences our understanding of natural and human processes.`,
    howItWorks: paragraphs[2] || `The principles behind ${title} involve specific behaviors, conditions, and relationships that researchers study in detail.`,
    keyFacts: generateKeyFacts(title, extract, sentences),
    keyTerms: keyTerms.length ? keyTerms : generateFallbackTerms(title, category),
    realExamples: generateRealExamples(title, extract, category),
    quickSummary: sentences.slice(0, 2).join('. '),
    eli5,
    sourceName: 'Wikipedia (en)',
    isFromSummary: sentences.length < 5
  };
}

function generateKeyFacts(title, extract, sentences) {
  const facts = [];
  // Look for numeric data in sentences
  sentences.forEach(s => {
    if (/\d/.test(s) && s.length > 20 && s.length < 150) facts.push(s.trim());
  });
  // Fill with general facts if needed
  while (facts.length < 4) {
    if (facts.length === 0) facts.push(`${title} represents a core area of study in its respective field.`);
    else if (facts.length === 1) facts.push(`Active research on ${title} continues to reveal new properties and relationships.`);
    else if (facts.length === 2) facts.push(`Understanding the mechanics of ${title} is crucial for theoretical and practical applications.`);
    else facts.push(`Experts classify and examine ${title} using advanced scientific and analytical frameworks.`);
  }
  return facts.slice(0, 5);
}

function simplify(sentence, title) {
  if (!sentence) return `${title} is a fascinating subject that we study.`;

  // 1. Clean parentheticals, brackets, and clause boundaries to simplify structure
  let simple = sentence
    .replace(/\([^)]*\)/g, "") // Remove parentheticals (like this)
    .replace(/\[[^\]]*\]/g, "") // Remove brackets [1]
    .replace(/—[^—]*—/g, "") // Remove em-dash clauses
    .replace(/—/g, ", ") // Replace single em-dash with comma
    .replace(/\s+/g, " ") // Normalize spacing
    .trim();

  // 2. Child-friendly dictionary mapping
  const dictionary = {
    'approximately': 'about',
    'predominantly': 'mostly',
    'subsequently': 'then',
    'consequently': 'so',
    'fundamentally': 'basically',
    'exhibiting': 'having',
    'gravitational': 'gravity',
    'acceleration': 'pull',
    'electromagnetic': 'light and wave',
    'interconnected': 'linked',
    'interconnectivity': 'connection',
    'muscular': 'strong',
    'circulatory': 'blood flow',
    'civilization': 'society',
    'agricultural': 'farming',
    'fundamental': 'basic',
    'properties': 'features',
    'utilizes': 'uses',
    'exhibit': 'show',
    'mechanism': 'way of working',
    'substantial': 'large',
    'significant': 'important',
    'phenomenon': 'event',
    'constitutes': 'makes up',
    'primarily': 'mainly',
    'velocity': 'speed',
    'trajectory': 'path',
    'exhibits': 'shows',
    'originated': 'started',
    'characteristics': 'features',
    'components': 'parts',
    'particles': 'tiny bits',
    'radiation': 'waves',
    'composed': 'made'
  };

  Object.entries(dictionary).forEach(([complex, easy]) => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    simple = simple.replace(regex, easy);
  });

  // 3. Shorten to a complete, short sentence (under 18 words)
  let words = simple.split(' ');
  if (words.length > 18) {
    const commaIndex = simple.indexOf(',');
    if (commaIndex > 15 && commaIndex < 90) {
      simple = simple.slice(0, commaIndex) + '.';
    } else {
      simple = words.slice(0, 16).join(' ') + '.';
    }
  }

  // Guarantee clean formatting and ends with a single period
  simple = simple.trim().replace(/\.+$/, '') + '.';
  return simple;
}

function generateFallbackTerms(title, category) {
  return [
    { term: title, definition: `The central theme representing a major subject in ${category}.` },
    { term: "Telemetry Node", definition: "A system component that measures and transmits variables." },
    { term: "Analysis Core", definition: "A primary repository of data used for verification." },
    { term: "Coordinate Branch", definition: "A path linking secondary facts to the primary topic." }
  ];
}

function generateRealExamples(title, extract, category) {
  const sentences = extract.split('. ').filter(s => s.trim().length > 10);
  // Pick the last sentence if suitable
  if (sentences.length > 3) {
    const last = sentences[sentences.length - 1];
    if (last.toLowerCase().includes('example') || last.toLowerCase().includes('such as') || last.length > 30) {
      return `We see this in real life where: ${last}`;
    }
  }
  
  // Custom fallback text based on category
  const fallbacks = {
    space: `An example of this is observing celestial bodies through telescopes or studying planetary trajectories in space missions.`,
    biology: `An example of this is how living organisms adapt to their environment, process food, or transmit genetic material down generations.`,
    history: `An example of this is seen in historic artifacts, archaeological discoveries, and ancient texts cataloging past events.`,
    technology: `An example of this is how computers route network data, encrypt password packets, or execute automation pipelines.`,
    earth: `An example of this is seeing geological formations, weather patterns, and ocean currents interact in our ecosystem.`,
    physics: `An example of this is calculating force distributions in suspension bridges, electromagnetic waves, or particles colliding in labs.`,
    economics: `An example of this is observing how local stores adjust pricing based on product supply, user demand, and tax rates.`,
    sports: `An example of this is how athletic training systems measure player speeds, goal distributions, and stamina metrics.`,
    culture: `An example of this is analyzing artistic expressions, language evolutions, and culinary customs within global communities.`
  };
  return fallbacks[category] || `An example of this is studying the natural interactions, patterns, and historical evidence of ${title} in the field.`;
}
