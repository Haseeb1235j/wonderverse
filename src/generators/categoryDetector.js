// Category Detector — Topic to category classification
import { helpers } from "../utils/helpers.js";

export const CATEGORIES = {
  SPACE:      'space',
  BIOLOGY:    'biology',
  HISTORY:    'history',
  TECHNOLOGY: 'technology',
  EARTH:      'earth',
  PHYSICS:    'physics',
  CHEMISTRY:  'chemistry',
  ECONOMICS:  'economics',
  CULTURE:    'culture',
  GEOGRAPHY:  'geography',
  SPORTS:     'sports',
  UNIVERSAL:  'universal'  // default fallback
};

const CATEGORY_KEYWORDS = {
  [CATEGORIES.SPACE]: [
    'planet','star','moon','galaxy','black hole','nebula','asteroid','comet',
    'solar','orbit','cosmos','universe','telescope','nasa','shuttle','meteor',
    'eclipse','gravity','spacecraft','satellite','mars','jupiter','saturn',
    'pluto','milky way','astronomy','exoplanet','supernova','quasar','pulsar',
    'dark matter','dark energy','big bang','space station','astronaut'
  ],
  [CATEGORIES.BIOLOGY]: [
    'cell','dna','rna','protein','gene','chromosome','evolution','organism',
    'bacteria','virus','photosynthesis','mitosis','anatomy','organ','tissue',
    'heart','brain','lung','liver','blood','immune','nervous system','muscle',
    'skeleton','species','ecosystem','ecology','natural selection','genome',
    'enzyme','neuron','synapse','hormone','metabolism','respiration','digestion'
  ],
  [CATEGORIES.HISTORY]: [
    'ancient','medieval','empire','war','revolution','civilization','dynasty',
    'king','queen','pharaoh','roman','greek','egypt','mesopotamia','viking',
    'renaissance','industrial','world war','colonialism','independence',
    'constitution','republic','monarchy','century','bc','ad','historical',
    'battle','treaty','exploration','age of','reformation','enlightenment'
  ],
  [CATEGORIES.TECHNOLOGY]: [
    'computer','software','hardware','internet','algorithm','artificial intelligence',
    'machine learning','robot','programming','code','data','network','cloud',
    'blockchain','cryptocurrency','smartphone','processor','cpu','gpu','database',
    'operating system','cybersecurity','web','app','api','open source',
    'automation','digital','virtual','augmented reality','quantum computing'
  ],
  [CATEGORIES.EARTH]: [
    'volcano','earthquake','climate','weather','ocean','atmosphere','geology',
    'mountain','river','lake','forest','desert','tectonic','erosion','glacier',
    'water cycle','carbon cycle','biodiversity','coral reef','ozone','soil',
    'mineral','fossil','sediment','erosion','hurricane','tornado','drought',
    'flood','renewable','solar energy','wind energy','geothermal'
  ],
  [CATEGORIES.PHYSICS]: [
    'quantum','particle','electron','proton','neutron','atom','molecule',
    'energy','force','motion','velocity','acceleration','relativity','wave',
    'light','electromagnetism','thermodynamics','entropy','nuclear','radiation',
    'laser','superconductor','magnetic','electric','frequency','wavelength'
  ],
  [CATEGORIES.CHEMISTRY]: [
    'element','compound','reaction','acid','base','molecule','polymer','catalyst',
    'oxidation','reduction','periodic table','bond','solvent','solution',
    'concentration','pH','organic','inorganic','biochemistry','alloy','metal'
  ],
  [CATEGORIES.ECONOMICS]: [
    'money','currency','market','trade','inflation','gdp','economy','finance',
    'investment','stock','bank','loan','tax','budget','supply','demand',
    'capitalism','socialism','entrepreneurship','startup','business','profit',
    'revenue','cost','wage','unemployment','productivity','globalization'
  ],
  [CATEGORIES.CULTURE]: [
    'art','music','literature','film','dance','theater','poetry','painting',
    'sculpture','architecture','religion','philosophy','mythology','language',
    'culture','tradition','festival','cuisine','fashion','media','book','novel'
  ],
  [CATEGORIES.GEOGRAPHY]: [
    'country','continent','city','capital','population','border','region',
    'map','latitude','longitude','timezone','flag','government','north','south',
    'east','west','arctic','tropical','mediterranean','pacific','atlantic'
  ],
  [CATEGORIES.SPORTS]: [
    'cricket','football','soccer','basketball','tennis','baseball','hockey',
    'olympic','athlete','tournament','championship','league','team','player',
    'coach','match','score','goal','run','wicket','court','stadium','marathon'
  ]
};

export function detectCategory(title = '', summary = '') {
  const text = (title + ' ' + summary).toLowerCase();
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = keywords.filter(kw => text.includes(kw)).length;
  }

  const best = Object.entries(scores).sort((a,b) => b[1]-a[1])[0];
  return best[1] > 0 ? best[0] : CATEGORIES.UNIVERSAL;
}

export function getDifficultyLevel(summary = '') {
  const wordCount = summary.split(' ').length;
  const avgWordLength = summary.split(' ').reduce((s,w) => s+w.length,0) / Math.max(wordCount,1);
  if (avgWordLength > 7 || wordCount > 200) return 'hard';
  if (avgWordLength > 5.5 || wordCount > 80) return 'medium';
  return 'easy';
}

export function getCategoryLabel(category) {
  const labels = {
    space:'Space & Cosmos', biology:'Biology & Life', history:'History',
    technology:'Technology', earth:'Earth & Nature', physics:'Physics',
    chemistry:'Chemistry', economics:'Economics & Business',
    culture:'Arts & Culture', geography:'Geography', sports:'Sports',
    universal:'General Knowledge'
  };
  return labels[category] || 'General Knowledge';
}

export function getCategoryIcon(category) {
  const icons = {
    space:'🌌', biology:'🧬', history:'🏛️', technology:'💻', earth:'🌍',
    physics:'⚡', chemistry:'🧪', economics:'💹', culture:'🎨',
    geography:'🗺️', sports:'🏆', universal:'🔮'
  };
  return icons[category] || '🔮';
}
