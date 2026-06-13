// Story Panels Generator
import { getCategoryIcon, getCategoryLabel } from "./categoryDetector.js";

export function generateStoryPanels(title, extract, category) {
  const sentences = extract.split('.').filter(s => s.trim().length > 20);
  const icon = getCategoryIcon(category);

  return [
    {
      id: 1,
      type: 'title',
      panelClass: 'panel-intro',
      character: '🤖',
      title: `Welcome to ${title}`,
      text: `Ready to explore one of the most fascinating topics in ${getCategoryLabel(category)}? Let's begin your visual journey.`,
      style: 'speech-bubble narrator'
    },
    {
      id: 2,
      type: 'definition',
      panelClass: 'panel-what',
      character: icon,
      title: `What is ${title}?`,
      text: sentences[0]?.trim() + '.' || `${title} is a remarkable subject with deep roots in human knowledge.`,
      style: 'fact-card'
    },
    {
      id: 3,
      type: 'importance',
      panelClass: 'panel-why',
      character: '💡',
      title: 'Why does it matter?',
      text: (sentences[1]?.trim() ? sentences[1].trim() + '.' : `Understanding ${title} helps us make sense of the world in profound ways.`),
      style: 'speech-bubble left'
    },
    {
      id: 4,
      type: 'detail',
      panelClass: 'panel-how',
      character: '🔬',
      title: 'Here\'s a fascinating detail:',
      text: (sentences[2]?.trim() ? sentences[2].trim() + '.' : `Scientists and researchers have discovered remarkable properties of ${title}.`),
      style: 'highlight-card'
    },
    {
      id: 5,
      type: 'example',
      panelClass: 'panel-example',
      character: '🌍',
      title: 'Real-world example:',
      text: (sentences[3]?.trim() ? sentences[3].trim() + '.' : `You can see ${title} in action in everyday life and across many fields.`),
      style: 'example-card'
    },
    {
      id: 6,
      type: 'callToAction',
      panelClass: 'panel-next',
      character: '🚀',
      title: 'What to explore next:',
      text: `Dive into the Learn Mode for structured knowledge, try the Diagram to see it visually, and challenge yourself with the Quiz!`,
      style: 'cta-card',
      hasNavButtons: true
    }
  ];
}
