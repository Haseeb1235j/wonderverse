// WonderVerse Local Showcases Database
// Stores high-fidelity handcrafted storyboards for 8 core showcase topics.
// If searched, these are loaded immediately. If a custom topic is searched, we query the Wikipedia API dynamically.

export const showcaseTopics = [
  {
    id: "black-hole",
    title: "Journey Into a Black Hole",
    searchKey: "black hole",
    category: "Space",
    difficulty: "Hard",
    readTime: "8 mins",
    themeColor: "#00f3ff",
    glowColor: "rgba(0, 243, 255, 0.4)",
    coverGradient: "linear-gradient(135deg, #02000a 0%, #0d002c 50%, #00f3ff 100%)",
    summary: "Cross the Event Horizon and discover what lies beyond the universe's ultimate gravitational trap.",
    character: {
      name: "Nova",
      avatar: `<svg viewBox="0 0 100 100" class="char-avatar"><circle cx="50" cy="50" r="45" fill="#0d002c" stroke="#00f3ff" stroke-width="3"/><path d="M50 25 C30 25 30 65 50 80 C70 65 70 25 50 25 Z" fill="#00f3ff" opacity="0.3"/><circle cx="40" cy="45" r="4" fill="#00f3ff"/><circle cx="60" cy="45" r="4" fill="#00f3ff"/><path d="M42 60 Q50 68 58 60" stroke="#00f3ff" stroke-width="3" fill="none"/></svg>`,
      role: "Astro-Navigator"
    },
    panels: [
      {
        id: 1,
        bgGradient: "linear-gradient(to bottom, #02000a, #050018)",
        narrator: "In the silent depths of deep space, our crew approaches the most terrifying entity in the cosmos.",
        characters: [
          { name: "Nova", position: "left", dialogue: "There it is! The singularity's shadow. The gravity here is already twisting our telemetry!" }
        ],
        factBox: "A black hole is formed when a massive star collapses under its own gravity into an infinitely dense point."
      },
      {
        id: 2,
        bgGradient: "linear-gradient(to bottom, #050018, #0a0027)",
        narrator: "The ship sails past the Accretion Disk—a swirling, glowing whirlpool of superheated gas and stellar debris.",
        characters: [
          { name: "Nova", position: "right", dialogue: "Look at the glowing gas! It is spinning near the speed of light, friction heating it to millions of degrees!" }
        ],
        factBox: "Accretion disks shine brightly in X-rays, making otherwise invisible black holes detectable to our telescopes."
      },
      {
        id: 3,
        bgGradient: "linear-gradient(to bottom, #0a0027, #010006)",
        narrator: "We reach the point of no return: The Event Horizon. Beyond this boundary, the escape velocity exceeds the speed of light.",
        characters: [
          { name: "Nova", position: "left", dialogue: "Initiating temporal shielding! Once we cross this line, even light can't escape. Time is starting to warp..." }
        ],
        factBox: "Inside the event horizon, space and time swap roles. Your future is inevitably tied to reaching the central singularity."
      },
      {
        id: 4,
        bgGradient: "radial-gradient(circle, #00f3ff 0%, #090022 70%, #000 100%)",
        narrator: "Spaghettification begins. Tidal forces stretch the spacecraft like putty, pulling the front much harder than the rear.",
        characters: [
          { name: "Nova", position: "right", dialogue: "The gravitational pull on my feet is infinitely stronger than on my head! Hold on, we're stretching!" }
        ],
        factBox: "Spaghettification is the stretching of objects into long, thin shapes caused by extreme gravitational gradients."
      }
    ],
    learn: {
      introduction: "Black holes are regions of spacetime where gravity is so strong that nothing—not even particles or light—can escape. Einstein's theory of general relativity predicted that a sufficiently compact mass could deform spacetime to form one.",
      keyTerms: [
        { term: "Event Horizon", definition: "The boundary around a black hole past which no light or matter can escape." },
        { term: "Singularity", definition: "The central point of infinite density where all physics equations break down." },
        { term: "Accretion Disk", definition: "A swirling disk of matter spiraling into the gravitational well of the black hole." },
        { term: "Spaghettification", definition: "The stretching of objects by tidal forces near a strong gravitational field." }
      ],
      bulletPoints: [
        "**Formed by collapse**: Stellar-mass black holes form when a massive star exhausts its fuel and collapses.",
        "**Time dilation**: Time moves slower near a black hole compared to observers far away.",
        "**Supermassive giants**: Found at the centers of galaxies, these can be billions of times the mass of our sun."
      ],
      flashcards: [
        { front: "What is the point of no return called?", back: "The Event Horizon." },
        { front: "What happens to time near a black hole?", back: "It slows down dramatically (Gravitational Time Dilation)." },
        { front: "Can light escape from a black hole?", back: "No, once it crosses the Event Horizon, the escape velocity exceeds the speed of light." }
      ],
      realLifeExample: "Sagittarius A* is the supermassive black hole at the center of our Milky Way galaxy, holding a mass equal to about 4 million Suns.",
      summary: "Black holes represent the ultimate extreme of gravity, bending spacetime, dilating time, and swallowing matter, leaving behind only a gravitational footprint."
    },
    diagram: {
      diagramId: "black-hole",
      title: "Anatomy of a Black Hole",
      description: "Tap the glowing regions of this gravitational beast to analyze its layers.",
      parts: [
        { id: "singularity", name: "Singularity", label: "Center", x: 50, y: 50, desc: "A point of infinite density where gravity is infinite and laws of physics cease to function.", color: "#ff007f" },
        { id: "horizon", name: "Event Horizon", label: "Boundary", x: 50, y: 25, desc: "The threshold of escape. Once crossed, the gravity is too strong for light itself to fly outward.", color: "#00f3ff" },
        { id: "disk", name: "Accretion Disk", label: "Swirling Gas", x: 75, y: 50, desc: "Superheated dust and gas spinning at relativistic speeds, glowing with extreme electromagnetic radiation.", color: "#ffaa00" },
        { id: "rel-jet", name: "Relativistic Jet", label: "Plasma Jet", x: 50, y: 5, desc: "Beams of ionized matter blasted out along the rotation axis at nearly the speed of light.", color: "#8a2be2" }
      ]
    },
    quiz: [
      {
        question: "What is the boundary of a black hole where the escape velocity equals the speed of light?",
        options: ["The Orbit Ring", "The Event Horizon", "The Nebula Gate", "The Singularity Zone"],
        answer: 1,
        explanation: "The Event Horizon is the mathematically defined boundary past which nothing can escape because the escape velocity exceeds light speed."
      },
      {
        question: "What is the gravitational effect of stretching objects vertically and compressing them horizontally?",
        options: ["Laserization", "Spaghettification", "Atomic Splitting", "Time-Warping"],
        answer: 1,
        explanation: "Spaghettification is the scientific term for the extreme tidal stretching experienced by objects falling into a black hole."
      },
      {
        question: "What lies at the exact center of a black hole?",
        options: ["A glowing star", "A wormhole portal", "A Singularity", "A dark vacuum chamber"],
        answer: 2,
        explanation: "The Singularity is the zero-volume, infinitely dense point at the center of a black hole where general relativity breaks down."
      }
    ]
  },
  {
    id: "star-birth",
    title: "Birth of a Star",
    searchKey: "star",
    category: "Space",
    difficulty: "Medium",
    readTime: "6 mins",
    themeColor: "#ffaa00",
    glowColor: "rgba(255, 170, 0, 0.4)",
    coverGradient: "linear-gradient(135deg, #0d001a 0%, #3a0007 60%, #ffaa00 100%)",
    summary: "Travel inside a cold molecular cloud to watch gravity ignite the nuclear fire of a brand new star.",
    character: {
      name: "Solara",
      avatar: `<svg viewBox="0 0 100 100" class="char-avatar"><circle cx="50" cy="50" r="45" fill="#1f0003" stroke="#ffaa00" stroke-width="3"/><polygon points="50,15 57,35 78,35 61,48 68,68 50,55 32,68 39,48 22,35 43,35" fill="#ffaa00" opacity="0.4"/><circle cx="40" cy="45" r="4" fill="#ffaa00"/><circle cx="60" cy="45" r="4" fill="#ffaa00"/><path d="M40 60 Q50 68 60 60" stroke="#ffaa00" stroke-width="3" fill="none"/></svg>`,
      role: "Stellar Biologist"
    },
    panels: [
      {
        id: 1,
        bgGradient: "linear-gradient(to bottom, #07000d, #14001c)",
        narrator: "Our voyage lands us inside a Molecular Nebula—a cold, dense womb of hydrogen gas and cosmic dust.",
        characters: [
          { name: "Solara", position: "left", dialogue: "It is freezing here, just a few degrees above absolute zero. Perfect for gravity to start pulling these atoms together!" }
        ],
        factBox: "Stars can only form in cold gas clouds; warm gas has too much pressure and escapes gravitational collapse."
      },
      {
        id: 2,
        bgGradient: "radial-gradient(circle, #ff5500 0%, #200005 80%)",
        narrator: "The critical moment: Core temperature hits 15 million degrees Celsius. Hydrogen nuclei crash together, igniting fusion.",
        characters: [
          { name: "Solara", position: "left", dialogue: "Fusion ignition! Hydrogen is fusing into helium. A star is officially born, blasting away the remaining gas shroud!" }
        ],
        factBox: "Once nuclear fusion begins, hydrostatic equilibrium is reached—gravitational collapse is balanced by outward fusion pressure."
      }
    ],
    learn: {
      introduction: "Stellar nucleosynthesis begins inside massive stellar nurseries called nebulae. Over millions of years, gravity compresses gas pockets until pressures and temperatures are high enough to ignite hydrogen fusion.",
      keyTerms: [
        { term: "Nebula", definition: "A giant cloud of dust and gas in space, acting as a nursery for stars." },
        { term: "Nuclear Fusion", definition: "The process of joining light atomic nuclei to form heavier ones, releasing energy." }
      ],
      bulletPoints: [
        "**Triggering factors**: Nearby supernova shockwaves can compressed gas clouds, starting star birth.",
        "**Main Sequence**: The stable period of a star's life where it burns hydrogen into helium in its core."
      ],
      flashcards: [
        { front: "What elements make up most nebulae?", back: "Hydrogen and Helium." },
        { front: "What state keeps a star stable?", back: "Hydrostatic Equilibrium." }
      ],
      realLifeExample: "The Orion Nebula is a massive star-forming nursery located about 1,344 light-years away.",
      summary: "Star birth is a balancing act where gravity compresses gas until nuclear ignition strikes."
    },
    diagram: {
      diagramId: "solar-system",
      title: "Star Lifecycle and Ignition",
      description: "Click the nodes to track how a cloud of dust transforms into a glowing stellar engine.",
      parts: [
        { id: "nebula", name: "Stellar Nebula", label: "Gas Cloud", x: 20, y: 50, desc: "A cold cloud of interstellar gas (mostly hydrogen) that begins to clump under gravity.", color: "#8a2be2" },
        { id: "proto", name: "Protostar", label: "Compressing Core", x: 45, y: 50, desc: "A dense sphere of gas that glows from gravitational heat but has not ignited fusion yet.", color: "#ff5500" },
        { id: "mainseq", name: "Main Sequence", label: "Active Star", x: 75, y: 50, desc: "A stable star fusing hydrogen into helium, like our Sun.", color: "#ffaa00" }
      ]
    },
    quiz: [
      {
        question: "What process powers a star once it reaches the Main Sequence?",
        options: ["Chemical combustion", "Nuclear fission", "Nuclear fusion", "Radioactive decay"],
        answer: 2,
        explanation: "Nuclear fusion (fusing hydrogen atoms into helium) is the main energy-generating reaction in active stars."
      }
    ]
  },
  {
    id: "human-heart",
    title: "Inside the Human Heart",
    searchKey: "heart",
    category: "Biology",
    difficulty: "Medium",
    readTime: "7 mins",
    themeColor: "#ff0055",
    glowColor: "rgba(255, 0, 85, 0.4)",
    coverGradient: "linear-gradient(135deg, #050005 0%, #20000a 60%, #ff0055 100%)",
    summary: "Shrink down and ride a red blood cell through the chambers, valves, and electrical pulses of the human pump.",
    character: {
      name: "Dr. Pulse",
      avatar: `<svg viewBox="0 0 100 100" class="char-avatar"><circle cx="50" cy="50" r="45" fill="#100005" stroke="#ff0055" stroke-width="3"/><circle cx="40" cy="45" r="4" fill="#ff0055"/><circle cx="60" cy="45" r="4" fill="#ff0055"/><path d="M42 60 Q50 65 58 60" stroke="#ff0055" stroke-width="3" fill="none"/></svg>`,
      role: "Micro-Cardiologist"
    },
    panels: [
      {
        id: 1,
        bgGradient: "linear-gradient(to bottom, #0f0005, #1f000b)",
        narrator: "Shrunk to microscopic size, our sub-pod enters the Right Atrium alongside oxygen-poor blood.",
        characters: [
          { name: "Dr. Pulse", position: "left", dialogue: "Welcome to the entry deck! We've just returned from the body. Notice the blue hue of the blood—it needs oxygen, fast!" }
        ],
        factBox: "The heart pumps oxygen-depleted blood to the lungs and oxygen-rich blood to the rest of the body."
      },
      {
        id: 2,
        bgGradient: "linear-gradient(to bottom, #300012, #ff0055)",
        narrator: "We return from the lungs fully oxygenated, entering the Left Ventricle—the strongest chamber.",
        characters: [
          { name: "Dr. Pulse", position: "left", dialogue: "Look at the thickness of this muscle wall! It has to pump us through the massive Aorta to reach all the way to your brain and toes!" }
        ],
        factBox: "The left ventricle's wall is three times thicker than the right, because it must pump blood to the entire systemic circulation."
      }
    ],
    learn: {
      introduction: "The human heart is a muscular organ about the size of a fist. It acts as a double pump, operating a low-pressure circuit to the lungs (pulmonary) and a high-pressure circuit to the body (systemic).",
      keyTerms: [
        { term: "Atrium", definition: "An upper chamber of the heart that receives incoming blood." },
        { term: "Ventricle", definition: "A lower chamber of the heart that pumps blood out." }
      ],
      bulletPoints: [
        "**Four Chambers**: Right Atrium, Right Ventricle, Left Atrium, Left Ventricle.",
        "**One-way valves**: Four valves prevent backward leakage."
      ],
      flashcards: [
        { front: "Which chamber pumps blood to the lungs?", back: "The Right Ventricle." },
        { front: "Why is the left ventricle wall thicker?", back: "Because it pumps blood to the entire body." }
      ],
      realLifeExample: "Regular exercise increases heart volume, meaning it pumps more blood per beat.",
      summary: "The heart uses valves and muscular chambers to circulate oxygen throughout your body."
    },
    diagram: {
      diagramId: "human-heart",
      title: "Interactive Heart Chambers",
      description: "Touch the heart chambers and valves to explore blood flow routes.",
      parts: [
        { id: "rt-atrium", name: "Right Atrium", label: "Blue Entry", x: 35, y: 35, desc: "Receives deoxygenated blood returning from the upper and lower body.", color: "#0055ff" },
        { id: "rt-ventricle", name: "Right Ventricle", label: "Lung Pump", x: 40, y: 65, desc: "Pumps deoxygenated blood to the lungs to gather oxygen.", color: "#00aaff" },
        { id: "lt-atrium", name: "Left Atrium", label: "Red Entry", x: 65, y: 30, desc: "Receives freshly oxygenated blood returning from the lungs.", color: "#ff003c" },
        { id: "lt-ventricle", name: "Left Ventricle", label: "Body Pump", x: 60, y: 70, desc: "Thick muscle chamber that shoots oxygen-rich blood out to the entire body via the Aorta.", color: "#ff5500" }
      ]
    },
    quiz: [
      {
        question: "Which blood vessel carries oxygenated blood from the heart to the rest of the body?",
        options: ["Pulmonary Artery", "Aorta", "Vena Cava", "Coronary Vein"],
        answer: 1,
        explanation: "The Aorta is the largest artery that distributes oxygenated blood from the left ventricle to all bodily organs."
      }
    ]
  },
  {
    id: "ancient-egypt",
    title: "Rise of Ancient Egypt",
    searchKey: "ancient egypt",
    category: "History",
    difficulty: "Easy",
    readTime: "5 mins",
    themeColor: "#ffaa00",
    glowColor: "rgba(255, 170, 0, 0.4)",
    coverGradient: "linear-gradient(135deg, #0a0500 0%, #291200 60%, #ffc400 100%)",
    summary: "Walk along the banks of the Nile, decode stone hieroglyphs, and inspect the engineering of the Pyramids.",
    character: {
      name: "Cleo",
      avatar: `<svg viewBox="0 0 100 100" class="char-avatar"><circle cx="50" cy="50" r="45" fill="#1c0a00" stroke="#ffc400" stroke-width="3"/><circle cx="40" cy="45" r="4" fill="#ffc400"/><circle cx="60" cy="45" r="4" fill="#ffc400"/><path d="M42 58 Q50 63 58 58" stroke="#ffc400" stroke-width="3" fill="none"/></svg>`,
      role: "Historian Guide"
    },
    panels: [
      {
        id: 1,
        bgGradient: "linear-gradient(to bottom, #110500, #220d00)",
        narrator: "The Nile River floods annually, leaving behind rich black silt that feeds a massive civilization.",
        characters: [
          { name: "Cleo", position: "left", dialogue: "Without this river, Egypt would be a barren desert. We call this rich soil 'Kemet', and it fuels our society!" }
        ],
        factBox: "The Nile seasonal flooding made Egyptian agriculture extremely productive."
      }
    ],
    learn: {
      introduction: "Ancient Egypt was a civilization in Northeast Africa concentrated along the lower reaches of the Nile River.",
      keyTerms: [
        { term: "Pharaoh", definition: "The political and religious leader of Egypt, regarded as a living god." }
      ],
      bulletPoints: [
        "**The Nile's Gift**: Flooding occurred predictably every summer.",
        "**Social Pyramid**: Pharaoh at the top, scribes in middle, farmers at base."
      ],
      flashcards: [
        { front: "What river made Egyptian agriculture possible?", back: "The Nile River." }
      ],
      realLifeExample: "The pyramids were built by paid agricultural laborers who worked during the Nile's flooding season.",
      summary: "Ancient Egypt achieved longevity through river management and divine pharaoh rule."
    },
    diagram: {
      diagramId: "timeline",
      title: "Egyptian Social Hierarchy",
      description: "Examine the social structure of ancient Egypt from bottom to top.",
      parts: [
        { id: "pharaoh", name: "The Pharaoh", label: "Divine Ruler", x: 50, y: 15, desc: "Regarded as a god on Earth. Held absolute power.", color: "#ffc400" },
        { id: "scribes", name: "Scribes & Priests", label: "Administration", x: 50, y: 45, desc: "Managed temple properties and wrote records in hieroglyphics.", color: "#8a2be2" },
        { id: "farmers", name: "Farmers & Laborers", label: "Foundation", x: 50, y: 75, desc: "Farmed fields and provided manual labor for pyramids.", color: "#00f3ff" }
      ]
    },
    quiz: [
      {
        question: "Which yearly event allowed crops to grow in the arid Egyptian landscape?",
        options: ["Desert rainstorms", "The Nile River flooding", "Mediterranean tides", "Volcanic ash fall"],
        answer: 1,
        explanation: "The seasonal flooding of the Nile left behind nutrient-dense black silt, fertilizing farmland."
      }
    ]
  },
  {
    id: "how-ai-thinks",
    title: "How AI Thinks",
    searchKey: "artificial intelligence",
    category: "AI & Robots",
    difficulty: "Hard",
    readTime: "9 mins",
    themeColor: "#8a2be2",
    glowColor: "rgba(138, 43, 226, 0.4)",
    coverGradient: "linear-gradient(135deg, #02000c 0%, #110029 60%, #8a2be2 100%)",
    summary: "Deconstruct a Neural Network. Follow data inputs as they transform through nodes, weights, and layers into choices.",
    character: {
      name: "Byte",
      avatar: `<svg viewBox="0 0 100 100" class="char-avatar"><circle cx="50" cy="50" r="45" fill="#050010" stroke="#8a2be2" stroke-width="3"/><circle cx="42" cy="45" r="4" fill="#8a2be2"/><circle cx="58" cy="45" r="4" fill="#8a2be2"/><path d="M40 58 L60 58" stroke="#8a2be2" stroke-width="3" fill="none"/></svg>`,
      role: "AI Core Interface"
    },
    panels: [
      {
        id: 1,
        bgGradient: "linear-gradient(to bottom, #03000b, #09001f)",
        narrator: "A pixel array of a handwritten number enters the Input Layer. 784 pixels become 784 numerical inputs.",
        characters: [
          { name: "Byte", position: "left", dialogue: "Receiving pixel grid! Values range from 0 (white) to 1 (black). Let's feed them forward!" }
        ],
        factBox: "The input layer converts raw data (like image pixels) into mathematical matrices."
      }
    ],
    learn: {
      introduction: "Artificial Neural Networks are computing systems inspired by biological brains.",
      keyTerms: [
        { term: "Node / Neuron", definition: "A basic processing unit that calculates weighted sums." }
      ],
      bulletPoints: [
        "**Layered design**: Input layer, hidden layers (features), and output layer.",
        "**Deep Learning**: Neural networks with multiple hidden layers."
      ],
      flashcards: [
        { front: "What is the feedback loop for training called?", back: "Backpropagation." }
      ],
      realLifeExample: "Netflix recommendations use neural networks to predict movie preference scores.",
      summary: "AI thinks by feeding numbers through layers of mathematical filters."
    },
    diagram: {
      diagramId: "neural-net",
      title: "Neural Network Nodes",
      description: "Click layers of this neural net to watch data feed forward.",
      parts: [
        { id: "input-layer", name: "Input Layer", label: "Raw Data", x: 25, y: 50, desc: "Accepts incoming data and passes them along.", color: "#00f3ff" },
        { id: "hidden-layer", name: "Hidden Layers", label: "Pattern Finders", x: 50, y: 50, desc: "Process inputs by applying weights and activations.", color: "#8a2be2" },
        { id: "output-layer", name: "Output Layer", label: "Final Decision", x: 75, y: 50, desc: "Combines processed patterns into probability scores.", color: "#ff007f" }
      ]
    },
    quiz: [
      {
        question: "What mathematical values determine the strength of connection between two nodes in a neural net?",
        options: ["Indices", "Weights", "Frequencies", "Resistors"],
        answer: 1,
        explanation: "Weights are coefficients that multiply inputs, controlling connection strength."
      }
    ]
  },
  {
    id: "water-cycle",
    title: "The Water Cycle Adventure",
    searchKey: "water cycle",
    category: "Adventure Learning",
    difficulty: "Easy",
    readTime: "4 mins",
    themeColor: "#00aaff",
    glowColor: "rgba(0, 170, 255, 0.4)",
    coverGradient: "linear-gradient(135deg, #00111a 0%, #002e4d 60%, #00aaff 100%)",
    summary: "Climb aboard a microscopic water drop. Evaporate from oceans, freeze in clouds, and slide down glaciers.",
    character: {
      name: "Drip",
      avatar: `<svg viewBox="0 0 100 100" class="char-avatar"><circle cx="50" cy="50" r="45" fill="#001a2d" stroke="#00aaff" stroke-width="3"/><circle cx="43" cy="55" r="3" fill="#00aaff"/><circle cx="57" cy="55" r="3" fill="#00aaff"/><path d="M44 68 Q50 72 56 68" stroke="#00aaff" stroke-width="2" fill="none"/></svg>`,
      role: "Water Envoy"
    },
    panels: [
      {
        id: 1,
        bgGradient: "linear-gradient(to bottom, #000d1a, #001f3f)",
        narrator: "Soaking up solar heat at the ocean surface, Drip's molecules vibrate until they break free.",
        characters: [
          { name: "Drip", position: "left", dialogue: "Whew! Getting warm! I'm converting from liquid to gas. Up we go, rising into the sky!" }
        ],
        factBox: "Evaporation turns liquid water into gas using heat energy, mostly from the sun."
      }
    ],
    learn: {
      introduction: "The water cycle describes the continuous movement of water on, above, and below the surface of the Earth.",
      keyTerms: [
        { term: "Evaporation", definition: "Liquid water changing into gas due to heat." }
      ],
      bulletPoints: [
        "**Solar powered**: The sun drives the entire cycle.",
        "**Purification**: Evaporation leaves salts and minerals behind."
      ],
      flashcards: [
        { front: "What turns vapor back to liquid?", back: "Condensation." }
      ],
      realLifeExample: "The rain falling today could contain water molecules that once quenched the thirst of a T-Rex.",
      summary: "Water continuously cycles through liquid, gas, and solid phases, powered by solar heat."
    },
    diagram: {
      diagramId: "water-cycle",
      title: "Interactive Water Loop",
      description: "Touch active cycle nodes to trace Drip's adventure.",
      parts: [
        { id: "evap", name: "Evaporation", label: "Solar Rise", x: 20, y: 70, desc: "Heat from the sun turns liquid surface water into airborne gas (water vapor).", color: "#ff8800" },
        { id: "cond", name: "Condensation", label: "Cloud Formation", x: 50, y: 30, desc: "Vapor cools in high altitude, turning back to micro liquid drops forming clouds.", color: "#88ccff" },
        { id: "precip", name: "Precipitation", label: "Rainfall", x: 80, y: 65, desc: "Droplets combine, becoming heavy enough to fall to Earth under gravity.", color: "#00aaff" }
      ]
    },
    quiz: [
      {
        question: "What is the primary energy source driving the water cycle?",
        options: ["Geothermal heat", "The Sun", "Wind currents", "Tidal friction"],
        answer: 1,
        explanation: "Solar radiation heats surface waters, causing evaporation."
      }
    ]
  },
  {
    id: "legend-of-lightning",
    title: "Legend of Lightning",
    searchKey: "lightning",
    category: "Science / Mythology",
    difficulty: "Easy",
    readTime: "5 mins",
    themeColor: "#ff007f",
    glowColor: "rgba(255, 0, 127, 0.4)",
    coverGradient: "linear-gradient(135deg, #0a0005 0%, #200010 60%, #ff007f 100%)",
    summary: "Contrast ancient legends of thunder gods (Zeus & Thor) with the modern science of electrostatic charges.",
    character: {
      name: "Volt",
      avatar: `<svg viewBox="0 0 100 100" class="char-avatar"><circle cx="50" cy="50" r="45" fill="#1c000e" stroke="#ff007f" stroke-width="3"/><circle cx="40" cy="45" r="4" fill="#ff007f"/><circle cx="60" cy="45" r="4" fill="#ff007f"/><path d="M42 60 Q50 65 58 60" stroke="#ff007f" stroke-width="3" fill="none"/></svg>`,
      role: "Thunder Archivist"
    },
    panels: [
      {
        id: 1,
        bgGradient: "linear-gradient(to bottom, #0d0007, #1c0010)",
        narrator: "Ancient Greeks trembled during storms, believing Zeus was hurling bolts of fire in anger.",
        characters: [
          { name: "Volt", position: "left", dialogue: "For centuries, thunder was the voice of angry gods. But the true story is about charge separation!" }
        ],
        factBox: "Lightning is a giant spark of static electricity generated by ice crystals rubbing together."
      }
    ],
    learn: {
      introduction: "Lightning is a sudden electrostatic discharge that occurs during an electrical storm.",
      keyTerms: [
        { term: "Electrostatic Discharge", definition: "The sudden flow of electricity between two charged objects." }
      ],
      bulletPoints: [
        "**Thor's hammer**: Norse legends claimed Mjöllnir created thunder.",
        "**Heat**: A lightning bolt can heat air to 30,000 Kelvin."
      ],
      flashcards: [
        { front: "What is thunder?", back: "The sound wave from rapidly expanding, superheated air." }
      ],
      realLifeExample: "Lightning rods channel high currents safely into the ground.",
      summary: "Lightning is simply nature balance-correcting separated electrical charges."
    },
    diagram: {
      diagramId: "volcano",
      title: "Electrostatic Cloud Discharge",
      description: "Tap the cloud zones to map how static charge builds lightning.",
      parts: [
        { id: "top-cloud", name: "Positive Top", label: "Ice Crystals", x: 50, y: 20, desc: "Lighter ice crystals gather positive charges as they float to the cloud summit.", color: "#ff88cc" },
        { id: "base-cloud", name: "Negative Base", label: "Heavy Pellets", x: 50, y: 45, desc: "Heavier ice grains slide down, collecting negative electrons along the cloud floor.", color: "#ff007f" },
        { id: "ground-charge", name: "Grounded Positive", label: "Upward Pull", x: 50, y: 80, desc: "Positive charges are pulled to tree tops and roofs, matching the cloud's charge above.", color: "#00f3ff" }
      ]
    },
    quiz: [
      {
        question: "What makes the sound of thunder?",
        options: ["Clouds bumping together", "Rapidly expanding superheated air", "Friction between ice sheets", "Electric winds"],
        answer: 1,
        explanation: "Lightning heats air to 30,000°C instantly, making the air expand rapidly and generate a shockwave."
      }
    ]
  },
  {
    id: "journey-inside-atom",
    title: "Journey Inside an Atom",
    searchKey: "atom",
    category: "Physics",
    difficulty: "Medium",
    readTime: "7 mins",
    themeColor: "#00f3ff",
    glowColor: "rgba(0, 243, 255, 0.4)",
    coverGradient: "linear-gradient(135deg, #000b1a 0%, #001f3f 50%, #00f3ff 100%)",
    summary: "Dive deep beneath the molecular layer to explore the planetary orbits of electrons and the packed nucleus core.",
    character: {
      name: "Proton-Pete",
      avatar: `<svg viewBox="0 0 100 100" class="char-avatar"><circle cx="50" cy="50" r="45" fill="#001a2d" stroke="#00f3ff" stroke-width="3"/><circle cx="40" cy="45" r="4" fill="#00f3ff"/><circle cx="60" cy="45" r="4" fill="#00f3ff"/><path d="M42 62 Q50 67 58 62" stroke="#00f3ff" stroke-width="3" fill="none"/></svg>`,
      role: "Atomic Sentinel"
    },
    panels: [
      {
        id: 1,
        bgGradient: "linear-gradient(to bottom, #000c1f, #00173d)",
        narrator: "Shrinking past the microscopic world, we find ourselves floating in a vast empty void. In the distance, shells of light orbit.",
        characters: [
          { name: "Proton-Pete", position: "left", dialogue: "Welcome to the scale of 10^-10 meters! Over 99.9% of an atom is empty space!" }
        ],
        factBox: "If the nucleus of an atom were the size of a marble, the electrons would be out in the nosebleed seats."
      }
    ],
    learn: {
      introduction: "An atom is the basic unit of a chemical element. It consists of a dense central nucleus surrounded by a cloud of negative electrons.",
      keyTerms: [
        { term: "Proton", definition: "A subatomic particle in the nucleus with a positive charge." },
        { term: "Strong Force", definition: "The force binding protons and neutrons together in the nucleus." }
      ],
      bulletPoints: [
        "**Mostly vacuum**: The dense nucleus is tiny compared to the volume of the orbits.",
        "**Atomic number**: Defined by the number of protons."
      ],
      flashcards: [
        { front: "What subatomic particle has a positive charge?", back: "The Proton." }
      ],
      realLifeExample: "Every breath you take contains nitrogen and oxygen atoms formed inside dying stars billions of years ago.",
      summary: "Atoms are mostly empty space, where negative electrons orbit a dense, positive nucleus."
    },
    diagram: {
      diagramId: "atom",
      title: "Atomic Architecture",
      description: "Touch subatomic components to identify their charge and function.",
      parts: [
        { id: "electron", name: "Electron", label: "Orbital Orbit", x: 30, y: 30, desc: "Tiny negative particles orbiting the nucleus in probability clouds or shells.", color: "#00f3ff" },
        { id: "proton", name: "Proton", label: "Positive Core", x: 50, y: 48, desc: "Positively charged particles in the nucleus.", color: "#ff007f" },
        { id: "neutron", name: "Neutron", label: "Neutral Glue", x: 53, y: 53, desc: "Neutral particles that buffer protons in the nucleus.", color: "#ffffff" }
      ]
    },
    quiz: [
      {
        question: "Which subatomic particle carries a negative electric charge?",
        options: ["Proton", "Neutron", "Electron", "Positron"],
        answer: 2,
        explanation: "Electrons are the small, negatively charged particles orbiting outside the nucleus."
      }
    ]
  }
];
export const trendingChips = [
  "Black Holes",
  "Human Heart",
  "Ancient Egypt",
  "Artificial Intelligence",
  "Dinosaurs",
  "Volcanoes",
  "Solar System",
  "Electricity",
  "Photosynthesis",
  "World War II"
];
export const diagramsData = [
  { id: "solar-system", title: "Solar System Orbit Diagram", topicId: "star-birth", desc: "Interactive map of active stellar orbits." },
  { id: "black-hole", title: "Black Hole Layers Diagram", topicId: "black-hole", desc: "Cross-section of a singularity well." },
  { id: "human-heart", title: "Human Heart Diagram", topicId: "human-heart", desc: "Double-pump blood circulation paths." },
  { id: "brain", title: "Brain Regions Diagram", topicId: "how-ai-thinks", desc: "Lobes and cognitive hubs of the neural brain." },
  { id: "atom", title: "Atom Structure Diagram", topicId: "journey-inside-atom", desc: "Quantized orbital shells and core clusters." },
  { id: "water-cycle", title: "Water Cycle Diagram", topicId: "water-cycle", desc: "Phase loops from ocean to cloud aggregates." },
  { id: "volcano", title: "Volcano Cross Section", topicId: "legend-of-lightning", desc: "Magma chambers and volcanic venting pipes." },
  { id: "food-chain", title: "Food Chain Diagram", topicId: "water-cycle", desc: "Energy flow links between trophic nodes." },
  { id: "timeline", title: "Timeline of Social Hierarchy", topicId: "ancient-egypt", desc: "Pharaoh social stratification nodes." },
  { id: "neural-net", title: "AI Neural Network Diagram", topicId: "how-ai-thinks", desc: "Interconnected nodes simulating feed forward calculations." }
];
