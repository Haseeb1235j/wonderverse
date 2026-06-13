// Text Parser — split sentences and extract keywords

const stopWords = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','must','shall',
  'can','need','dare','ought','used','of','to','in','for','on','with','as','at',
  'by','from','into','through','during','before','after','above','below','up','down',
  'out','off','over','under','again','further','then','once','and','or','but','if',
  'while','because','until','although','however','therefore','thus','so','yet','both',
  'either','neither','not','only','own','same','than','too','very','just','also',
  'this','that','these','those','it','its','which','who','whom','whose','what',
  'where','when','how','why','about','more','many','some','such','other'
]);

export const textParser = {
  // Split string into sentences of decent size
  splitSentences(text) {
    if (!text) return [];
    return text
      .split(/[.!?]+(?=\s|$)/)
      .map(s => s.trim())
      .filter(s => s.length > 15);
  },

  // Extract top keywords (non-stop words)
  extractKeywords(text, count = 5) {
    if (!text) return [];
    const words = text
      .toLowerCase()
      .match(/\b[a-z]{4,}\b/g) || [];
      
    const freq = {};
    words.forEach(w => {
      if (!stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(entry => entry[0]);
  }
};

export default textParser;
