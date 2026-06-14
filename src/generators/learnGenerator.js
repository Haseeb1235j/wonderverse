// Learn Content Generator
import { helpers } from "../utils/helpers.js";

export function generateLearnContent(title, extract, category) {
  // Split raw text by paragraphs (Wikipedia lead section usually has multiple paragraph splits)
  const rawParagraphs = extract.split(/\n+/).map(p => p.trim()).filter(p => p.length > 20);
  
  let overview = "";
  let whyItMatters = "";
  let howItWorks = "";
  
  if (rawParagraphs.length >= 3) {
    overview = rawParagraphs[0];
    whyItMatters = rawParagraphs[1];
    howItWorks = rawParagraphs[2];
  } else if (rawParagraphs.length === 2) {
    overview = rawParagraphs[0];
    whyItMatters = rawParagraphs[1];
    const p1Sentences = rawParagraphs[1].split('. ').filter(s => s.trim().length > 5);
    if (p1Sentences.length >= 2) {
      whyItMatters = p1Sentences.slice(0, Math.ceil(p1Sentences.length / 2)).join('. ') + '.';
      howItWorks = p1Sentences.slice(Math.ceil(p1Sentences.length / 2)).join('. ');
    } else {
      howItWorks = `The operational foundation of ${title} relies on key mechanisms within ${category}. Researchers analyze these parameters using scientific frameworks to define their behaviors, relationships, and systemic properties.`;
    }
  } else if (rawParagraphs.length === 1) {
    const sentences = rawParagraphs[0].split('. ').filter(s => s.trim().length > 5);
    if (sentences.length >= 6) {
      overview = sentences.slice(0, 2).join('. ') + '.';
      whyItMatters = sentences.slice(2, 4).join('. ') + '.';
      howItWorks = sentences.slice(4).join('. ');
    } else if (sentences.length >= 3) {
      overview = sentences[0] + '.';
      whyItMatters = sentences[1] + '.';
      howItWorks = sentences.slice(2).join('. ');
    } else {
      overview = rawParagraphs[0];
      whyItMatters = `${title} is a critical subject in ${category}. It connects complex academic principles and plays a significant role in modern research, forming the basis for practical and theoretical breakthroughs.`;
      howItWorks = `The mechanics of ${title} operate through specific structures and interactions. Detailed observation shows how various variables adjust in response to force, energy, or environmental changes within ${category}.`;
    }
  } else {
    overview = `${title} is a primary area of study within the domain of ${category}. It describes a set of principles and structures essential to understanding this field.`;
    whyItMatters = `${title} holds deep significance because it connects core concepts in ${category}. Studying this topic allows researchers and students to model real-world behaviors and predict outcome dynamics.`;
    howItWorks = `The underlying system of ${title} works by coordinating physical properties, structural constraints, and mathematical relationships as described in primary literature.`;
  }

  // Ensure clean trailing periods
  const cleanTrailingPeriods = (text) => {
    if (!text) return "";
    let cleaned = text.trim();
    while (cleaned.endsWith('.')) {
      cleaned = cleaned.slice(0, -1);
    }
    return cleaned + ".";
  };

  overview = cleanTrailingPeriods(overview);
  whyItMatters = cleanTrailingPeriods(whyItMatters);
  howItWorks = cleanTrailingPeriods(howItWorks);

  const realExamples = generateRealExamples(title, extract, category);

  // Child-friendly dictionary simplifications
  const firstOverviewSentence = overview.split('. ').filter(Boolean)[0] || "";
  const firstWhySentence = whyItMatters.split('. ').filter(Boolean)[0] || "";
  const firstHowSentence = howItWorks.split('. ').filter(Boolean)[0] || "";
  const firstExampleSentence = realExamples.replace(/We see this in real life where: /i, '').split('. ').filter(Boolean)[0] || "";

  const eli10_overview = simplify(firstOverviewSentence, title);
  const eli10_whyItMatters = simplify(firstWhySentence, title);
  const eli10_howItWorks = simplify(firstHowSentence, title);
  const eli10_realExamples = simplify(firstExampleSentence, title);

  const eli5 = `Imagine explaining ${title} to a 10-year-old: "${eli10_overview}"`;

  // Extract key terms
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

  const allSentences = extract.split('. ').filter(s => s.trim().length > 10);

  return {
    overview,
    whyItMatters,
    howItWorks,
    realExamples,
    eli10_overview,
    eli10_whyItMatters,
    eli10_howItWorks,
    eli10_realExamples,
    eli5,
    keyFacts: generateKeyFacts(title, extract, allSentences),
    keyTerms: keyTerms.length ? keyTerms : generateFallbackTerms(title, category),
    quickSummary: allSentences.slice(0, 2).join('. ') + '.',
    sourceName: 'Wikipedia (en)',
    isFromSummary: allSentences.length < 5
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
