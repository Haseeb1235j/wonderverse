import"./modulepreload-polyfill-Dezn_h7o.js";var e={PROGRESS:`wonderverse_progress`,FAVORITES:`wonderverse_favorites`,QUIZ_SCORES:`wonderverse_quiz_scores`,BADGES:`wonderverse_badges`,STREAK:`wonderverse_streak`,LEARNING_TIME:`wonderverse_learning_time`,HISTORY:`wonderverse_history`,THEME:`wonderverse_theme`},t={continueReading:null,completedChapters:[]},n={topics:[],diagrams:[]},r={currentStreak:0,lastReadDate:null};function i(e,t){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch(n){return console.error(`Error reading key ${e} from localStorage`,n),t}}function a(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(t){console.error(`Error writing key ${e} to localStorage`,t)}}var o={getTheme(){return localStorage.getItem(e.THEME)||`dark`},setTheme(t){localStorage.setItem(e.THEME,t)},getProgress(){return i(e.PROGRESS,t)},saveProgress(t,n){let r=this.getProgress();r.continueReading={topicId:t,mode:n,timestamp:Date.now()},a(e.PROGRESS,r),this.updateReadingStreak()},markChapterComplete(t){let n=this.getProgress();n.completedChapters.includes(t)||n.completedChapters.push(t),a(e.PROGRESS,n),this.checkAndUnlockBadges()},getFavorites(){return i(e.FAVORITES,n)},toggleFavorite(t,n){let r=this.getFavorites();r[n]||(r[n]=[]);let i=r[n],o=i.indexOf(t);return o>-1?i.splice(o,1):i.push(t),a(e.FAVORITES,r),this.checkAndUnlockBadges(),o===-1},isFavorite(e,t){return this.getFavorites()[t]?.includes(e)||!1},getQuizScores(){return i(e.QUIZ_SCORES,{})},saveQuizScore(t,n){let r=this.getQuizScores(),i=r[t]||0;r[t]=Math.max(i,n),a(e.QUIZ_SCORES,r),this.checkAndUnlockBadges()},getStreak(){return i(e.STREAK,r)},updateReadingStreak(){let t=this.getStreak(),n=new Date().toISOString().split(`T`)[0];if(t.lastReadDate!==n){if(!t.lastReadDate)t.currentStreak=1;else{let e=new Date(t.lastReadDate),r=new Date(n),i=Math.abs(r-e),a=Math.ceil(i/(1e3*60*60*24));a===1?t.currentStreak+=1:a>1&&(t.currentStreak=1)}t.lastReadDate=n,a(e.STREAK,t),this.checkAndUnlockBadges(),window.dispatchEvent(new CustomEvent(`streak-updated`,{detail:t}))}},getLearningTime(){return i(e.LEARNING_TIME,0)},incrementLearningTime(t){let n=this.getLearningTime();n+=t,a(e.LEARNING_TIME,n),this.checkAndUnlockBadges(),window.dispatchEvent(new CustomEvent(`learning-time-updated`,{detail:n}))},getBadges(){return i(e.BADGES,[])},checkAndUnlockBadges(){let t=this.getBadges(),n=this.getQuizScores(),r=this.getProgress(),i=this.getFavorites();this.getStreak(),this.getLearningTime();let o=[],s=e=>{t.includes(e)||(t.push(e),o.push(e))};(r.completedChapters.includes(`Black Hole`)||r.completedChapters.includes(`Moon`)||r.completedChapters.includes(`Quantum Physics`))&&s(`space-rookie`),(r.completedChapters.includes(`Human Heart`)||r.completedChapters.includes(`DNA`)||r.completedChapters.includes(`Photosynthesis`))&&s(`science-explorer`),r.completedChapters.includes(`Ancient Egypt`)&&s(`history-hunter`),i.diagrams?.length>=2&&s(`diagram-master`),Object.values(n).some(e=>e===5)&&s(`quiz-warrior`),r.completedChapters.length>=3&&s(`story-finisher`),(t.length>=6||i.topics?.length>=3)&&s(`knowledge-collector`),o.length>0&&(a(e.BADGES,t),window.dispatchEvent(new CustomEvent(`badge-unlocked`,{detail:{badges:o}})))},getRecentSearches(){return i(e.HISTORY,[])},addRecentSearch(t){let n=this.getRecentSearches(),r=n.findIndex(e=>e.title.toLowerCase()===t.title.toLowerCase());r>-1&&n.splice(r,1),n.unshift({title:t.title,query:t.query||t.title,category:t.category||`universal`,image:t.image||null,date:new Date().toLocaleDateString()}),n.length>10&&n.pop(),a(e.HISTORY,n),window.dispatchEvent(new CustomEvent(`history-updated`,{detail:n}))}},s=new class{constructor(){this.subscribers={},this.state={theme:o.getTheme(),recentSearches:o.getRecentSearches(),favorites:o.getFavorites(),progress:o.getProgress(),quizScores:o.getQuizScores(),badges:o.getBadges(),streak:o.getStreak(),learningTime:o.getLearningTime(),activeTopic:null},document.documentElement.setAttribute(`data-theme`,this.state.theme),window.addEventListener(`streak-updated`,e=>{this.setState({streak:e.detail})}),window.addEventListener(`learning-time-updated`,e=>{this.setState({learningTime:e.detail})}),window.addEventListener(`history-updated`,e=>{this.setState({recentSearches:e.detail})}),window.addEventListener(`badge-unlocked`,e=>{this.setState({badges:o.getBadges()})})}subscribe(e,t){return this.subscribers[e]||(this.subscribers[e]=[]),this.subscribers[e].push(t),()=>{this.subscribers[e]=this.subscribers[e].filter(e=>e!==t)}}publish(e,t){this.subscribers[e]&&this.subscribers[e].forEach(n=>{try{n(t)}catch(t){console.error(`Error executing subscriber for event ${e}`,t)}})}getState(){return this.state}setState(e){let t={...this.state};this.state={...this.state,...e},e.theme&&e.theme!==t.theme&&(o.setTheme(e.theme),document.documentElement.setAttribute(`data-theme`,e.theme),this.publish(`theme`,e.theme)),e.favorites&&this.publish(`favorites`,e.favorites),this.publish(`stateChange`,{old:t,current:this.state})}toggleTheme(){let e=this.state.theme===`dark`?`light`:`dark`;this.setState({theme:e})}},c={render(e=`Search any topic...`,t=`search-input`,n=``){return`
      <div class="search-wrapper">
        <input 
          type="text" 
          id="${t}" 
          class="search-input" 
          placeholder="${e}" 
          value="${n}" 
          autocomplete="off" 
          name="wonderverse-search-input"
        />
        <button id="${t}-btn" class="search-btn">Scan</button>
      </div>
    `},bindEvents(e,t){let n=document.getElementById(e),r=document.getElementById(`${e}-btn`),i=()=>{let e=n.value.trim();e&&t(e)};n?.addEventListener(`keypress`,e=>{e.key===`Enter`&&i()}),r?.addEventListener(`click`,()=>{i()})}},l={initScrollReveal(){let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add(`visible`)})},{threshold:.1,rootMargin:`0px 0px -40px 0px`});document.querySelectorAll(`.reveal`).forEach(t=>e.observe(t))},setupTilt(){document.addEventListener(`mousemove`,e=>{let t=e.target.closest(`.tilt-card`);if(!t)return;let n=t.getBoundingClientRect(),r=e.clientX-n.left,i=e.clientY-n.top,a=r/n.width*100,o=(50-i/n.height*100)*.25,s=(a-50)*.25;t.style.transform=`perspective(1000px) rotateX(${o}deg) rotateY(${s}deg) scale3d(1.02, 1.02, 1.02)`;let c=t.querySelector(`.mouse-glow`);c&&(c.style.left=`${r}px`,c.style.top=`${i}px`)}),document.addEventListener(`mouseout`,e=>{let t=e.target.closest(`.tilt-card`);t&&(t.style.transform=`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`)})}},u={capitalize(e){return e?e.charAt(0).toUpperCase()+e.slice(1):``},slugify(e){return e?e.toString().toLowerCase().trim().replace(/\s+/g,`-`).replace(/[^\w\-]+/g,``).replace(/\-\-+/g,`-`):``},debounce(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{clearTimeout(n),e(...r)},t)}}},d={SPACE:`space`,BIOLOGY:`biology`,HISTORY:`history`,TECHNOLOGY:`technology`,EARTH:`earth`,PHYSICS:`physics`,CHEMISTRY:`chemistry`,ECONOMICS:`economics`,CULTURE:`culture`,GEOGRAPHY:`geography`,SPORTS:`sports`,UNIVERSAL:`universal`},f={[d.SPACE]:`planet.star.moon.galaxy.black hole.nebula.asteroid.comet.solar.orbit.cosmos.universe.telescope.nasa.shuttle.meteor.eclipse.gravity.spacecraft.satellite.mars.jupiter.saturn.pluto.milky way.astronomy.exoplanet.supernova.quasar.pulsar.dark matter.dark energy.big bang.space station.astronaut`.split(`.`),[d.BIOLOGY]:`cell.dna.rna.protein.gene.chromosome.evolution.organism.bacteria.virus.photosynthesis.mitosis.anatomy.organ.tissue.heart.brain.lung.liver.blood.immune.nervous system.muscle.skeleton.species.ecosystem.ecology.natural selection.genome.enzyme.neuron.synapse.hormone.metabolism.respiration.digestion`.split(`.`),[d.HISTORY]:`ancient.medieval.empire.war.revolution.civilization.dynasty.king.queen.pharaoh.roman.greek.egypt.mesopotamia.viking.renaissance.industrial.world war.colonialism.independence.constitution.republic.monarchy.century.bc.ad.historical.battle.treaty.exploration.age of.reformation.enlightenment`.split(`.`),[d.TECHNOLOGY]:`computer.software.hardware.internet.algorithm.artificial intelligence.machine learning.robot.programming.code.data.network.cloud.blockchain.cryptocurrency.smartphone.processor.cpu.gpu.database.operating system.cybersecurity.web.app.api.open source.automation.digital.virtual.augmented reality.quantum computing`.split(`.`),[d.EARTH]:`volcano.earthquake.climate.weather.ocean.atmosphere.geology.mountain.river.lake.forest.desert.tectonic.erosion.glacier.water cycle.carbon cycle.biodiversity.coral reef.ozone.soil.mineral.fossil.sediment.erosion.hurricane.tornado.drought.flood.renewable.solar energy.wind energy.geothermal`.split(`.`),[d.PHYSICS]:`quantum.particle.electron.proton.neutron.atom.molecule.energy.force.motion.velocity.acceleration.relativity.wave.light.electromagnetism.thermodynamics.entropy.nuclear.radiation.laser.superconductor.magnetic.electric.frequency.wavelength`.split(`.`),[d.CHEMISTRY]:[`element`,`compound`,`reaction`,`acid`,`base`,`molecule`,`polymer`,`catalyst`,`oxidation`,`reduction`,`periodic table`,`bond`,`solvent`,`solution`,`concentration`,`pH`,`organic`,`inorganic`,`biochemistry`,`alloy`,`metal`],[d.ECONOMICS]:`money.currency.market.trade.inflation.gdp.economy.finance.investment.stock.bank.loan.tax.budget.supply.demand.capitalism.socialism.entrepreneurship.startup.business.profit.revenue.cost.wage.unemployment.productivity.globalization`.split(`.`),[d.CULTURE]:[`art`,`music`,`literature`,`film`,`dance`,`theater`,`poetry`,`painting`,`sculpture`,`architecture`,`religion`,`philosophy`,`mythology`,`language`,`culture`,`tradition`,`festival`,`cuisine`,`fashion`,`media`,`book`,`novel`],[d.GEOGRAPHY]:[`country`,`continent`,`city`,`capital`,`population`,`border`,`region`,`map`,`latitude`,`longitude`,`timezone`,`flag`,`government`,`north`,`south`,`east`,`west`,`arctic`,`tropical`,`mediterranean`,`pacific`,`atlantic`],[d.SPORTS]:[`cricket`,`football`,`soccer`,`basketball`,`tennis`,`baseball`,`hockey`,`olympic`,`athlete`,`tournament`,`championship`,`league`,`team`,`player`,`coach`,`match`,`score`,`goal`,`run`,`wicket`,`court`,`stadium`,`marathon`]};function p(e=``,t=``){let n=(e+` `+t).toLowerCase(),r={};for(let[e,t]of Object.entries(f))r[e]=t.filter(e=>n.includes(e)).length;let i=Object.entries(r).sort((e,t)=>t[1]-e[1])[0];return i[1]>0?i[0]:d.UNIVERSAL}function m(e=``){let t=e.split(` `).length,n=e.split(` `).reduce((e,t)=>e+t.length,0)/Math.max(t,1);return n>7||t>200?`hard`:n>5.5||t>80?`medium`:`easy`}function h(e){return{space:`Space & Cosmos`,biology:`Biology & Life`,history:`History`,technology:`Technology`,earth:`Earth & Nature`,physics:`Physics`,chemistry:`Chemistry`,economics:`Economics & Business`,culture:`Arts & Culture`,geography:`Geography`,sports:`Sports`,universal:`General Knowledge`}[e]||`General Knowledge`}function g(e){return{space:`🌌`,biology:`🧬`,history:`🏛️`,technology:`💻`,earth:`🌍`,physics:`⚡`,chemistry:`🧪`,economics:`💹`,culture:`🎨`,geography:`🗺️`,sports:`🏆`,universal:`🔮`}[e]||`🔮`}var _=[];function v(){if(typeof window>`u`||!window.speechSynthesis)return null;_=window.speechSynthesis.getVoices();let e=_.filter(e=>e.lang.startsWith(`en`));for(let t of[`Google US English`,`Microsoft Aria`,`Microsoft Guy`,`Microsoft Zira`,`Microsoft David`,`en-US`,`en-GB`]){let n=e.find(e=>e.name.includes(t)||e.lang===t);if(n)return n}return e.length>0?e[0]:_.length>0?_[0]:null}typeof window<`u`&&window.speechSynthesis&&(window.speechSynthesis.onvoiceschanged=()=>{_=window.speechSynthesis.getVoices()},_=window.speechSynthesis.getVoices());var y=null,b=null,x=!1,S={speak(e,t,n,r){if(typeof window>`u`||!window.speechSynthesis){r&&r(Error(`Speech synthesis not supported in this browser`));return}this.stop();let i=e.replace(/<[^>]*>/g,``).trim();if(!i){n&&n();return}let a=new SpeechSynthesisUtterance(i),o=v();o&&(a.voice=o),a.pitch=1,a.rate=1,y=t,b=n,x=!0,a.onstart=()=>{y&&y(),window.dispatchEvent(new CustomEvent(`voice-speak-start`,{detail:{text:i}}))},a.onend=()=>{if(x){if(x=!1,b){let e=b;b=null,e()}y=null,window.dispatchEvent(new CustomEvent(`voice-speak-end`))}},a.onerror=e=>{if(console.warn(`SpeechSynthesisUtterance warning/error`,e),e.error!==`interrupted`){if(x=!1,r&&r(e),b){let e=b;b=null,e()}y=null,window.dispatchEvent(new CustomEvent(`voice-speak-end`))}},window.speechSynthesis.speak(a)},stop(){if(!(typeof window>`u`||!window.speechSynthesis))if(x){if(x=!1,window.speechSynthesis.cancel(),b){let e=b;b=null,e()}y=null,window.dispatchEvent(new CustomEvent(`voice-speak-end`))}else window.speechSynthesis.cancel()},pause(){typeof window>`u`||!window.speechSynthesis||window.speechSynthesis.pause()},resume(){typeof window>`u`||!window.speechSynthesis||window.speechSynthesis.resume()},isPlaying(){return typeof window>`u`||!window.speechSynthesis?!1:x||window.speechSynthesis.speaking}};function C(e){if(!e)return;let t=e.getContext(`2d`);if(!t)return;let n=()=>{let t=e.parentElement.getBoundingClientRect();e.width=t.width,e.height=t.height};n(),window.addEventListener(`resize`,n);let r=Array.from({length:60},()=>({x:Math.random()*e.width,y:Math.random()*e.height,r:Math.random()*1.5+.5,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,opacity:Math.random()*.5+.1})),i;function a(){t.clearRect(0,0,e.width,e.height),r.forEach(n=>{n.x=(n.x+n.vx+e.width)%e.width,n.y=(n.y+n.vy+e.height)%e.height,t.beginPath(),t.arc(n.x,n.y,n.r,0,Math.PI*2),t.fillStyle=`rgba(167,139,250,${n.opacity})`,t.fill()}),r.forEach((e,n)=>{r.slice(n+1).forEach(n=>{let r=Math.hypot(e.x-n.x,e.y-n.y);r<90&&(t.beginPath(),t.moveTo(e.x,e.y),t.lineTo(n.x,n.y),t.strokeStyle=`rgba(124,58,237,${.12*(1-r/90)})`,t.stroke())})}),i=requestAnimationFrame(a)}return a(),()=>{cancelAnimationFrame(i),window.removeEventListener(`resize`,n)}}var w={cleanupCanvas:null,render(){let e=s.getState(),t=e.recentSearches||[],n=e.favorites?.topics||[],r=t.slice(0,6).map(e=>e.title),i=r.length>0?r:[`Quantum Physics`,`Human Brain`,`Dinosaurs`,`Ancient Egypt`,`Volcano`,`Artificial Intelligence`];return`
      <div class="homepage-container" style="display: flex; flex-direction: column; gap: var(--space-12); position: relative; z-index: 5;">
        
        <!-- SECTION 1: HERO SECTION -->
        <section class="hero-card reveal animate-fade-up" style="position: relative; overflow: hidden; padding: var(--space-16) var(--space-6); min-height: 480px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-radius: var(--radius-xl); background: var(--gradient-hero);">
          <canvas id="hero-particle-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></svg></canvas>
          
          <div style="position: relative; z-index: 2; max-width: 750px; display: flex; flex-direction: column; gap: var(--space-4); align-items: center;">
            <h1 class="text-hero" style="color: #ffffff; text-shadow: 0 4px 12px rgba(0,0,0,0.5);">
              Search Anything.<br/>Learn It Visually.
            </h1>
            <p class="text-body text-secondary" style="font-size: 1.15rem; max-width: 600px;">
              WonderVerse turns any topic into explanations, comics, diagrams, quizzes, and visual learning journeys using free public knowledge.
            </p>
            
            <div style="width: 100%; max-width: 580px; margin-top: var(--space-4);">
              ${c.render(`Search any topic: AI, health, moon, dinosaurs, business...`,`hero-search`)}
            </div>
            
            <div style="display: flex; gap: var(--space-2); align-items: center; justify-content: center; flex-wrap: wrap; margin-top: var(--space-2);">
              <span class="text-tiny text-muted" style="font-weight: 700;">RECENT CORES:</span>
              ${i.map(e=>`
                <button class="btn btn-secondary btn-sm trending-chip-btn" data-query="${e}" style="border-radius: var(--radius-full); font-size: 0.75rem;">
                  ${e}
                </button>
              `).join(``)}
            </div>
          </div>
        </section>

        <!-- SECTION 2: TRENDING TOPICS GRID -->
        <section class="reveal">
          <h2 class="text-h2" style="margin-bottom: var(--space-4); text-align: center;">Try Any Topic</h2>
          <div class="trending-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-3);">
            ${[{icon:`🌌`,label:`Moon`,cat:`space`},{icon:`🧬`,label:`DNA`,cat:`biology`},{icon:`🏛️`,label:`Ancient Egypt`,cat:`history`},{icon:`🌋`,label:`Volcano`,cat:`earth`},{icon:`⚡`,label:`Quantum Physics`,cat:`physics`},{icon:`💻`,label:`Artificial Intelligence`,cat:`technology`},{icon:`🌍`,label:`Photosynthesis`,cat:`biology`},{icon:`🧪`,label:`Chemistry`,cat:`chemistry`},{icon:`💹`,label:`Bitcoin`,cat:`economics`},{icon:`🗺️`,label:`Geography`,cat:`geography`},{icon:`🏆`,label:`Cricket`,cat:`sports`},{icon:`🌊`,label:`Ocean`,cat:`earth`}].map(e=>`
              <button class="card card-glow try-topic-btn" data-query="${e.label}" style="display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-4); cursor: pointer; text-align: center; border-radius: var(--radius-md);">
                <span style="font-size: 1.35rem;">${e.icon}</span>
                <span class="text-small" style="font-weight: 600; color: var(--text-primary);">${e.label}</span>
              </button>
            `).join(``)}
          </div>
        </section>

        <!-- SECTION 3: POPULAR SEARCHES -->
        <section class="reveal">
          <h2 class="text-h2" style="margin-bottom: var(--space-2);">Explore What Others Are Learning</h2>
          <p class="text-small text-muted" style="margin-bottom: var(--space-6);">Explore high-fidelity visual cards crafted dynamically from encyclopedic database registries.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-6);">
            ${[{title:`Black Hole`,desc:`A region of spacetime exhibiting gravitational acceleration so strong that nothing can escape from it.`,cat:`space`},{title:`Human Heart`,desc:`A muscular organ in most animals, which pumps blood through the blood vessels of the circulatory system.`,cat:`biology`},{title:`Ancient Rome`,desc:`The ancient civilization that grew from an agricultural community founded on the Italian Peninsula.`,cat:`history`},{title:`Internet`,desc:`A global system of interconnected computer networks that uses the Internet protocol suite.`,cat:`technology`},{title:`Dinosaurs`,desc:`A diverse group of reptiles of the clade Dinosauria that first appeared during the Triassic period.`,cat:`biology`},{title:`Volcano`,desc:`A rupture in the crust of a planetary-mass object, such as Earth, that allows hot lava and gases to escape.`,cat:`earth`},{title:`Quantum Mechanics`,desc:`A fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms.`,cat:`physics`},{title:`Photosynthesis`,desc:`A process used by plants and other organisms to convert light energy into chemical energy.`,cat:`biology`}].map(e=>{let t=g(e.cat),n=h(e.cat);return`
                <div class="card card-glow tilt-card reveal" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 240px;">
                  <div class="mouse-glow"></div>
                  <div>
                    <span class="badge badge-${e.cat}">${t} ${n}</span>
                    <h3 class="text-h3" style="margin-top: var(--space-3); margin-bottom: var(--space-2);">${e.title}</h3>
                    <p class="text-small text-secondary" style="line-height: 1.4; height: 60px; overflow: hidden; margin-bottom: var(--space-4);">${e.desc}</p>
                  </div>
                  <button class="btn btn-secondary btn-sm popular-open-btn" data-title="${e.title}" style="width: 100%; justify-content: center;">
                    Open Journey →
                  </button>
                </div>
              `}).join(``)}
          </div>
        </section>

        <!-- SECTION 4: VISUAL JOURNEY PREVIEW -->
        <section class="reveal">
          <h2 class="text-h2" style="margin-bottom: var(--space-2);">What You Get</h2>
          <p class="text-small text-muted" style="margin-bottom: var(--space-6);">WonderVerse maps every search coordinate into five responsive telemetry profiles.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-5);">
            ${[{name:`Story Mode`,icon:`📚`,desc:`Comic panels featuring character narration and text balloons.`},{name:`Learn Mode`,icon:`🧠`,desc:`ELI10 options, vocabulary definitions, and structured details.`},{name:`Diagram Mode`,icon:`📊`,desc:`Interactive SVG vectors that respond to clicks and nodes.`},{name:`Quiz Mode`,icon:`🎯`,desc:`5 dynamic multiple choice questions with synth audio feedback.`},{name:`Explore Mode`,icon:`🧭`,desc:`Suggests related subjects, search metrics, and Wikipedia coordinates.`}].map(e=>`
              <div class="card" style="display: flex; flex-direction: column; gap: var(--space-2); text-align: center; padding: var(--space-5);">
                <span style="font-size: 2.25rem;">${e.icon}</span>
                <h4 class="text-h3" style="margin: 0;">${e.name}</h4>
                <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">${e.desc}</p>
              </div>
            `).join(``)}
          </div>
        </section>

        <!-- SECTION 5: HOW IT WORKS -->
        <section class="reveal card" style="background: var(--bg-secondary); padding: var(--space-8);">
          <h2 class="text-h2" style="margin-top: 0; margin-bottom: var(--space-6); text-align: center;">How WonderVerse Works</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-8); position: relative; z-index: 2;">
            <div class="text-center" style="display: flex; flex-direction: column; gap: var(--space-2);">
              <span class="text-mono" style="font-size: 1.5rem; color: var(--accent-cyan); font-weight: bold;">01</span>
              <h4 class="text-h3" style="margin: 0;">Search Any Subject</h4>
              <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">Type any coordinate into the engine. Our system queries public servers instantly.</p>
            </div>
            <div class="text-center" style="display: flex; flex-direction: column; gap: var(--space-2);">
              <span class="text-mono" style="font-size: 1.5rem; color: var(--accent-purple); font-weight: bold;">02</span>
              <h4 class="text-h3" style="margin: 0;">Dynamic Structuring</h4>
              <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">Generator filters complex definitions, creates comics, and formats lessons.</p>
            </div>
            <div class="text-center" style="display: flex; flex-direction: column; gap: var(--space-2);">
              <span class="text-mono" style="font-size: 1.5rem; color: var(--accent-amber); font-weight: bold;">03</span>
              <h4 class="text-h3" style="margin: 0;">Interactive Telemetry</h4>
              <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">Explore the topic through concept maps, quizzes, and ELI10 simplicity cards.</p>
            </div>
          </div>
        </section>

        <!-- SECTION 6: RECENTLY EXPLORED -->
        ${t.length>0?`
          <section class="reveal">
            <h2 class="text-h2" style="margin-bottom: var(--space-4);">Recently Explored</h2>
            <div class="horizontal-scroll-row" style="display: flex; gap: var(--space-4); overflow-x: auto; padding-bottom: 10px;">
              ${t.map(e=>{let t=g(e.category),n=h(e.category);return`
                  <div class="card card-glow tilt-card try-topic-btn" data-query="${e.title}" style="flex: 0 0 240px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; min-height: 140px; padding: var(--space-4);">
                    <div>
                      <span class="badge badge-${e.category}">${t} ${n}</span>
                      <h4 class="text-h3" style="margin-top: var(--space-2); margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e.title}</h4>
                    </div>
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">Opened on ${e.date}</span>
                  </div>
                `}).join(``)}
            </div>
          </section>
        `:``}

        <!-- SECTION 7: SAVED TOPICS -->
        ${n.length>0?`
          <section class="reveal">
            <h2 class="text-h2" style="margin-bottom: var(--space-4);">Saved Library Preview</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4);">
              ${n.slice(0,4).map(e=>`
                <div class="card card-glow try-topic-btn" data-query="${e}" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); cursor: pointer;">
                  <div style="min-width: 0;">
                    <h4 class="text-h3" style="margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e}</h4>
                    <span style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 600;">Saved Topic</span>
                  </div>
                  <span style="font-size: 1.15rem; color: var(--accent-amber);">★</span>
                </div>
              `).join(``)}
            </div>
          </section>
        `:``}

        <!-- SECTION 8: STATS BAR -->
        <section class="reveal card" style="background: var(--bg-secondary); border-color: var(--border-default); padding: var(--space-5);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-6); text-align: center;">
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-cyan); font-size: 2rem; margin: 0;">UNLIMITED</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">Topics Covered</p>
            </div>
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-purple); font-size: 2rem; margin: 0;">5 MODES</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">Learning views</p>
            </div>
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-amber); font-size: 2rem; margin: 0;">DYNAMIC</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">Quizzes created</p>
            </div>
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-rose); font-size: 2rem; margin: 0;">7 TYPES</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">Diagram templates</p>
            </div>
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-emerald); font-size: 2rem; margin: 0;">100% FREE</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">No account keys</p>
            </div>
          </div>
        </section>

      </div>
    `},bindEvents(){l.initScrollReveal(),l.setupTilt();let e=document.getElementById(`hero-particle-canvas`);e&&(this.cleanupCanvas=C(e)),c.bindEvents(`hero-search`,e=>{$.navigate(`search?q=${encodeURIComponent(e)}`)}),document.querySelectorAll(`.trending-chip-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-query`);$.navigate(`search?q=${encodeURIComponent(t)}`)})}),document.querySelectorAll(`.try-topic-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-query`);$.navigate(`search?q=${encodeURIComponent(t)}`)})}),document.querySelectorAll(`.popular-open-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-title`);$.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g,`_`))}`)})})},destroy(){S.stop(),this.cleanupCanvas&&=(this.cleanupCanvas(),null)}},T=`https://en.wikipedia.org/w/api.php`,E=`https://en.wikipedia.org/api/rest_v1`;function D(e){return e&&({ai:`Artificial intelligence`,ml:`Machine learning`,vr:`Virtual reality`,ar:`Augmented reality`,mr:`Mixed reality`,ui:`User interface`,ux:`User experience`,pc:`Personal computer`,cpu:`Central processing unit`,gpu:`Graphics processing unit`,ram:`Random-access memory`,dna:`Deoxyribonucleic acid`}[e.trim().toLowerCase()]||e)}async function O(e,t={},n=8e3){let r=new AbortController,i=setTimeout(()=>r.abort(),n);try{let n=await fetch(e,{...t,signal:r.signal});return clearTimeout(i),n}catch(t){return clearTimeout(i),console.error(`Fetch error for ${e}:`,t),null}}var k={async search(e){let t=D(e),n=await O(`${T}?action=query&generator=search&gsrsearch=${encodeURIComponent(t)}&prop=pageimages|extracts&piprop=thumbnail&pithumbsize=200&pilimit=10&exintro&explaintext&exsentences=2&exlimit=10&format=json&origin=*`);if(!n)return null;try{let e=(await n.json()).query?.pages||{},r=Object.values(e).sort((e,t)=>(e.index||0)-(t.index||0)).map(e=>({title:e.title,snippet:e.extract||``,thumbnail:e.thumbnail?.source||null}));if(r.length>0)return r;let i=await O(`${T}?action=query&list=search&srsearch=${encodeURIComponent(t)}&format=json&origin=*&srlimit=10`);return i?((await i.json()).query?.search||[]).map(e=>({title:e.title,snippet:e.snippet.replace(/<span class="searchmatch">/g,``).replace(/<\/span>/g,``).replace(/&quot;/g,`"`).replace(/&amp;/g,`&`),thumbnail:null})):null}catch(e){return console.error(`Failed to parse search data`,e),null}},async getSummary(e){let t=await O(`${E}/page/summary/${encodeURIComponent(e.replace(/ /g,`_`))}`);if(!t)return null;try{return await t.json()}catch(e){return console.error(`Failed to parse summary data`,e),null}},async getLeadExtract(e){let t=await O(`${T}?action=query&titles=${encodeURIComponent(e)}&prop=extracts&exintro&explaintext&format=json&origin=*`);if(!t)return``;try{let e=(await t.json()).query?.pages||{};return Object.values(e)[0]?.extract||``}catch(e){return console.error(`Failed to parse lead extract`,e),``}},async getRelated(e){let t=await O(`${T}?action=query&titles=${encodeURIComponent(e)}&prop=links&pllimit=20&format=json&origin=*`);if(!t)return null;try{return await t.json()}catch(e){return console.error(`Failed to parse links data`,e),null}},async getImages(e){let t=await O(`${T}?action=query&titles=${encodeURIComponent(e)}&prop=images&imlimit=10&format=json&origin=*`);if(!t)return null;try{return await t.json()}catch(e){return console.error(`Failed to parse images data`,e),null}},async getCategories(e){let t=await O(`${T}?action=query&titles=${encodeURIComponent(e)}&prop=categories&cllimit=10&format=json&origin=*`);if(!t)return null;try{return await t.json()}catch(e){return console.error(`Failed to parse categories data`,e),null}},async getSections(e){let t=await O(`${T}?action=parse&page=${encodeURIComponent(e)}&prop=sections&format=json&origin=*`);if(!t)return null;try{return(await t.json()).parse?.sections||[]}catch(e){return console.error(`Failed to parse sections list`,e),null}},async getSectionText(e,t){let n=await O(`${T}?action=parse&page=${encodeURIComponent(e)}&prop=text&section=${t}&format=json&origin=*`);if(!n)return null;try{return(await n.json()).parse?.text?.[`*`]||``}catch(e){return console.error(`Failed to parse section ${t} text`,e),null}},async getMediaList(e){let t=await O(`${E}/page/media-list/${encodeURIComponent(e.replace(/ /g,`_`))}`);if(!t)return null;try{return await t.json()}catch(e){return console.error(`Failed to parse media list data`,e),null}},async getVideos(e,t=``){let n=e.trim(),r=`https://commons.wikimedia.org/w/api.php`,i=await O(`${r}?action=query&generator=search&gsrsearch=${encodeURIComponent(n)}+filetype:video&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|mime|thumburl&iiurlwidth=400&format=json&origin=*`),a=(i?await i.json():null)?.query?.pages||{},o=[];for(let e of Object.values(a)){let t=e.imageinfo?.[0];t&&t.url&&(t.mime?.startsWith(`video/`)||t.url.endsWith(`.webm`)||t.url.endsWith(`.ogv`)||t.url.endsWith(`.mp4`))&&o.push({title:e.title.replace(`File:`,``).replace(/_/g,` `),url:t.url,mime:t.mime||(t.url.endsWith(`.webm`)?`video/webm`:t.url.endsWith(`.ogv`)?`video/ogg`:`video/mp4`),thumbnail:t.thumburl||null})}if(o.length===0&&t){let e=await O(`${r}?action=query&generator=search&gsrsearch=${encodeURIComponent(t)}+filetype:video&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|mime|thumburl&iiurlwidth=400&format=json&origin=*`),n=(e?await e.json():null)?.query?.pages||{};for(let e of Object.values(n)){let t=e.imageinfo?.[0];t&&t.url&&(t.mime?.startsWith(`video/`)||t.url.endsWith(`.webm`)||t.url.endsWith(`.ogv`)||t.url.endsWith(`.mp4`))&&o.push({title:e.title.replace(`File:`,``).replace(/_/g,` `),url:t.url,mime:t.mime||(t.url.endsWith(`.webm`)?`video/webm`:t.url.endsWith(`.ogv`)?`video/ogg`:`video/mp4`),thumbnail:t.thumburl||null})}}if(o.length===0){let e=await O(`${r}?action=query&generator=search&gsrsearch=Science+filetype:video&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|mime|thumburl&iiurlwidth=400&format=json&origin=*`),t=(e?await e.json():null)?.query?.pages||{};for(let e of Object.values(t)){let t=e.imageinfo?.[0];t&&t.url&&(t.mime?.startsWith(`video/`)||t.url.endsWith(`.webm`)||t.url.endsWith(`.ogv`)||t.url.endsWith(`.mp4`))&&o.push({title:e.title.replace(`File:`,``).replace(/_/g,` `),url:t.url,mime:t.mime||(t.url.endsWith(`.webm`)?`video/webm`:t.url.endsWith(`.ogv`)?`video/ogg`:`video/mp4`),thumbnail:t.thumburl||null})}}return o},async searchMultiple(e){let t=e.map(e=>this.search(e));return Promise.allSettled(t)}};async function ee(e,t=``){let n=D(e);try{let e=null,r=``,i=await k.getSummary(n);if(i&&(e=i,e.type===`disambiguation`||e.description?.toLowerCase().includes(`disambiguation page`))){console.log(`Detected disambiguation page for "${n}". Resolving to a specific article...`);let t=await k.search(n);if(t&&t.length>0){let r=t.find(e=>!e.title.toLowerCase().includes(`disambiguation`)&&e.title.toLowerCase()!==n.toLowerCase())||t.find(e=>!e.title.toLowerCase().includes(`disambiguation`));r&&(console.log(`Redirecting disambiguation page from "${n}" to "${r.title}"`),n=r.title,e=await k.getSummary(n))}}let[a,o,s]=await Promise.allSettled([k.getLeadExtract(n),k.getRelated(n),k.getCategories(n)]);r=a.status===`fulfilled`?a.value:``;let c=o.status===`fulfilled`?o.value:null,l=s.status===`fulfilled`?s.value:null;return{summary:e,leadExtract:r,related:c,categories:l,query:t,title:n,fetchedAt:Date.now()}}catch(e){return console.error(`Data aggregation error on fetchTopicData`,e),{summary:null,leadExtract:``,related:null,categories:null,query:t,title:n,fetchedAt:Date.now()}}}var A={renderCard(){return`
      <div class="card" style="height: 180px; width: 100%; margin-bottom: var(--space-4); display: flex; gap: var(--space-4); padding: var(--space-4);">
        <div class="skeleton" style="width: 100px; height: 100px; flex-shrink: 0; border-radius: var(--radius-md);"></div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: var(--space-2);">
          <div class="skeleton" style="width: 40%; height: 20px; border-radius: var(--radius-sm);"></div>
          <div class="skeleton" style="width: 80%; height: 14px; border-radius: var(--radius-sm);"></div>
          <div class="skeleton" style="width: 90%; height: 14px; border-radius: var(--radius-sm);"></div>
          <div class="skeleton" style="width: 30%; height: 28px; border-radius: var(--radius-sm); margin-top: auto;"></div>
        </div>
      </div>
    `},renderSearchSkeletons(){return`
      <div style="display: flex; flex-direction: column; gap: var(--space-4); max-width: var(--content-max); margin: 0 auto;">
        ${Array.from({length:4}).map(()=>this.renderCard()).join(``)}
      </div>
    `},renderTopicPageSkeleton(){return`
      <div style="display: flex; flex-direction: column; gap: var(--space-6); width: 100%; max-width: var(--container-max); margin: 0 auto;">
        <!-- Hero Skeleton -->
        <div class="card" style="height: 220px; display: flex; gap: var(--space-6); padding: var(--space-6);">
          <div class="skeleton" style="width: 180px; height: 180px; border-radius: var(--radius-lg); flex-shrink: 0;"></div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: var(--space-3);">
            <div style="display: flex; gap: var(--space-2);">
              <div class="skeleton" style="width: 80px; height: 18px; border-radius: var(--radius-full);"></div>
              <div class="skeleton" style="width: 60px; height: 18px; border-radius: var(--radius-full);"></div>
            </div>
            <div class="skeleton" style="width: 50%; height: 28px; border-radius: var(--radius-sm);"></div>
            <div class="skeleton" style="width: 90%; height: 16px; border-radius: var(--radius-sm);"></div>
            <div class="skeleton" style="width: 85%; height: 16px; border-radius: var(--radius-sm);"></div>
          </div>
        </div>
        <!-- Tabs Skeleton -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="skeleton" style="height: 16px; width: 120px;"></div>
          <div class="skeleton" style="height: 40px; width: 350px; border-radius: var(--radius-full);"></div>
        </div>
        <!-- Workspace Skeleton -->
        <div class="card" style="height: 450px; display: flex; flex-direction: column; gap: var(--space-4);">
          <div class="skeleton" style="width: 30%; height: 22px;"></div>
          <div class="skeleton" style="width: 100%; height: 300px; border-radius: var(--radius-lg);"></div>
        </div>
      </div>
    `}},te={container:null,query:``,render(e){return this.query=e.q||``,`
      <div class="search-page-container" style="display: flex; flex-direction: column; gap: var(--space-6); min-height: 70vh;">
        <div id="search-status-bar" class="reveal animate-fade-up">
          <h1 class="text-h1">Searching Universe</h1>
          <p class="text-small text-secondary">Interrogating Wikipedia core systems...</p>
        </div>

        <div id="search-results-mount" style="position: relative; z-index: 5;">
          ${A.renderSearchSkeletons()}
        </div>
      </div>
    `},async bindEvents(e){if(this.container=document.getElementById(`search-results-mount`),this.query=e.q||``,!this.query){this.renderNoResults();return}this.executeSearchQuery()},async executeSearchQuery(){let e=document.getElementById(`search-status-bar`);e&&(e.innerHTML=`
        <h1 class="text-h1">Searching For "${this.query}"</h1>
        <p class="text-small text-secondary">Connecting to live Wikipedia nodes...</p>
      `);try{let e=await k.search(this.query);e===null?this.renderAPIError():e.length===0?this.renderNoResults():this.renderResults(e)}catch(e){console.error(e),this.renderAPIError()}},renderResults(e){let t=document.getElementById(`search-status-bar`);t&&(t.innerHTML=`
        <h1 class="text-h1">Found ${e.length} Results</h1>
        <p class="text-small text-secondary">Verified database nodes matching "${this.query}"</p>
      `);let n=e.map((e,t)=>{let n=p(e.title,e.snippet),r=g(n),i=h(n),a=e.snippet.replace(/<\/?[^>]+(>|$)/g,``).trim();return`
        <div class="result-card reveal card card-glow tilt-card" style="margin-bottom: var(--space-4); display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;">
          <div class="mouse-glow"></div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
              <span class="badge badge-${n}">${r} ${i}</span>
              <span class="text-tiny text-muted" style="font-weight: 700;">NODE #${t+1}</span>
            </div>
            <h3 class="text-h3" style="color: var(--text-primary); margin-top: var(--space-2); margin-bottom: var(--space-2);">${e.title}</h3>
            <p class="text-small text-secondary" style="line-height: 1.5; margin-bottom: var(--space-4);">${a||`No summary text available.`}...</p>
          </div>
          
          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm open-journey-btn" data-title="${e.title}">
              Open Visual Journey →
            </button>
            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(e.title.replace(/ /g,`_`))}" target="_blank" class="btn btn-ghost btn-sm">
              Wikipedia ↗
            </a>
          </div>
        </div>
      `}).join(``);this.container.innerHTML=`
      <div style="max-width: var(--content-max); margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-4);">
        ${n}
      </div>
    `,this.container.querySelectorAll(`.open-journey-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-title`);$.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g,`_`))}&q=${encodeURIComponent(this.query)}`)})}),l.initScrollReveal(),l.setupTilt()},renderNoResults(){let e=document.getElementById(`search-status-bar`);e&&(e.innerHTML=`
        <h1 class="text-h1">No Results Found</h1>
        <p class="text-small text-secondary">No matching telemetry coordinates for "${this.query}"</p>
      `);let t=[`Photosynthesis`,`Black Hole`,`Viking`],n=[{title:`Volcano`,desc:`A rupture in the crust of planetary objects releasing hot lava.`,cat:`earth`},{title:`DNA`,desc:`A molecule that carries genetic instructions for living organisms.`,cat:`biology`},{title:`Ancient Egypt`,desc:`A majestic civilization concentrated along the Nile river.`,cat:`history`},{title:`Quantum Physics`,desc:`A fundamental branch of physics exploring small matter behavior.`,cat:`physics`}];this.container.innerHTML=`
      <div style="max-width: var(--content-max); margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); text-align: center; padding: var(--space-6) 0;">
        <div class="card" style="padding: var(--space-8); border-color: var(--accent-amber);">
          <span style="font-size: 2.5rem; display: block; margin-bottom: var(--space-3);">🧭</span>
          <h3 class="text-h2" style="margin: 0; color: var(--accent-amber);">Explore Suggestion Channels</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; max-width: 500px; margin: var(--space-2) auto var(--space-4) auto;">
            We couldn't locate matching records for "${this.query}". Verify spellings or query one of our trending nodes instead.
          </p>
          <div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap;">
            ${t.map(e=>`<button class="btn btn-secondary btn-sm suggest-btn" data-query="${e}">${e}</button>`).join(``)}
          </div>
        </div>

        <div style="text-align: left;">
          <h4 class="text-h3" style="margin-bottom: var(--space-4);">Popular Learning Channels</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
            ${n.map(e=>`
              <div class="card card-glow tilt-card try-topic-btn" data-query="${e.title}" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 150px; cursor: pointer;">
                <div>
                  <span class="badge badge-${e.cat}">${g(e.cat)} ${h(e.cat)}</span>
                  <h4 class="text-h3" style="margin-top: var(--space-2); margin-bottom: 2px;">${e.title}</h4>
                  <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3; margin: 0;">${e.desc}</p>
                </div>
              </div>
            `).join(``)}
          </div>
        </div>
      </div>
    `,this.container.querySelectorAll(`.suggest-btn, .try-topic-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-query`);$.navigate(`search?q=${encodeURIComponent(t)}`)})}),l.initScrollReveal(),l.setupTilt()},renderAPIError(){let e=document.getElementById(`search-status-bar`);e&&(e.innerHTML=`
        <h1 class="text-h1" style="color: var(--accent-rose);">Telemetry Connection Failure</h1>
        <p class="text-small text-secondary">Could not fetch live knowledge. Showing offline learning examples.</p>
      `);let t=[{title:`Black Hole`,cat:`space`},{title:`Human Heart`,cat:`biology`},{title:`Artificial Intelligence`,cat:`technology`},{title:`Ancient Egypt`,cat:`history`},{title:`Volcano`,cat:`earth`},{title:`DNA`,cat:`biology`},{title:`Internet`,cat:`technology`},{title:`Moon`,cat:`space`}].map(e=>`
      <div class="card card-glow tilt-card try-topic-btn" data-query="${e.title}" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; cursor: pointer;">
        <div>
          <span class="badge badge-${e.cat}">${g(e.cat)} ${h(e.cat)}</span>
          <h3 class="text-h3" style="margin-top: var(--space-2); margin-bottom: 0;">${e.title}</h3>
        </div>
        <span style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 700;">Open Offline Journey</span>
      </div>
    `).join(``);this.container.innerHTML=`
      <div style="max-width: var(--content-max); margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6);">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4);">
          ${t}
        </div>
      </div>
    `,this.container.querySelectorAll(`.try-topic-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-query`);$.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g,`_`))}`)})}),l.initScrollReveal(),l.setupTilt()}};function ne(e,t,n){let r=t.split(`.`).filter(e=>e.trim().length>20),i=g(n);return[{id:1,type:`title`,panelClass:`panel-intro`,character:`🤖`,title:`Welcome to ${e}`,text:`Ready to explore one of the most fascinating topics in ${h(n)}? Let's begin your visual journey.`,style:`speech-bubble narrator`},{id:2,type:`definition`,panelClass:`panel-what`,character:i,title:`What is ${e}?`,text:r[0]?.trim()+`.`||`${e} is a remarkable subject with deep roots in human knowledge.`,style:`fact-card`},{id:3,type:`importance`,panelClass:`panel-why`,character:`💡`,title:`Why does it matter?`,text:r[1]?.trim()?r[1].trim()+`.`:`Understanding ${e} helps us make sense of the world in profound ways.`,style:`speech-bubble left`},{id:4,type:`detail`,panelClass:`panel-how`,character:`🔬`,title:`Here's a fascinating detail:`,text:r[2]?.trim()?r[2].trim()+`.`:`Scientists and researchers have discovered remarkable properties of ${e}.`,style:`highlight-card`},{id:5,type:`example`,panelClass:`panel-example`,character:`🌍`,title:`Real-world example:`,text:r[3]?.trim()?r[3].trim()+`.`:`You can see ${e} in action in everyday life and across many fields.`,style:`example-card`},{id:6,type:`callToAction`,panelClass:`panel-next`,character:`🚀`,title:`What to explore next:`,text:`Dive into the Learn Mode for structured knowledge, try the Diagram to see it visually, and challenge yourself with the Quiz!`,style:`cta-card`,hasNavButtons:!0}]}function re(e,t,n){let r=t.split(/\n+/).map(e=>e.trim()).filter(e=>e.length>20),i=``,a=``,o=``;if(r.length>=3)i=r[0],a=r[1],o=r[2];else if(r.length===2){i=r[0],a=r[1];let t=r[1].split(`. `).filter(e=>e.trim().length>5);t.length>=2?(a=t.slice(0,Math.ceil(t.length/2)).join(`. `)+`.`,o=t.slice(Math.ceil(t.length/2)).join(`. `)):o=`The operational foundation of ${e} relies on key mechanisms within ${n}. Researchers analyze these parameters using scientific frameworks to define their behaviors, relationships, and systemic properties.`}else if(r.length===1){let t=r[0].split(`. `).filter(e=>e.trim().length>5);t.length>=6?(i=t.slice(0,2).join(`. `)+`.`,a=t.slice(2,4).join(`. `)+`.`,o=t.slice(4).join(`. `)):t.length>=3?(i=t[0]+`.`,a=t[1]+`.`,o=t.slice(2).join(`. `)):(i=r[0],a=`${e} is a critical subject in ${n}. It connects complex academic principles and plays a significant role in modern research, forming the basis for practical and theoretical breakthroughs.`,o=`The mechanics of ${e} operate through specific structures and interactions. Detailed observation shows how various variables adjust in response to force, energy, or environmental changes within ${n}.`)}else i=`${e} is a primary area of study within the domain of ${n}. It describes a set of principles and structures essential to understanding this field.`,a=`${e} holds deep significance because it connects core concepts in ${n}. Studying this topic allows researchers and students to model real-world behaviors and predict outcome dynamics.`,o=`The underlying system of ${e} works by coordinating physical properties, structural constraints, and mathematical relationships as described in primary literature.`;let s=e=>{if(!e)return``;let t=e.trim();for(;t.endsWith(`.`);)t=t.slice(0,-1);return t+`.`};i=s(i),a=s(a),o=s(o);let c=oe(e,t,n),l=i.split(`. `).filter(Boolean)[0]||``,d=a.split(`. `).filter(Boolean)[0]||``,f=o.split(`. `).filter(Boolean)[0]||``,p=c.replace(/We see this in real life where: /i,``).split(`. `).filter(Boolean)[0]||``,m=j(l,e),h=j(d,e),g=j(f,e),_=j(p,e),v=`Imagine explaining ${e} to a 10-year-old: "${m}"`,y=new Set([`the`,`and`,`for`,`with`,`this`,`that`,`from`,`they`,`have`,`been`,`more`,`also`,`other`,`some`,`such`,`when`,`than`,`into`,`over`,`after`]),b={};t.toLowerCase().match(/\b[a-z]{6,}\b/g)?.forEach(e=>{y.has(e)||(b[e]=(b[e]||0)+1)});let x=Object.entries(b).filter(([,e])=>e>=2).sort((e,t)=>t[1]-e[1]).slice(0,8).map(([t])=>({term:u.capitalize(t),definition:`Key concept related to the study of ${e}.`})),S=t.split(`. `).filter(e=>e.trim().length>10);return{overview:i,whyItMatters:a,howItWorks:o,realExamples:c,eli10_overview:m,eli10_whyItMatters:h,eli10_howItWorks:g,eli10_realExamples:_,eli5:v,keyFacts:ie(e,t,S),keyTerms:x.length?x:ae(e,n),quickSummary:S.slice(0,2).join(`. `)+`.`,sourceName:`Wikipedia (en)`,isFromSummary:S.length<5}}function ie(e,t,n){let r=[];for(n.forEach(e=>{/\d/.test(e)&&e.length>20&&e.length<150&&r.push(e.trim())});r.length<4;)r.length===0?r.push(`${e} represents a core area of study in its respective field.`):r.length===1?r.push(`Active research on ${e} continues to reveal new properties and relationships.`):r.length===2?r.push(`Understanding the mechanics of ${e} is crucial for theoretical and practical applications.`):r.push(`Experts classify and examine ${e} using advanced scientific and analytical frameworks.`);return r.slice(0,5)}function j(e,t){if(!e)return`${t} is a fascinating subject that we study.`;let n=e.replace(/\([^)]*\)/g,``).replace(/\[[^\]]*\]/g,``).replace(/—[^—]*—/g,``).replace(/—/g,`, `).replace(/\s+/g,` `).trim();Object.entries({approximately:`about`,predominantly:`mostly`,subsequently:`then`,consequently:`so`,fundamentally:`basically`,exhibiting:`having`,gravitational:`gravity`,acceleration:`pull`,electromagnetic:`light and wave`,interconnected:`linked`,interconnectivity:`connection`,muscular:`strong`,circulatory:`blood flow`,civilization:`society`,agricultural:`farming`,fundamental:`basic`,properties:`features`,utilizes:`uses`,exhibit:`show`,mechanism:`way of working`,substantial:`large`,significant:`important`,phenomenon:`event`,constitutes:`makes up`,primarily:`mainly`,velocity:`speed`,trajectory:`path`,exhibits:`shows`,originated:`started`,characteristics:`features`,components:`parts`,particles:`tiny bits`,radiation:`waves`,composed:`made`}).forEach(([e,t])=>{let r=RegExp(`\\b${e}\\b`,`gi`);n=n.replace(r,t)});let r=n.split(` `);if(r.length>18){let e=n.indexOf(`,`);n=e>15&&e<90?n.slice(0,e)+`.`:r.slice(0,16).join(` `)+`.`}return n=n.trim().replace(/\.+$/,``)+`.`,n}function ae(e,t){return[{term:e,definition:`The central theme representing a major subject in ${t}.`},{term:`Telemetry Node`,definition:`A system component that measures and transmits variables.`},{term:`Analysis Core`,definition:`A primary repository of data used for verification.`},{term:`Coordinate Branch`,definition:`A path linking secondary facts to the primary topic.`}]}function oe(e,t,n){let r=t.split(`. `).filter(e=>e.trim().length>10);if(r.length>3){let e=r[r.length-1];if(e.toLowerCase().includes(`example`)||e.toLowerCase().includes(`such as`)||e.length>30)return`We see this in real life where: ${e}`}return{space:`An example of this is observing celestial bodies through telescopes or studying planetary trajectories in space missions.`,biology:`An example of this is how living organisms adapt to their environment, process food, or transmit genetic material down generations.`,history:`An example of this is seen in historic artifacts, archaeological discoveries, and ancient texts cataloging past events.`,technology:`An example of this is how computers route network data, encrypt password packets, or execute automation pipelines.`,earth:`An example of this is seeing geological formations, weather patterns, and ocean currents interact in our ecosystem.`,physics:`An example of this is calculating force distributions in suspension bridges, electromagnetic waves, or particles colliding in labs.`,economics:`An example of this is observing how local stores adjust pricing based on product supply, user demand, and tax rates.`,sports:`An example of this is how athletic training systems measure player speeds, goal distributions, and stamina metrics.`,culture:`An example of this is analyzing artistic expressions, language evolutions, and culinary customs within global communities.`}[n]||`An example of this is studying the natural interactions, patterns, and historical evidence of ${e} in the field.`}var se=new Set(`the.a.an.is.are.was.were.be.been.being.have.has.had.do.does.did.will.would.could.should.may.might.must.shall.can.need.dare.ought.used.of.to.in.for.on.with.as.at.by.from.into.through.during.before.after.above.below.up.down.out.off.over.under.again.further.then.once.and.or.but.if.while.because.until.although.however.therefore.thus.so.yet.both.either.neither.not.only.own.same.than.too.very.just.also.this.that.these.those.it.its.which.who.whom.whose.what.where.when.how.why.about.more.many.some.such.other`.split(`.`)),M={splitSentences(e){return e?e.split(/[.!?]+(?=\s|$)/).map(e=>e.trim()).filter(e=>e.length>15):[]},extractKeywords(e,t=5){if(!e)return[];let n=e.toLowerCase().match(/\b[a-z]{4,}\b/g)||[],r={};return n.forEach(e=>{se.has(e)||(r[e]=(r[e]||0)+1)}),Object.entries(r).sort((e,t)=>t[1]-e[1]).slice(0,t).map(e=>e[0])}};function ce(e,t){let{title:n,extract:r,query:i}=t;switch(e){case`space`:return ue(n,r);case`biology`:return de(n,r);case`history`:return fe(n,r);case`technology`:return pe(n,r);case`earth`:return me(n,r);case`physics`:return he(n,r);case`economics`:return ge(n,r);default:return le(n,r,i||n)}}function le(e,t,n){let r=M.splitSentences(t),i=r[0]||`${e} is a fascinating topic to explore.`,a=r[1]||`Understanding ${e} opens new perspectives.`,o=r[2]||`${e} has wide real-world applications.`,s=M.extractKeywords(t,5),c=[{label:`What it is`,angle:-60,x:220,y:160,color:`#7c3aed`,desc:u.capitalize(i.slice(0,50))+`...`},{label:`Why it matters`,angle:0,x:400,y:80,color:`#3b82f6`,desc:`${e} plays an important role in its field.`},{label:`Key facts`,angle:60,x:580,y:160,color:`#10b981`,desc:s.slice(0,3).join(`, `)||`Complex and multifaceted`},{label:`Real examples`,angle:120,x:580,y:360,color:`#f59e0b`,desc:u.capitalize(a.slice(0,50))+`...`},{label:`Related concepts`,angle:180,x:400,y:440,color:`#f43f5e`,desc:s.slice(3,5).join(`, `)||`Various related fields`},{label:`Explore further`,angle:240,x:220,y:360,color:`#06b6d4`,desc:u.capitalize(o.slice(0,50))+`...`}],l=`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" 
    style="background:#111118; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <defs>
      <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/>
      </radialGradient>
    </defs>
    <!-- Background grid -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
    <rect width="800" height="520" fill="url(#grid)"/>
    <!-- Title -->
    <text x="400" y="35" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="600" letter-spacing="1">CONCEPT MAP</text>
    <!-- Center node -->
    <circle cx="400" cy="260" r="70" fill="url(#centerGrad)" stroke="#7c3aed" stroke-width="1.5" class="diagram-node" data-node="center"/>
    <text x="400" y="254" text-anchor="middle" fill="#f0f0f8" font-size="14" font-weight="700">${e.length>18?e.slice(0,18)+`...`:e}</text>
    <text x="400" y="274" text-anchor="middle" fill="#a0a0b8" font-size="10">tap node to explore</text>`;return c.forEach(e=>{let t=e.x,n=e.y;l+=`
    <!-- Branch: ${e.label} -->
    <line x1="400" y1="260" x2="${t}" y2="${n}" 
          stroke="${e.color}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="5,3"/>
    <circle cx="${t}" cy="${n}" r="50" fill="${e.color}" fill-opacity="0.12" stroke="${e.color}" stroke-width="1" class="diagram-node" data-node="${e.label}" style="cursor:pointer;"/>
    <text x="${t}" y="${n-8}" text-anchor="middle" fill="${e.color}" font-size="10" font-weight="600">${e.label}</text>
    <foreignObject x="${t-44}" y="${n+2}" width="88" height="48">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:8px;color:rgba(255,255,255,0.6);text-align:center;line-height:1.3;pointer-events:none;">${e.desc}</div>
    </foreignObject>`}),l+=`</svg>`,l}function ue(e,t){let n=M.splitSentences(t),r=[{label:`Core Star / Planet`,angle:0,r:25,color:`#f59e0b`,desc:e},{label:`Atmosphere / Ring`,angle:72,r:85,color:`#3b82f6`,desc:n[0]?.slice(0,60)||`Atmospheric telemetry elements`},{label:`Satellite Orbit`,angle:144,r:125,color:`#06b6d4`,desc:n[1]?.slice(0,60)||`Satellite orbital gravity locks`},{label:`Cosmic Influence`,angle:216,r:165,color:`#7c3aed`,desc:n[2]?.slice(0,60)||`Deep field interstellar magnetic force`},{label:`Legacy / Records`,angle:288,r:205,color:`#f43f5e`,desc:n[3]?.slice(0,60)||`Observational record history`}],i=`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0a0a12; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <defs>
      <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fffbdf"/>
        <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#ef4444" stop-opacity="0.1"/>
      </radialGradient>
    </defs>
    <!-- Stars background -->
    <rect width="800" height="520" fill="#09090e"/>
    <circle cx="120" cy="80" r="1" fill="#fff" opacity="0.5"/>
    <circle cx="680" cy="120" r="1.5" fill="#fff" opacity="0.8"/>
    <circle cx="200" cy="400" r="0.8" fill="#fff" opacity="0.3"/>
    <circle cx="580" cy="440" r="1.2" fill="#fff" opacity="0.6"/>
    
    <text x="400" y="35" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600" letter-spacing="1">CELESTIAL ORBITAL TELEMETRY</text>
    
    <!-- Concentric Orbit rings -->
    <circle cx="400" cy="260" r="85" fill="none" stroke="rgba(59, 130, 246, 0.15)" stroke-width="1.5" stroke-dasharray="4,4"/>
    <circle cx="400" cy="260" r="145" fill="none" stroke="rgba(6, 182, 212, 0.15)" stroke-width="1.5" stroke-dasharray="4,4"/>
    <circle cx="400" cy="260" r="205" fill="none" stroke="rgba(124, 58, 237, 0.15)" stroke-width="1.5" stroke-dasharray="4,4"/>
    
    <!-- Central Solar Body -->
    <circle cx="400" cy="260" r="45" fill="url(#sunGrad)" stroke="#f59e0b" stroke-width="1" class="diagram-node" data-node="central-body" style="cursor:pointer;"/>
    <text x="400" y="264" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">${e.slice(0,16)}</text>`;return r.slice(1).forEach((e,t)=>{let n=e.angle*Math.PI/180,r=400+e.r*Math.cos(n),a=260+e.r*Math.sin(n);i+=`
    <line x1="400" y1="260" x2="${r}" y2="${a}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="${r}" cy="${a}" r="22" fill="#111118" stroke="${e.color}" stroke-width="2" class="diagram-node" data-node="${e.label}" style="cursor:pointer;"/>
    <circle cx="${r}" cy="${a}" r="6" fill="${e.color}" opacity="0.8"/>
    
    <text x="${r}" y="${a-28}" text-anchor="middle" fill="${e.color}" font-size="9" font-weight="700">${e.label}</text>
    <foreignObject x="${r-60}" y="${a+26}" width="120" height="35">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:7px;color:#a0a0b8;text-align:center;line-height:1.2;">${e.desc}</div>
    </foreignObject>`}),i+=`</svg>`,i}function de(e,t){let n=M.splitSentences(t),r=[{name:`System Head`,x:400,y:100,color:`#10b981`,desc:e},{name:`Structural Core`,x:250,y:220,color:`#34d399`,desc:n[0]?.slice(0,60)||`Core structural component.`},{name:`Motor Functions`,x:550,y:220,color:`#059669`,desc:n[1]?.slice(0,60)||`Nervous system signals.`},{name:`Energy Conversion`,x:250,y:380,color:`#06b6d4`,desc:n[2]?.slice(0,60)||`Metabolic synthesis actions.`},{name:`Regulation loops`,x:550,y:380,color:`#3b82f6`,desc:n[3]?.slice(0,60)||`Homeostatic balance control.`}],i=`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0a0f0d; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600" letter-spacing="1">BIOLOGICAL HIERARCHY LAYOUT</text>
    
    <!-- Curved Connections -->
    <path d="M 400 100 Q 325 160 250 220" fill="none" stroke="rgba(16,185,129,0.2)" stroke-width="2"/>
    <path d="M 400 100 Q 475 160 550 220" fill="none" stroke="rgba(16,185,129,0.2)" stroke-width="2"/>
    <path d="M 250 220 L 250 380" fill="none" stroke="rgba(52,211,153,0.2)" stroke-width="2"/>
    <path d="M 550 220 L 550 380" fill="none" stroke="rgba(5,150,105,0.2)" stroke-width="2"/>
    <path d="M 250 220 Q 400 300 550 220" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1.5" stroke-dasharray="3,3"/>`;return r.forEach(e=>{i+=`
    <g class="diagram-node" data-node="${e.name}" style="cursor:pointer;">
      <rect x="${e.x-70}" y="${e.y-25}" width="140" height="50" rx="10" fill="#161b18" stroke="${e.color}" stroke-width="2"/>
      <text x="${e.x}" y="${e.y+4}" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">${e.name}</text>
      <foreignObject x="${e.x-65}" y="${e.y+30}" width="130" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:7px;color:#a0b8aa;text-align:center;line-height:1.2;">${e.desc}</div>
      </foreignObject>
    </g>`}),i+=`</svg>`,i}function fe(e,t){let n=M.splitSentences(t),r=[{label:`Origin / Genesis`,year:`Phase I`,color:`#fbbf24`,desc:n[0]?.slice(0,75)||`Original inception period.`},{label:`Growth / Expansion`,year:`Phase II`,color:`#f59e0b`,desc:n[1]?.slice(0,75)||`Expansion and integration.`},{label:`Zenith / Peak`,year:`Phase III`,color:`#fb7185`,desc:n[2]?.slice(0,75)||`Historical zenith and peak power.`},{label:`Legacy / Impact`,year:`Phase IV`,color:`#f43f5e`,desc:n[3]?.slice(0,75)||`Lasting impact on systems today.`}],i=`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#130e0a; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="600" letter-spacing="1">CHRONOLOGICAL HISTORICAL TIMELINE</text>
    
    <!-- Timeline spine -->
    <line x1="80" y1="260" x2="720" y2="260" stroke="rgba(251,191,36,0.3)" stroke-width="3"/>
    <polygon points="730,260 715,252 715,268" fill="#fbbf24"/>`;return r.forEach((e,t)=>{let n=140+t*170,r=t%2==0?-90:90;t%2,i+=`
    <!-- Connectors -->
    <line x1="${n}" y1="260" x2="${n}" y2="${260+r/2}" stroke="${e.color}" stroke-width="1.5" stroke-dasharray="3,3"/>
    
    <!-- Timeline node -->
    <circle cx="${n}" cy="260" r="10" fill="#111118" stroke="${e.color}" stroke-width="3" class="diagram-node" data-node="${e.label}" style="cursor:pointer;"/>
    
    <!-- Content card -->
    <g class="diagram-node" data-node="${e.label}" style="cursor:pointer;">
      <rect x="${n-75}" y="${t%2==0?110:280}" width="150" height="75" rx="8" fill="#1e1814" stroke="${e.color}" stroke-width="1"/>
      <text x="${n}" y="${t%2==0?130:300}" text-anchor="middle" fill="${e.color}" font-size="9" font-weight="800">${e.year}</text>
      <text x="${n}" y="${t%2==0?142:312}" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="600">${e.label}</text>
      <foreignObject x="${n-70}" y="${t%2==0?148:318}" width="140" height="34">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:6.5px;color:#d0c0b8;text-align:center;line-height:1.2;">${e.desc}</div>
      </foreignObject>
    </g>`}),i+=`</svg>`,i}function pe(e,t){let n=M.splitSentences(t),r=[{label:`Data Source`,x:120,y:260,color:`#a78bfa`,desc:e},{label:`Processing core`,x:320,y:150,color:`#8a2be2`,desc:n[0]?.slice(0,60)||`Main algorithm core.`},{label:`Security firewall`,x:320,y:370,color:`#c084fc`,desc:n[1]?.slice(0,60)||`Access gatekeeper.`},{label:`Telemetry logs`,x:520,y:260,color:`#06b6d4`,desc:n[2]?.slice(0,60)||`Output system monitors.`},{label:`User Client`,x:700,y:260,color:`#10b981`,desc:n[3]?.slice(0,60)||`Client UI layout.`}],i=`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0c0914; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="600" letter-spacing="1">NETWORK FLOWCHART DATA STREAM</text>
    
    <!-- Paths -->
    <path d="M 120 260 L 320 150" stroke="rgba(167, 139, 250, 0.4)" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 120 260 L 320 370" stroke="rgba(167, 139, 250, 0.4)" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 320 150 L 520 260" stroke="rgba(138, 43, 226, 0.4)" stroke-width="2"/>
    <path d="M 320 370 L 520 260" stroke="rgba(192, 132, 252, 0.4)" stroke-width="2"/>
    <path d="M 520 260 L 700 260" stroke="rgba(6, 182, 212, 0.4)" stroke-width="3"/>`;return r.forEach(e=>{i+=`
    <g class="diagram-node" data-node="${e.label}" style="cursor:pointer;">
      <circle cx="${e.x}" cy="${e.y}" r="35" fill="#181326" stroke="${e.color}" stroke-width="2.5"/>
      <text x="${e.x}" y="${e.y+4}" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="800">${e.label.toUpperCase()}</text>
      <foreignObject x="${e.x-55}" y="${e.y+42}" width="110" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:7px;color:#a0a0c8;text-align:center;line-height:1.2;">${e.desc}</div>
      </foreignObject>
    </g>`}),i+=`</svg>`,i}function me(e,t){let n=M.splitSentences(t),r=[{label:`Step 1: Evaporation`,x:400,y:100,color:`#3b82f6`,desc:n[0]?.slice(0,65)||`Evaporation from surface sources.`},{label:`Step 2: Condensation`,x:580,y:220,color:`#06b6d4`,desc:n[1]?.slice(0,65)||`Gaseous moisture turns cloud.`},{label:`Step 3: Precipitation`,x:500,y:400,color:`#10b981`,desc:n[2]?.slice(0,65)||`Rain/snow delivers water.`},{label:`Step 4: Collection`,x:300,y:400,color:`#f59e0b`,desc:n[3]?.slice(0,65)||`Runoff merges in collection reservoirs.`},{label:`Step 5: Regeneration`,x:220,y:220,color:`#fb7185`,desc:e}],i=`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0a0c10; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#06b6d4" font-size="13" font-weight="600" letter-spacing="1">NATURAL RECYCLING PROCESS CYCLE</text>
    
    <!-- Circular Arrow spine -->
    <circle cx="400" cy="260" r="160" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="8"/>`;return r.forEach((e,t)=>{i+=`
    <g class="diagram-node" data-node="${e.label}" style="cursor:pointer;">
      <circle cx="${e.x}" cy="${e.y}" r="32" fill="#111827" stroke="${e.color}" stroke-width="2"/>
      <circle cx="${e.x}" cy="${e.y}" r="8" fill="${e.color}" opacity="0.3"/>
      <text x="${e.x}" y="${e.y+3}" text-anchor="middle" fill="#ffffff" font-size="7" font-weight="800">NODE ${t+1}</text>
      <text x="${e.x}" y="${e.y-38}" text-anchor="middle" fill="${e.color}" font-size="9" font-weight="700">${e.label}</text>
      <foreignObject x="${e.x-60}" y="${e.y+36}" width="120" height="35">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:7px;color:#9ca3af;text-align:center;line-height:1.2;">${e.desc}</div>
      </foreignObject>
    </g>`}),i+=`</svg>`,i}function he(e,t){return`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0c0a0f; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#f43f5e" font-size="13" font-weight="600" letter-spacing="1">FORCE VECTORS & MASS MATRIX</text>
    
    <!-- Body Core -->
    <rect x="300" y="180" width="200" height="120" rx="12" fill="#1f1a24" stroke="#7c3aed" stroke-width="3" class="diagram-node" data-node="Mass Object" style="cursor:pointer;"/>
    <text x="400" y="246" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">${e}</text>
    
    <!-- Normal Force (Up) -->
    <g class="diagram-node" data-node="FN: Normal Force" style="cursor:pointer;">
      <line x1="400" y1="180" x2="400" y2="70" stroke="#06b6d4" stroke-width="3.5"/>
      <polygon points="400,60 393,75 407,75" fill="#06b6d4"/>
      <text x="420" y="80" fill="#06b6d4" font-size="10" font-weight="700">FN: Normal Force</text>
    </g>
    
    <!-- Gravity Force (Down) -->
    <g class="diagram-node" data-node="FG: Gravitational Pull" style="cursor:pointer;">
      <line x1="400" y1="300" x2="400" y2="420" stroke="#f43f5e" stroke-width="3.5"/>
      <polygon points="400,430 393,415 407,415" fill="#f43f5e"/>
      <text x="420" y="420" fill="#f43f5e" font-size="10" font-weight="700">FG: Gravitational Pull</text>
    </g>
    
    <!-- Applied Force (Right) -->
    <g class="diagram-node" data-node="FA: Applied Force" style="cursor:pointer;">
      <line x1="500" y1="240" x2="630" y2="240" stroke="#10b981" stroke-width="3.5"/>
      <polygon points="640,240 625,233 625,247" fill="#10b981"/>
      <text x="645" y="244" fill="#10b981" font-size="10" font-weight="700">FA: Applied Force</text>
    </g>
    
    <!-- Friction Force (Left) -->
    <g class="diagram-node" data-node="FF: Friction Resistance" style="cursor:pointer;">
      <line x1="300" y1="240" x2="170" y2="240" stroke="#f59e0b" stroke-width="3.5"/>
      <polygon points="160,240 175,233 175,247" fill="#f59e0b"/>
      <text x="90" y="244" fill="#f59e0b" font-size="10" font-weight="700">FF: Friction Resistance</text>
    </g>
    
    <g class="diagram-node" data-node="Mass Object" style="cursor:pointer;">
      <foreignObject x="310" y="315" width="180" height="50">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:8px;color:#a78bfa;text-align:center;line-height:1.2;pointer-events:none;">${M.splitSentences(t)[0]?.slice(0,75)||`Forces act on the central body in opposing directions, creating net acceleration.`}</div>
      </foreignObject>
    </g>
  </svg>`}function ge(e,t){return`<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#090b0e; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600" letter-spacing="1">SUPPLY AND DEMAND MARKET TRANSACTION FLOW</text>
    
    <!-- Market Nodes -->
    <g class="diagram-node" data-node="Producers" style="cursor:pointer;">
      <rect x="100" y="210" width="140" height="80" rx="10" fill="#111827" stroke="#10b981" stroke-width="2.5"/>
      <text x="170" y="255" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">PRODUCERS</text>
    </g>
    
    <g class="diagram-node" data-node="Consumers" style="cursor:pointer;">
      <rect x="560" y="210" width="140" height="80" rx="10" fill="#111827" stroke="#3b82f6" stroke-width="2.5"/>
      <text x="630" y="255" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">CONSUMERS</text>
    </g>
    
    <!-- Flows -->
    <!-- Goods flow (producer to consumer) -->
    <g class="diagram-node" data-node="Goods flow" style="cursor:pointer;">
      <path d="M 240 230 C 370 160 430 160 560 230" fill="none" stroke="#10b981" stroke-width="3"/>
      <polygon points="560,230 543,220 551,235" fill="#10b981"/>
      <text x="400" y="170" text-anchor="middle" fill="#10b981" font-size="9" font-weight="700">GOODS & SERVICES FLOW</text>
    </g>
    
    <!-- Capital flow (consumer to producer) -->
    <g class="diagram-node" data-node="Capital flow" style="cursor:pointer;">
      <path d="M 560 270 C 430 340 370 340 240 270" fill="none" stroke="#3b82f6" stroke-width="3"/>
      <polygon points="240,270 257,280 249,265" fill="#3b82f6"/>
      <text x="400" y="325" text-anchor="middle" fill="#3b82f6" font-size="9" font-weight="700">FINANCIAL CAPITAL FLOW</text>
    </g>
    
    <g class="diagram-node" data-node="Market Telemetry" style="cursor:pointer;">
      <foreignObject x="250" y="215" width="300" height="80">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:8px;color:#9ca3af;text-align:center;line-height:1.4;pointer-events:none;">
          <strong>Market Telemetry: ${e}</strong><br/>
          ${M.splitSentences(t)[0]?.slice(0,120)||`Transactional loops coordinate capital and product distributions between agents.`}
        </div>
      </foreignObject>
    </g>
  </svg>`}function N(e,t){let n=t.split(/[.!?]+/).map(e=>e.trim()).filter(e=>e.length>25),r=[];r.push(R({type:`multiple-choice`,question:`What is ${e} primarily about?`,options:F(e,t,n),correctIndex:0,explanation:n[0]?`${n[0]}.`:`${e} is a significant topic in its domain.`})),n[1]?r.push({type:`true-false`,question:`True or false: "${P(n[1])}"`,options:[`True`,`False`],correctIndex:0,explanation:`This is directly stated in the information about ${e}.`}):r.push({type:`true-false`,question:`True or false: "${e} has wide-ranging implications in its domain of study."`,options:[`True`,`False`],correctIndex:0,explanation:`${e} is widely recognized for its importance.`}),r.push(R({type:`multiple-choice`,question:`Which of the following is most closely associated with ${e}?`,options:I(e,t),correctIndex:0,explanation:`This concept is central to understanding the mechanics of ${e}.`})),r.push(R({type:`multiple-choice`,question:`Why is ${e} considered important?`,options:L(e,t,n),correctIndex:0,explanation:n[2]?`${n[2]}.`:`${e} has significant implications in its field.`}));let i=n[Math.min(3,n.length-1)]||n[n.length-1]||`${e} is a multifaceted subject.`;return r.push(R({type:`best-description`,question:`Which statement best describes ${e}?`,options:[i,`${e} is a simple concept with limited applications.`,`${e} was discovered only recently and has no legacy.`,`${e} has no practical real-world applications.`],correctIndex:0,explanation:`The description aligns directly with what is verified about ${e}.`})),r.slice(0,5)}function P(e){return e.replace(/[.]+$/,``).trim()}function F(e,t,n){return[n[0]||`${e} is a key topic of interest.`,`A mathematical theorem used primarily in cryptanalysis.`,`A geological process of rock stratification over centuries.`,`A biological cellular barrier found in prokaryotes.`]}function I(e,t){let n=(t.toLowerCase().match(/\b[a-z]{6,}\b/g)||[]).find(e=>![`system`,`process`,`energy`,`volume`,`matter`,`nature`].includes(e))||`scientific research`;return[`Analyzing ${u.capitalize(n)} and surrounding system behaviors.`,`Industrial thermodynamics and steam turbine designs.`,`The linguistic evolution of ancient dialects.`,`Plate tectonics and volcanic faultline classifications.`]}function L(e,t,n){return[n[1]||`${e} provides foundational knowledge in its field.`,`It is the global standard for regulating marine commerce.`,`It is the direct catalyst for computer graphics rendering.`,`It allows scientists to synthesize synthetic heavy metals.`]}function R(e){let t=e.options[e.correctIndex],n=[...e.options].sort(()=>Math.random()-.5);return{...e,options:n,correctIndex:n.indexOf(t)}}function _e(e,t){let n=e.map((e,n)=>({question:e.question,userAnswer:e.options[t[n]],correctAnswer:e.options[e.correctIndex],isCorrect:t[n]===e.correctIndex,explanation:e.explanation})),r=n.filter(e=>e.isCorrect).length;return{score:r,total:e.length,percentage:Math.round(r/e.length*100),results:n}}var z={render(e,t){let n=e.title,r=e.extract||`No description available.`,i=e.thumbnail?.source||null,a=m(r),s=o.isFavorite(n,`topics`),c=g(t),l=h(t),u=e.content_urls?.desktop?.page||`https://en.wikipedia.org/wiki/${encodeURIComponent(n.replace(/ /g,`_`))}`;return`
      <div class="hero-card card card-glow reveal animate-fade-up" style="display: grid; grid-template-columns: 200px 1fr; gap: var(--space-6); align-items: center; margin-bottom: var(--space-6);">
        <div class="hero-image-wrapper" style="width: 200px; height: 200px; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-default); position: relative; display: flex; justify-content: center; align-items: center;">
          ${i?`<img src="${i}" alt="${n}" class="hero-image" style="width:100%; height:100%; object-fit:cover;" />`:`<div class="hero-image-placeholder" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:3rem; background:var(--bg-elevated);">${c}</div>`}
        </div>
        
        <div class="hero-info" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-2);">
              <div style="display: flex; flex-direction: column; gap: var(--space-2);">
                <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                  <span class="badge badge-${t}">${c} ${l}</span>
                  <span class="badge badge-${a}">${a}</span>
                </div>
                <h1 class="text-h1" style="margin: 0; background: linear-gradient(135deg, #ffffff 0%, var(--text-accent) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${n}
                </h1>
              </div>
              
              <button id="hero-save-btn" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full); font-weight:600;">
                ${s?`★ Saved`:`☆ Save Topic`}
              </button>
            </div>
            
            <p class="text-body text-secondary" style="margin-top: var(--space-2); margin-bottom: var(--space-4); line-height: 1.6;">
              ${r}
            </p>
          </div>
          
          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <a href="${u}" target="_blank" class="btn btn-ghost btn-sm">
              Wikipedia ↗
            </a>
            <button id="hero-speak-btn" class="btn btn-ghost btn-sm">
              🔊 Listen
            </button>
            <button id="hero-share-btn" class="btn btn-ghost btn-sm">
              🔗 Share
            </button>
            <button id="hero-copy-btn" class="btn btn-ghost btn-sm">
              📋 Copy Link
            </button>
          </div>
        </div>
      </div>
    `},bindEvents(e){let t=e.title,n=document.getElementById(`hero-save-btn`);n?.addEventListener(`click`,()=>{let e=o.toggleFavorite(t,`topics`);n.innerText=e?`★ Saved`:`☆ Save Topic`,window.dispatchEvent(new CustomEvent(`favorite-toggled`,{detail:{title:t,added:e}}))}),document.getElementById(`hero-share-btn`)?.addEventListener(`click`,()=>{navigator.share?navigator.share({title:`WonderVerse Learning Journey: ${t}`,text:`Explore ${t} visually on WonderVerse!`,url:window.location.href}).catch(e=>console.log(e)):(navigator.clipboard.writeText(window.location.href),alert(`Link copied to clipboard!`))});let r=document.getElementById(`hero-copy-btn`);r?.addEventListener(`click`,()=>{navigator.clipboard.writeText(window.location.href),r.innerText=`✓ Copied!`,setTimeout(()=>{r.innerText=`📋 Copy Link`},2e3)});let i=document.getElementById(`hero-speak-btn`);i?.addEventListener(`click`,()=>{S.isPlaying()?(S.stop(),i.innerHTML=`🔊 Listen`):(i.innerHTML=`⏹️ Stop`,S.speak(e.extract,()=>{i.innerHTML=`⏹️ Stop`},()=>{i.innerHTML=`🔊 Listen`},e=>{console.error(`Hero voice error`,e),i.innerHTML=`🔊 Listen`}))})}},B={render(e=`story`){return`
      <div class="mode-navigation-bar" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-default); padding-bottom: var(--space-4); margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4);">
        <h2 class="text-tiny text-muted" style="text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin: 0;">Mode Telemetry</h2>
        <div class="mode-switches-container" style="display: flex; gap: 4px; background: var(--bg-secondary); border: 1px solid var(--border-default); border-radius: var(--radius-full); padding: 4px; overflow-x: auto; max-width: 100%;">
          ${[{id:`story`,label:`Story Mode`,icon:`📚`},{id:`learn`,label:`Learn Mode`,icon:`🧠`},{id:`diagram`,label:`Diagram Mode`,icon:`📊`},{id:`quiz`,label:`Quiz Mode`,icon:`🎯`},{id:`explore`,label:`Explore Mode`,icon:`🧭`}].map(t=>`
            <button 
              data-mode="${t.id}" 
              class="btn btn-sm ${e===t.id?`btn-primary`:`btn-ghost`}"
              style="border-radius: var(--radius-full); white-space: nowrap;"
            >
              <span style="margin-right: 4px;">${t.icon}</span>${t.label}
            </button>
          `).join(``)}
        </div>
      </div>
    `},bindEvents(e){document.querySelectorAll(`.mode-switches-container button`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.getAttribute(`data-mode`);document.querySelectorAll(`.mode-switches-container button`).forEach(e=>{e.classList.remove(`btn-primary`),e.classList.add(`btn-ghost`)}),t.classList.add(`btn-primary`),t.classList.remove(`btn-ghost`),e&&e(n)})})}},V={render(e,t){return!e||e.length===0?`<p class="text-secondary">No story panels generated.</p>`:`
      <div class="story-mode-container" style="max-width: var(--content-max); margin: 0 auto; padding-top: var(--space-2);">
        ${e.map((t,n)=>{let r=n===e.length-1,i=String(t.id).padStart(2,`0`),a=`speech-bubble`;t.style.includes(`narrator`)?a=`speech-bubble narrator`:t.style.includes(`fact-card`)?a=`fact-card`:(t.style.includes(`highlight-card`)||t.style.includes(`example-card`))&&(a=`highlight-card`);let o=``;return t.hasNavButtons&&(o=`
          <div style="display: flex; gap: var(--space-3); margin-top: var(--space-4); flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.topicPageInstance.switchMode('learn')">Learn Mode</button>
            <button class="btn btn-secondary btn-sm" onclick="window.topicPageInstance.switchMode('diagram')">Diagram Mode</button>
            <button class="btn btn-primary btn-sm" onclick="window.topicPageInstance.switchMode('quiz')">Take Quiz</button>
          </div>
        `),`
        <div class="story-panel reveal animate-fade-up" data-panel="${t.id}">
          <div class="panel-header">
            <span class="panel-number">${i}</span>
            <span class="panel-character">${t.character}</span>
            <h3 class="panel-title text-h3">${t.title}</h3>
          </div>
          <div class="panel-body">
            <div class="${a}">
              <p class="text-body">${t.text}</p>
              ${o}
            </div>
          </div>
          ${r?``:`<div class="panel-connector">▼</div>`}
        </div>
      `}).join(``)}
      </div>
    `},bindEvents(){l.initScrollReveal()}};function H(e,t,n,r,i,a){e.strokeStyle=`rgba(6, 182, 212, 0.05)`,e.lineWidth=.5;for(let r=0;r<t;r+=30)e.beginPath(),e.moveTo(r,0),e.lineTo(r,n),e.stroke();for(let r=0;r<n;r+=30)e.beginPath(),e.moveTo(0,r),e.lineTo(t,r),e.stroke();let o=r*1.5%n;e.strokeStyle=`rgba(6, 182, 212, 0.08)`,e.lineWidth=2,e.beginPath(),e.moveTo(0,o),e.lineTo(t,o),e.stroke(),e.strokeStyle=`rgba(6, 182, 212, 0.3)`,e.lineWidth=1,e.beginPath(),e.moveTo(15,30),e.lineTo(15,15),e.lineTo(30,15),e.stroke(),e.beginPath(),e.moveTo(t-30,15),e.lineTo(t-15,15),e.lineTo(t-15,30),e.stroke(),e.beginPath(),e.moveTo(15,n-30),e.lineTo(15,n-15),e.lineTo(30,n-15),e.stroke(),e.beginPath(),e.moveTo(t-30,n-15),e.lineTo(t-15,n-15),e.lineTo(t-15,n-30),e.stroke(),e.font=`700 12px var(--font-mono, monospace)`,e.fillStyle=`rgba(6, 182, 212, 0.8)`,e.fillText(`SYSTEM: AI SYNTHESIZER`,25,30),e.font=`400 9px var(--font-mono, monospace)`,e.fillStyle=`rgba(167, 139, 250, 0.6)`,e.fillText(`TARGET: ${i.toUpperCase()}`,25,45),e.fillText(`SECTOR: ${a.toUpperCase()}`,25,58),e.fillStyle=`rgba(6, 182, 212, 0.5)`,e.fillText(`COORD: ${Math.sin(r*.01).toFixed(4)}`,t-120,30),e.fillText(`BUFF: NOMINAL`,t-120,42)}function ve(e,t,n,r,i,a=!1){a||(e.fillStyle=`#030307`,e.fillRect(0,0,t,n)),H(e,t,n,r,i,`Cosmic Telemetry`);let o=t/2,s=n/2+10;for(let t=0;t<4;t++){let n=140-t*25,i=45-t*8,a=r*(.01+t*.005);e.strokeStyle=t===0?`rgba(245, 158, 11, 0.4)`:`rgba(124, 58, 237, 0.2)`,e.lineWidth=2-t*.3,e.save(),e.translate(o,s),e.rotate(a),e.beginPath(),e.ellipse(0,0,n,i,0,0,Math.PI*2),e.stroke();for(let a=0;a<6;a++){let o=a*Math.PI*2/6+r*.01,s=n*Math.cos(o),c=i*Math.sin(o);e.fillStyle=t%2==0?`#22d3ee`:`#fb7185`,e.beginPath(),e.arc(s,c,3-t*.5,0,Math.PI*2),e.fill()}e.restore()}let c=e.createRadialGradient(o,s,5,o,s,32);c.addColorStop(0,`#000000`),c.addColorStop(.3,`#000000`),c.addColorStop(.6,`#f59e0b`),c.addColorStop(.8,`rgba(124, 58, 237, 0.4)`),c.addColorStop(1,`transparent`),e.fillStyle=c,e.beginPath(),e.arc(o,s,35,0,Math.PI*2),e.fill()}function ye(e,t,n,r,i,a=!1){a||(e.fillStyle=`#030307`,e.fillRect(0,0,t,n)),H(e,t,n,r,i,`Genetic Synthesis`);let o=t/2,s=n/2+10;for(let t=0;t<12;t++){let n=t/12*180-90,i=t*.45+r*.035,a=o+Math.sin(i)*70,c=o-Math.sin(i)*70,l=s+n;e.strokeStyle=`rgba(255, 255, 255, 0.15)`,e.lineWidth=1.5,e.beginPath(),e.moveTo(a,l),e.lineTo(c,l),e.stroke(),e.fillStyle=`#10b981`,e.beginPath(),e.arc(a,l,6,0,Math.PI*2),e.fill(),e.fillStyle=`rgba(16, 185, 129, 0.3)`,e.beginPath(),e.arc(a,l,10,0,Math.PI*2),e.fill(),e.fillStyle=`#3b82f6`,e.beginPath(),e.arc(c,l,6,0,Math.PI*2),e.fill(),e.fillStyle=`rgba(59, 130, 246, 0.3)`,e.beginPath(),e.arc(c,l,10,0,Math.PI*2),e.fill()}e.strokeStyle=`rgba(34, 211, 238, 0.2)`,e.lineWidth=1,e.beginPath(),e.arc(450,150+Math.sin(r*.02)*10,15,0,Math.PI*2),e.stroke(),e.beginPath(),e.arc(150,280+Math.cos(r*.025)*15,8,0,Math.PI*2),e.stroke()}function be(e,t,n,r,i,a=!1){a||(e.fillStyle=`rgba(3, 3, 7, 0.3)`,e.fillRect(0,0,t,n)),H(e,t,n,r,i,`Neural Matrix Network`);let o=t/2,s=n/2+10,c=[{x:o,y:s,label:`CORE`},{x:o-120,y:s-60,label:`DATA`},{x:o+120,y:s-60,label:`SYS`},{x:o-120,y:s+60,label:`NET`},{x:o+120,y:s+60,label:`MEM`}];e.strokeStyle=`rgba(167, 139, 250, 0.2)`,e.lineWidth=1.5,e.beginPath();for(let t=1;t<c.length;t++)e.moveTo(c[0].x,c[0].y),e.lineTo(c[t].x,c[t].y);e.stroke(),c.forEach((t,n)=>{if(n>0){let i=(r*.015+n*.25)%1,a=c[0].x+(t.x-c[0].x)*i,o=c[0].y+(t.y-c[0].y)*i;e.fillStyle=`#22d3ee`,e.beginPath(),e.arc(a,o,4,0,Math.PI*2),e.fill()}e.fillStyle=`#09090e`,e.strokeStyle=n===0?`#a78bfa`:`#34d399`,e.lineWidth=2,e.beginPath(),e.arc(t.x,t.y,16,0,Math.PI*2),e.fill(),e.stroke(),e.font=`700 8px var(--font-mono)`,e.fillStyle=`#ffffff`,e.textBaseline=`middle`,e.textAlign=`center`,e.fillText(t.label,t.x,t.y)}),e.textAlign=`left`}function xe(e,t,n,r,i,a=!1){a||(e.fillStyle=`#030307`,e.fillRect(0,0,t,n)),H(e,t,n,r,i,`Quantum Mechanics`);let o=t/2,s=n/2+10;e.fillStyle=`#f43f5e`;for(let t=0;t<5;t++){let n=o+Math.sin(r*.05+t*72)*5,i=s+Math.cos(r*.05+t*36)*5;e.beginPath(),e.arc(n,i,t%2==0?5:6,0,Math.PI*2),e.fill()}[{rx:110,ry:40,rot:Math.PI/6,speed:.02,color:`#22d3ee`},{rx:140,ry:50,rot:-Math.PI/4,speed:.015,color:`#a78bfa`},{rx:160,ry:30,rot:Math.PI/2,speed:.025,color:`#fb7185`}].forEach(t=>{e.strokeStyle=`rgba(255, 255, 255, 0.1)`,e.lineWidth=1,e.save(),e.translate(o,s),e.rotate(t.rot),e.beginPath(),e.ellipse(0,0,t.rx,t.ry,0,0,Math.PI*2),e.stroke();let n=t.rx*Math.cos(r*t.speed),i=t.ry*Math.sin(r*t.speed);e.fillStyle=t.color,e.beginPath(),e.arc(n,i,5,0,Math.PI*2),e.fill(),e.restore()})}function Se(e,t,n,r,i,a=!1){a||(e.fillStyle=`#030307`,e.fillRect(0,0,t,n)),H(e,t,n,r,i,`Universal Schematic`);let o=t/2,s=n/2+10;e.strokeStyle=`rgba(6, 182, 212, 0.15)`,e.lineWidth=1;for(let t=1;t<5;t++){let n=100*Math.sin(t/5*Math.PI-Math.PI/2),i=100*Math.cos(t/5*Math.PI-Math.PI/2);e.beginPath(),e.ellipse(o,s+n,i,i*.25,r*.005,0,Math.PI*2),e.stroke()}for(let t=0;t<6;t++){let n=t*Math.PI/6+r*.003;e.beginPath(),e.ellipse(o,s,100*Math.sin(n),100,0,0,Math.PI*2),e.stroke()}e.fillStyle=`rgba(6, 182, 212, 0.4)`,e.beginPath(),e.arc(o,s,8+Math.sin(r*.05)*3,0,Math.PI*2),e.fill()}function Ce(e,t,n,r,i,a=`details`,o){S.stop();let s=document.createElement(`div`);s.className=`deep-dive-overlay`,s.id=`deep-dive-portal-overlay`;let c=[`see also`,`references`,`further reading`,`external links`,`notes`,`bibliography`,`sources`,`indexes`],l=n.filter(e=>e.toclevel===1&&!c.includes(e.line.toLowerCase())),u=(r?.items||[]).filter(e=>e.type===`image`&&e.showInGallery).map(e=>{let t=e.srcset?.[e.srcset.length-1]?.src||e.src,n=t.startsWith(`//`)?`https:${t}`:t;return{title:e.title.replace(`File:`,``).replace(/_/g,` `),src:n,caption:e.caption?.text||e.title.replace(`File:`,``).replace(/_/g,` `)}}),d=l.map((e,t)=>`
    <button class="deep-dive-section-item ${t===0?`active`:``}" data-index="${e.index}" data-title="${e.line}">
      ${e.number?e.number+`. `:``}${e.line}
    </button>
  `).join(``),f=``;f=u.length===0?`
      <div style="grid-column: 1/-1; text-align: center; padding: var(--space-12); color: var(--text-secondary);">
        <span style="font-size: 3rem; display: block; margin-bottom: var(--space-4);">📷</span>
        <h3 style="color: var(--text-primary);">No Archive Photos Found</h3>
        <p style="font-size: 0.9rem; margin-top: 4px;">There are no gallery footages available for this topic in the archive.</p>
      </div>
    `:u.map(e=>`
      <div class="media-footage-card" data-src="${e.src}" data-caption="${e.caption.replace(/"/g,`&quot;`)}">
        <img src="${e.src}" alt="${e.title}" loading="lazy" />
        <div class="media-footage-caption">${e.title}</div>
      </div>
    `).join(``);let p=``;i.forEach(e=>{let t=e.title.replace(/\.[a-zA-Z0-9]+$/,``).replace(/"/g,`&quot;`),n=e.thumbnail?`background-image: url('${e.thumbnail}'); background-size: cover; background-position: center;`:``;p+=`
      <div class="video-footage-card" data-src="${e.url}" data-mime="${e.mime}" data-title="${t}" title="${t}">
        <div class="video-card-thumbnail" style="${n}">
          <div style="position: absolute; inset: 0; background: rgba(10,10,15,0.45); display: flex; align-items: center; justify-content: center; z-index: 1;">
            <span class="play-icon" style="text-shadow: 0 0 10px rgba(0,0,0,0.8);">▶</span>
          </div>
        </div>
        <div class="video-card-title">${t}</div>
      </div>
    `}),s.innerHTML=`
    <div class="deep-dive-modal">
      <!-- Header -->
      <div class="deep-dive-header">
        <div style="display: flex; flex-direction: column;">
          <span class="text-tiny text-mono" style="color: var(--accent-cyan); font-weight: 700; letter-spacing: 0.1em;">DEEP DIVE PORTAL</span>
          <h2 style="margin: 0; font-size: 1.4rem; color: #ffffff;">${e}</h2>
        </div>
        <button id="deep-dive-close" class="btn btn-ghost btn-sm" style="border-radius: var(--radius-full); font-size: 1.25rem; width: 40px; height: 40px; padding: 0;">✕</button>
      </div>

      <!-- Tabs -->
      <div class="deep-dive-tabs">
        <button class="deep-dive-tab-btn ${a===`details`?`active`:``}" data-tab="details">📄 Advanced Details</button>
        <button class="deep-dive-tab-btn ${a===`footage`?`active`:``}" data-tab="footage">📷 Real Footage (${u.length})</button>
        <button class="deep-dive-tab-btn ${a===`videos`?`active`:``}" data-tab="videos">🎥 Real Videos (${i.length})</button>
      </div>

      <!-- Body -->
      <div class="deep-dive-body">
        <!-- Tab 1: Details -->
        <div class="deep-dive-tab-content ${a===`details`?`active`:``}" id="tab-details">
          <div class="deep-dive-split">
            <!-- Sidebar -->
            <div class="deep-dive-sidebar">
              ${d}
            </div>
            <!-- Content Pane -->
            <div class="deep-dive-content-pane" id="deep-dive-content">
              <div id="section-loading" style="display: none; justify-content: center; align-items: center; height: 100%; width: 100%;">
                <span class="text-secondary" style="font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                  ⏳ Loading section content...
                </span>
              </div>
              <div id="section-body-wrapper" style="position: relative; width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-default); padding-bottom: var(--space-4); margin-bottom: var(--space-4); gap: var(--space-4);">
                  <h3 id="active-section-title" style="margin: 0; font-size: 1.5rem; color: var(--accent-cyan);">Loading...</h3>
                  <button id="modal-speak-btn" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full); display: flex; align-items: center; gap: 6px; font-weight: 600; white-space: nowrap;">
                    🔊 Listen Section
                  </button>
                </div>
                <div id="active-section-html" class="text-body text-secondary" style="font-size: 1.02rem; line-height: 1.8;">
                  Please select a section from the sidebar to inspect advanced data.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Footage -->
        <div class="deep-dive-tab-content ${a===`footage`?`active`:``}" id="tab-footage">
          <div class="media-footage-grid">
            ${f}
          </div>
        </div>

        <!-- Tab 3: Videos -->
        <div class="deep-dive-tab-content ${a===`videos`?`active`:``}" id="tab-videos" style="flex-direction: column; overflow: hidden;">
          <!-- AI video header banner -->
          <div style="padding: var(--space-4) var(--space-6); background: rgba(124, 58, 237, 0.08); border-bottom: 1px solid var(--border-default); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-shrink: 0; z-index: 10;">
            <div style="display: flex; flex-direction: column;">
              <h4 style="margin: 0; color: var(--accent-violet); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">✨ AI Video Synthesis Engine</h4>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">Synthesize a high-fidelity animated telemetry simulation for this topic.</p>
            </div>
            <button id="synthesize-video-btn" class="btn btn-primary btn-sm" style="font-weight: 700;">
              ✨ Synthesize AI Video
            </button>
          </div>

          <!-- Video grid (default view) -->
          <div class="video-footage-grid" id="videos-default-view" style="flex: 1;">
            ${p}
          </div>

          <!-- AI Synthesizer view (hidden by default) -->
          <div class="synthesis-container" id="synthesis-workspace" style="display: none; flex: 1;">
            <!-- Left Canvas pane -->
            <div class="synthesis-canvas-pane">
              <canvas id="synthesis-canvas"></canvas>
              <div style="position: absolute; bottom: 20px; left: 20px; display: flex; gap: 10px; z-index: 10;">
                <button id="synthesis-stop-btn" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full); font-weight: 700; background: rgba(30, 30, 42, 0.85); backdrop-filter: blur(4px);">
                  ⏹️ Exit Simulator
                </button>
              </div>
              <div id="synthesis-telemetry-indicator" style="position: absolute; top: 20px; right: 20px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-cyan); text-shadow: 0 0 5px rgba(6,182,212,0.5);">
                ● ENGINE ACTIVE | FPS: 60
              </div>
            </div>

            <!-- Right Telemetry log console -->
            <div class="synthesis-console-pane">
              <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
                <div style="display: flex; flex-direction: column; overflow: hidden; height: calc(100% - 60px);">
                  <div class="synthesis-log-title">⚙️ SYSTEM LOG</div>
                  <div class="synthesis-logs" id="synthesis-console-logs"></div>
                </div>
                <div class="synthesis-telemetry">
                  <div>
                    <span style="display: block; color: var(--text-muted); font-size: 0.6rem;">GRID MATRIX</span>
                    <span style="color: var(--accent-violet);" id="matrix-coord">0.0.0</span>
                  </div>
                  <div>
                    <span style="display: block; color: var(--text-muted); font-size: 0.6rem;">RENDER BUFFER</span>
                    <span style="color: var(--accent-emerald);">OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,document.body.appendChild(s),document.body.style.overflow=`hidden`;let m=null,h=!1;function g(){h=!1,m&&=(cancelAnimationFrame(m),null),S.stop();let e=s.querySelector(`#synthesis-workspace`),t=s.querySelector(`#videos-default-view`),n=s.querySelector(`#synthesize-video-btn`);e&&t&&(e.style.display=`none`,t.style.display=`grid`),n&&(n.innerText=`✨ Synthesize AI Video`,n.disabled=!1)}function _(){S.stop(),h=!0;let n=s.querySelector(`#synthesis-workspace`),r=s.querySelector(`#videos-default-view`),i=s.querySelector(`#synthesize-video-btn`);n&&r&&(r.style.display=`none`,n.style.display=`grid`),i&&(i.innerText=`✨ COMPILING SIMULATION...`,i.disabled=!0);let a=u||[],c=[];a.slice(0,6).forEach(e=>{let t=new Image;t.crossOrigin=`anonymous`,t.src=e.src,t.onload=()=>c.push(t)});let l=[`WonderVerse AI telemetry synthesis for ${e}.`,`Definition summary: ${o?.overview||``}`,`Why this topic is important: ${o?.whyItMatters||``}`,`Operational mechanics: ${o?.howItWorks||``}`,`Real life application example: ${o?.realExamples||``}`].map(e=>e.replace(/Imagine explaining.*to a 10-year-old:/gi,``).trim()).filter(Boolean),d=s.querySelector(`#synthesis-console-logs`);if(d){d.innerHTML=``;let n=o?.keyFacts||[],r=o?.keyTerms||[],i=[`[0.00s] Initializing WonderVerse Visual Synthesis Engine...`,`[0.05s] Establishing connection to Wikipedia Core Database...`,`[0.10s] Resolving telemetry coordinates for: ${e.toUpperCase()}`,`[0.18s] Category classified: ${t.toUpperCase()}`,`[0.25s] Extracting semantic content sections...`,`[0.30s] SUMMARY: "${(o?.overview||``).slice(0,100)}..."`,`[0.38s] Generating procedural neural visualizations...`,...n.map((e,t)=>`[0.48s] EXTR_FACT_${t+1}: "${e.slice(0,110)}..."`),...r.map((e,t)=>`[0.65s] INDEX_VOCAB_${t+1}: ${e.term} - ${e.definition.slice(0,90)}`),`[0.85s] Synchronizing background voice narration...`,`[0.95s] Visual synthesis compile status: COMPLETE (60fps)`,`[1.05s] Simulation loop running in telemetry window.`],a=0;function s(){if(!h||a>=i.length)return;let e=document.createElement(`div`);e.className=`synthesis-log-line`,e.innerText=i[a],d.appendChild(e),d.scrollTop=d.scrollHeight,a++,setTimeout(s,300+Math.random()*300)}s()}let f=s.querySelector(`#synthesis-canvas`);if(f){let n=f.getContext(`2d`);f.width=600,f.height=400;let r=0;function i(){if(!h)return;if(n.fillStyle=`#030307`,n.fillRect(0,0,f.width,f.height),c.length>0){let e=c[Math.floor(r/360%c.length)];if(e&&e.complete){let t=1.05+Math.sin(r*.003)*.05,i=f.width*t,a=f.height*t,o=(f.width-i)/2+Math.cos(r*.002)*5,s=(f.height-a)/2+Math.sin(r*.002)*5;n.drawImage(e,o,s,i,a),n.fillStyle=`rgba(5, 5, 10, 0.45)`,n.fillRect(0,0,f.width,f.height)}}let a=t?t.toLowerCase():``;if(n.save(),c.length>0&&(n.globalAlpha=.5),a===`space`?ve(n,f.width,f.height,r,e,!0):a===`biology`||a===`bio`?ye(n,f.width,f.height,r,e,!0):a===`technology`||a===`tech`?be(n,f.width,f.height,r,e,!0):a===`physics`||a===`science`||a===`chemistry`?xe(n,f.width,f.height,r,e,!0):Se(n,f.width,f.height,r,e,!0),n.restore(),c.length>0&&H(n,f.width,f.height,r,e,t||`Universal`),l.length>0){let e=l[Math.floor(r/360)%l.length];if(n.fillStyle=`rgba(5, 5, 10, 0.85)`,n.strokeStyle=`rgba(6, 182, 212, 0.35)`,n.lineWidth=1,n.fillRect(20,f.height-75,f.width-40,50),n.strokeRect(20,f.height-75,f.width-40,50),n.font=`500 11px var(--font-sans, sans-serif)`,n.fillStyle=`#ffffff`,n.textAlign=`center`,e.length>75){let t=e.indexOf(` `,65),r=e.slice(0,t),i=e.slice(t).trim();n.fillText(r,f.width/2,f.height-57),n.fillText(i,f.width/2,f.height-40)}else n.fillText(e,f.width/2,f.height-48);n.textAlign=`left`}let o=s.querySelector(`#matrix-coord`);o&&r%15==0&&(o.innerText=`${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*999)}`),r++,m=requestAnimationFrame(i)}i()}let p=`Welcome to the WonderVerse AI Video Simulator for ${e}. Here is a summary of the topic: ${o?.overview||``} Why it matters: ${o?.whyItMatters||``} How it works: ${o?.howItWorks||``}`;S.speak(p,()=>{},()=>{},e=>console.log(e))}s.querySelector(`#synthesize-video-btn`)?.addEventListener(`click`,_),s.querySelector(`#synthesis-stop-btn`)?.addEventListener(`click`,g);let v=s.querySelectorAll(`.deep-dive-tab-btn`);v.forEach(e=>{e.addEventListener(`click`,()=>{v.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`);let t=e.getAttribute(`data-tab`);s.querySelectorAll(`.deep-dive-tab-content`).forEach(e=>e.classList.remove(`active`)),s.querySelector(`#tab-${t}`).classList.add(`active`),S.stop();let n=s.querySelector(`#modal-speak-btn`);n&&(n.innerHTML=`🔊 Listen Section`),t!==`videos`&&g()})});async function y(t,n){S.stop();let r=s.querySelector(`#modal-speak-btn`);r&&(r.innerHTML=`🔊 Listen Section`);let i=s.querySelector(`#deep-dive-content`),a=s.querySelector(`#section-loading`),o=s.querySelector(`#section-body-wrapper`),c=s.querySelector(`#active-section-title`),l=s.querySelector(`#active-section-html`);o.style.display=`none`,a.style.display=`flex`;let u=await k.getSectionText(e,t);a.style.display=`none`,o.style.display=`block`,c.innerText=n,l.innerHTML=u.replace(/href="\/\/en.wikipedia.org/g,`href="https://en.wikipedia.org`),i.scrollTop=0}let b=s.querySelectorAll(`.deep-dive-section-item`);b.forEach(e=>{e.addEventListener(`click`,()=>{b.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),y(e.getAttribute(`data-index`),e.getAttribute(`data-title`))})});let x=s.querySelector(`#modal-speak-btn`);x?.addEventListener(`click`,()=>{if(S.isPlaying())S.stop(),x.innerHTML=`🔊 Listen Section`;else{x.innerHTML=`⏹️ Stop`;let e=s.querySelector(`#active-section-html`).innerText;S.speak(e,()=>{x.innerHTML=`⏹️ Stop`},()=>{x.innerHTML=`🔊 Listen Section`},e=>{console.error(`Modal speaker error`,e),x.innerHTML=`🔊 Listen Section`})}}),l.length>0&&y(l[0].index,l[0].line),s.querySelectorAll(`.media-footage-card`).forEach(e=>{e.addEventListener(`click`,()=>{C(e.getAttribute(`data-src`),e.getAttribute(`data-caption`))})});function C(e,t){let n=document.createElement(`div`);n.className=`lightbox-overlay`,n.id=`deep-dive-lightbox`,n.innerHTML=`
      <button id="lightbox-close" class="btn btn-ghost" style="position: absolute; top: var(--space-6); right: var(--space-6); color: #fff; font-size: 1.5rem; width: 40px; height: 40px; padding: 0;">✕</button>
      <div class="lightbox-img-wrapper">
        <img src="${e}" alt="Lightbox zoom" />
      </div>
      <div class="lightbox-caption">${t}</div>
    `,document.body.appendChild(n);let r=()=>{n.remove()};n.addEventListener(`click`,e=>{(e.target.id===`deep-dive-lightbox`||e.target.id===`lightbox-close`)&&r()})}s.querySelectorAll(`.video-footage-card`).forEach(e=>{e.addEventListener(`click`,()=>{w(e.getAttribute(`data-src`),e.getAttribute(`data-mime`),e.getAttribute(`data-title`))})});function w(e,t,n){S.stop();let r=document.createElement(`div`);r.className=`video-lightbox-overlay`,r.id=`deep-dive-video-lightbox`,r.innerHTML=`
      <div class="video-lightbox-wrapper">
        <div style="background: var(--bg-secondary); padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--border-default); display: flex; justify-content: space-between; align-items: center;">
          <h4 style="margin: 0; font-size: 0.95rem; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 600px;">🎥 ${n}</h4>
          <button id="video-lightbox-close" class="btn btn-ghost btn-sm" style="border-radius: var(--radius-full); font-size: 1.2rem; width: 32px; height: 32px; padding: 0;">✕</button>
        </div>
        <video controls autoplay>
          <source src="${e}" type="${t}">
          Your browser does not support HTML5 video playback.
        </video>
      </div>
    `,document.body.appendChild(r);let i=()=>{let e=r.querySelector(`video`);e&&e.pause(),r.remove()};r.addEventListener(`click`,e=>{(e.target.id===`deep-dive-video-lightbox`||e.target.id===`video-lightbox-close`)&&i()})}let T=()=>{g(),S.stop(),s.remove(),document.body.style.overflow=``};s.querySelector(`#deep-dive-close`).addEventListener(`click`,T),s.addEventListener(`click`,e=>{e.target.id===`deep-dive-portal-overlay`&&T()})}var U={render(e){if(!e)return`<p class="text-secondary">No learn content generated.</p>`;let t=e.keyTerms.map(e=>`
      <div style="padding: var(--space-3); background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-md);">
        <strong style="color: var(--accent-violet); font-size: 0.95rem; display: block; margin-bottom: 2px;">${e.term}</strong>
        <p class="vocab-definition" data-term="${e.term}" style="font-size: 0.825rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">${e.definition}</p>
      </div>
    `).join(``),n=e.keyFacts.map((e,t)=>`
      <div style="padding: var(--space-3); background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: 0.85rem; line-height: 1.4; display: flex; gap: var(--space-3); align-items: flex-start;">
        <span style="color: var(--accent-cyan); font-weight: bold;">0${t+1}</span>
        <span style="color: var(--text-primary);">${e}</span>
      </div>
    `).join(``);return`
      <div class="learn-mode-container reveal animate-fade-up" style="display: grid; grid-template-columns: 1fr 340px; gap: var(--space-6); padding-top: var(--space-2);">
        <!-- Main Structured Column -->
        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          <!-- What it is -->
          <div class="card" style="border-left: 4px solid var(--accent-cyan);" id="learn-what-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); flex-wrap: wrap; gap: 10px;">
              <h3 style="color: var(--accent-cyan); margin: 0; display: flex; align-items: center; gap: 8px; font-size: 1.3rem;">
                📖 What it is
                <button class="btn btn-ghost btn-sm speak-section-btn" data-section="what" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
              </h3>
              <button id="eli10-toggle" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full);">
                👶 Explain Like I'm 10
              </button>
            </div>
            <p id="learn-what-text" class="text-body" style="margin: 0; font-size: 1.05rem;">
              ${e.overview}
            </p>
          </div>

          <!-- Why it matters -->
          <div class="card" style="border-left: 4px solid var(--accent-purple);" id="learn-why-card">
            <h3 style="color: var(--accent-purple); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              🌟 Why it matters
              <button class="btn btn-ghost btn-sm speak-section-btn" data-section="why" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
            </h3>
            <p id="learn-why-text" class="text-body" style="margin: 0;">
              ${e.whyItMatters}
            </p>
          </div>

          <!-- How it works -->
          <div class="card" style="border-left: 4px solid var(--accent-blue);" id="learn-how-card">
            <h3 style="color: var(--accent-blue); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              ⚙️ How it works
              <button class="btn btn-ghost btn-sm speak-section-btn" data-section="how" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
            </h3>
            <p id="learn-how-text" class="text-body" style="margin: 0;">
              ${e.howItWorks}
            </p>
          </div>

          <!-- Real-world examples -->
          <div class="card" style="border-left: 4px solid var(--accent-amber);" id="learn-examples-card">
            <h3 style="color: var(--accent-amber); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              🌍 Real-world Examples
              <button class="btn btn-ghost btn-sm speak-section-btn" data-section="examples" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
            </h3>
            <p id="learn-examples-text" class="text-body" style="margin: 0;">
              ${e.realExamples}
            </p>
          </div>

          <!-- Deepen Your Knowledge CTA Card -->
          <div class="card card-glow text-center reveal animate-fade-up" style="padding: var(--space-6); background: var(--gradient-hero); border-color: var(--accent-cyan); display: flex; flex-direction: column; align-items: center; gap: var(--space-3); margin-top: var(--space-4);">
            <h3 style="color: #ffffff; margin: 0; font-size: 1.3rem; display: flex; align-items: center; gap: var(--space-2);">
              🧠 Deepen Your Knowledge
            </h3>
            <p class="text-body text-secondary" style="font-size: 0.92rem; max-width: 500px; margin: 0; line-height: 1.5;">
              Unlock advanced breakdowns, deep subsections, archive photo galleries, and real footage educational videos.
            </p>
            <div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; margin-top: var(--space-2);">
              <button id="learn-know-more-btn" class="btn btn-primary" style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; border-radius: var(--radius-md);">
                <span>🔍 Know More & Real Footage</span>
              </button>
              <button id="learn-watch-videos-btn" class="btn btn-secondary" style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; border-radius: var(--radius-md); border-color: var(--accent-purple); color: var(--accent-violet);">
                <span>🎥 Watch Real Videos</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          <!-- Key Facts -->
          <div class="card" style="padding: var(--space-5);">
            <h4 class="text-h3" style="color: var(--accent-cyan); margin-top: 0; margin-bottom: var(--space-4);">💡 Key Facts</h4>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${n}
            </div>
          </div>

          <!-- Key Terms -->
          <div class="card" style="padding: var(--space-5);">
            <h4 class="text-h3" style="color: var(--accent-violet); margin-top: 0; margin-bottom: var(--space-4);">🔑 Vocabulary</h4>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${t}
            </div>
          </div>
        </div>
      </div>
    `},bindEvents(e){l.initScrollReveal();let t=!1,n=document.getElementById(`eli10-toggle`);document.getElementById(`learn-what-text`),document.getElementById(`learn-what-card`),n?.addEventListener(`click`,()=>{S.stop(),document.querySelectorAll(`.speak-section-btn`).forEach(e=>{e.innerHTML=`🔊`,e.classList.remove(`speaking`)}),t=!t;let r=document.getElementById(`learn-what-text`),i=document.getElementById(`learn-why-text`),a=document.getElementById(`learn-how-text`),o=document.getElementById(`learn-examples-text`),s=document.getElementById(`learn-what-card`),c=document.getElementById(`learn-why-card`),l=document.getElementById(`learn-how-card`),u=document.getElementById(`learn-examples-card`);t?(n.innerHTML=`⭐ Standard Mode`,n.style.background=`var(--accent-amber)`,n.style.color=`#000`,n.style.boxShadow=`0 0 12px rgba(245, 158, 11, 0.4)`,s&&(s.style.borderColor=`var(--accent-amber)`),c&&(c.style.borderColor=`var(--accent-amber)`),l&&(l.style.borderColor=`var(--accent-amber)`),u&&(u.style.borderColor=`var(--accent-amber)`),r&&(r.innerHTML=`<span style="color: var(--accent-amber); font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">👶 ELI10 • SIMPLE SUMMARY</span>${e.eli10_overview}`),i&&(i.innerHTML=`<span style="color: var(--accent-amber); font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">👶 ELI10 • WHY IT MATTERS</span>${e.eli10_whyItMatters}`),a&&(a.innerHTML=`<span style="color: var(--accent-amber); font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">👶 ELI10 • HOW IT WORKS</span>${e.eli10_howItWorks}`),o&&(o.innerHTML=`<span style="color: var(--accent-amber); font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">👶 ELI10 • REAL WORLD EXAMPLE</span>${e.eli10_realExamples}`)):(n.innerHTML=`👶 Explain Like I'm 10`,n.style.background=``,n.style.color=``,n.style.boxShadow=``,s&&(s.style.borderColor=`var(--accent-cyan)`),c&&(c.style.borderColor=`var(--accent-purple)`),l&&(l.style.borderColor=`var(--accent-blue)`),u&&(u.style.borderColor=`var(--accent-amber)`),r&&(r.innerText=e.overview),i&&(i.innerText=e.whyItMatters),a&&(a.innerText=e.howItWorks),o&&(o.innerText=e.realExamples))});let r=document.querySelectorAll(`.speak-section-btn`);r.forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.getAttribute(`data-section`),i=``;n===`what`?i=`learn-what-text`:n===`why`?i=`learn-why-text`:n===`how`?i=`learn-how-text`:n===`examples`&&(i=`learn-examples-text`);let a=document.getElementById(i);if(a){if(e.classList.contains(`speaking`)){S.stop();return}r.forEach(e=>{e.innerHTML=`🔊`,e.classList.remove(`speaking`)}),e.innerHTML=`⏹️`,e.classList.add(`speaking`),S.speak(a.innerText,()=>{e.innerHTML=`⏹️`,e.classList.add(`speaking`)},()=>{e.innerHTML=`🔊`,e.classList.remove(`speaking`)},t=>{console.error(`Section voice error`,t),e.innerHTML=`🔊`,e.classList.remove(`speaking`)})}})});let i=document.getElementById(`learn-know-more-btn`),a=document.getElementById(`learn-watch-videos-btn`);async function o(t){let n=window.topicPageInstance?.title||``,r=window.topicPageInstance?.category||``;if(!n)return;let o=t===`videos`?a:i,s=o.innerHTML;o.disabled=!0,o.innerHTML=`<span>⏳ Loading Deep Portal...</span>`;try{let[i,a,c]=await Promise.all([k.getSections(n),k.getMediaList(n),k.getVideos(n,r)]);if(o.disabled=!1,o.innerHTML=s,!i||i.length===0){alert(`Could not load advanced sections for this topic.`);return}Ce(n,r,i,a,c,t,e)}catch(e){console.error(`Deep dive loading failed`,e),o.disabled=!1,o.innerHTML=s,alert(`Failed to access deep dive database. Please check connection.`)}}i?.addEventListener(`click`,()=>o(`details`)),a?.addEventListener(`click`,()=>o(`videos`)),document.querySelectorAll(`.vocab-definition`).forEach(async e=>{let t=e.getAttribute(`data-term`);if(t)try{let n=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(t.toLowerCase())}`);if(n.ok){let t=(await n.json())[0]?.meanings?.[0]?.definitions?.[0]?.definition;t&&(e.innerText=t)}}catch{}})}},W={show(e,t=`success`){let n=document.getElementById(`toast-container`);n||(n=document.createElement(`div`),n.id=`toast-container`,n.style.position=`fixed`,n.style.bottom=`24px`,n.style.right=`24px`,n.style.display=`flex`,n.style.flexDirection=`column`,n.style.gap=`10px`,n.style.zIndex=`1000`,document.body.appendChild(n));let r=document.createElement(`div`);r.className=`card card-elevated animate-scale`;let i={success:`var(--accent-emerald)`,info:`var(--accent-purple)`,warning:`var(--accent-amber)`,error:`var(--accent-rose)`},a={success:`✓`,info:`⚡`,warning:`⚠️`,error:`❌`};r.style.background=`var(--bg-elevated)`,r.style.borderLeft=`4px solid ${i[t]||i.info}`,r.style.padding=`10px 18px`,r.style.borderRadius=`var(--radius-md)`,r.style.display=`flex`,r.style.alignItems=`center`,r.style.gap=`10px`,r.style.boxShadow=`var(--shadow-card)`,r.style.fontSize=`0.85rem`,r.innerHTML=`
      <span style="color: ${i[t]||i.info}; font-weight: bold; font-size: 1rem;">${a[t]||a.info}</span>
      <div>
        <p style="margin: 0; color: var(--text-primary); font-weight: 500;">${e}</p>
      </div>
    `,n.appendChild(r),setTimeout(()=>{r.style.opacity=`0`,r.style.transform=`translateY(10px)`,r.style.transition=`all 0.3s ease`,setTimeout(()=>r.remove(),300)},3e3)},showAchievement(e){let t=document.getElementById(`badge-toast`),n=document.getElementById(`badge-toast-title`),r={"space-rookie":`Space Rookie 🌌`,"science-explorer":`Science Explorer 🧪`,"history-hunter":`History Hunter 🏛️`,"diagram-master":`Diagram Master 🎛️`,"quiz-warrior":`Quiz Warrior 🎯`,"story-finisher":`Story Finisher 📚`,"knowledge-collector":`Knowledge Collector 👑`};if(t&&n){n.innerText=r[e]||e.replace(`-`,` `).toUpperCase(),t.classList.add(`active`);try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createOscillator(),r=e.createGain();t.connect(r),n.connect(r),r.connect(e.destination),t.type=`sine`,n.type=`triangle`;let i=e.currentTime;t.frequency.setValueAtTime(523.25,i),t.frequency.setValueAtTime(659.25,i+.12),t.frequency.setValueAtTime(783.99,i+.24),n.frequency.setValueAtTime(261.63,i),n.frequency.setValueAtTime(329.63,i+.12),r.gain.setValueAtTime(.12,i),r.gain.exponentialRampToValueAtTime(.01,i+.45),t.start(i),n.start(i),t.stop(i+.5),n.stop(i+.5)}catch(e){console.warn(`Web Audio chime failed`,e)}setTimeout(()=>{t.classList.remove(`active`)},4500)}}},G={render(e,t,n){return`
      <div class="diagram-mode-container reveal animate-fade-up" style="display: grid; grid-template-columns: 1fr 340px; gap: var(--space-6); padding-top: var(--space-2);">
        <!-- SVG Viewport Box -->
        <div class="card" style="padding: var(--space-4); display: flex; justify-content: center; align-items: center; background: #0c0c14; border: 1px solid var(--border-default); overflow: hidden; min-height: 400px; border-radius: var(--radius-lg);">
          <div id="svg-viewport" style="width: 100%; height: auto;">
            ${e}
          </div>
        </div>

        <!-- Diagram Telemetry / Sidebar details -->
        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          <div class="card" style="padding: var(--space-5); display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            <div>
              <span class="text-tiny text-accent" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Dynamic Telemetry</span>
              <h3 class="text-h2" style="margin-top: var(--space-2); margin-bottom: var(--space-4); font-size: 1.3rem;">
                ${t} Schema
              </h3>
              
              <div id="diagram-explain" class="card" style="background: var(--bg-secondary); border-color: var(--border-default); padding: var(--space-4); min-height: 160px; font-size: 0.9rem; line-height: 1.5;">
                <p style="color: var(--text-secondary); text-align: center; margin-top: var(--space-8);">
                  Tap on any branch node in the diagram to inspect its conceptual properties.
                </p>
              </div>
            </div>

            <div style="margin-top: var(--space-6); display: flex; gap: var(--space-3);">
              <button id="diagram-save-btn" class="btn btn-secondary btn-sm" style="width: 100%; justify-content: center;">
                ${o.isFavorite(t,`diagrams`)?`★ Saved Diagram`:`☆ Save Diagram`}
              </button>
            </div>
          </div>
        </div>
      </div>
    `},bindEvents(e,t,n){l.initScrollReveal();let r=document.getElementById(`diagram-save-btn`);r?.addEventListener(`click`,()=>{let t=o.toggleFavorite(e,`diagrams`);r.innerText=t?`★ Saved Diagram`:`☆ Save Diagram`,W.show(t?`Diagram saved to library!`:`Diagram removed from library.`)});let i=M.splitSentences(t),a=i[0]||`${e} is a key topic of investigation.`,s=i[1]||`Further research on ${e} helps explain its mechanisms.`,c=i[2]||`Its applications are observed across various domains.`,u=i[3]||`A deeper breakdown reveals how its core components interact.`,d=M.extractKeywords(t,5),f={center:`${e} is the central hub of this concept map. It represents the primary theme and coordinates all outer topics: ${d.join(`, `)}.`,"central-body":`${e} is the primary gravity anchor of this space model. Its structure governs the surrounding orbital paths and satellites.`,"What it is":`Definition and Core Concept: ${a} It establishes the primary definition and parameters of the topic.`,"Why it matters":`Significance & Relevance: ${e} plays an important role because it connects multiple theoretical and practical concepts. ${s}`,"Key facts":`Key observations, metrics, and parameters: ${d.slice(0,3).join(`, `)||`Complex and multifaceted`}. These are key identifiers used by experts in the field.`,"Real examples":`Real-World Application: We see this in practice where: ${c} It forms the foundation of real world applications.`,"Related concepts":`Related Concepts & Domains: Major connected studies include ${d.slice(3,5).join(`, `)||`Various related fields`}. These fields share structural or functional traits.`,"Explore further":`Future Scope & Advanced Exploration: ${u} Researchers are investigating these areas to expand our knowledge base.`,"Core Star / Planet":`Core celestial body representing ${e}. Its mass, density, and magnetic properties dictate coordinates for all surrounding paths.`,"Atmosphere / Ring":`Atmosphere and rings surrounding the core: ${a}`,"Satellite Orbit":`Outer satellite orbits containing lunar or synthetic observers: ${s}`,"Cosmic Influence":`Deep space magnetic vectors and radiation belts: ${c}`,"Legacy / Records":`Observational telemetry and historical catalog entries: ${u}`,"System Head":`Primary system controller representing ${e}. It processes inputs and regulates other nodes.`,"Structural Core":`Core structural anatomy: ${a}`,"Motor Functions":`Neural signals and physical movement control: ${s}`,"Energy Conversion":`Metabolism and energy synthesis: ${c}`,"Regulation loops":`Homeostasis regulation: ${u}`,"Origin / Genesis":`Initial inception phase of ${e}: ${a}`,"Growth / Expansion":`Second phase, detailing expansion and integration: ${s}`,"Zenith / Peak":`Peak level of development and peak system influence: ${c}`,"Legacy / Impact":`Final legacy phase, detailing the lasting historical impact: ${u}`,"Data Source":`System input hub for ${e}. Receives incoming raw data packages.`,"Processing core":`Main processing block: ${a}`,"Security firewall":`Security gateway: ${s}`,"Telemetry logs":`Logging console that monitors outputs: ${c}`,"User Client":`Client UI layout: ${u}`,"Step 1: Evaporation":`Phase 1 (Evaporation): ${a}`,"Step 2: Condensation":`Phase 2 (Condensation): ${s}`,"Step 3: Precipitation":`Phase 3 (Precipitation): ${c}`,"Step 4: Collection":`Phase 4 (Collection): ${u}`,"Step 5: Regeneration":`Phase 5 (Regeneration): Regeneration cycle restoring the core state of ${e}.`,"Mass Object":`Mass Object: The central body representing the core mass of ${e}. Under acceleration due to the balanced sum of external vectors.`,"FN: Normal Force":`Normal Force (FN): Support vector perpendicular to the surface, counteracting gravity: ${a}`,"FG: Gravitational Pull":`Gravitational Force (FG): Force pulling the mass down toward the planet center: ${s}`,"FA: Applied Force":`Applied Force (FA): Direct energy application pushing the mass object forward: ${c}`,"FF: Friction Resistance":`Friction Resistance (FF): Opposing force resisting movement along the surface: ${u}`,Producers:`Producers: Businesses and agents that supply goods and services. They consume capital to run operations for ${e}: ${a}`,Consumers:`Consumers: Individuals and markets that purchase goods and services. They supply labor and financial capital, driving demand: ${s}`,"Goods flow":`Goods & Services Flow: Shows the transfer of physical products, digital items, or expert services from Producers to Consumers: ${c}`,"Capital flow":`Financial Capital Flow: Shows the payment and money transactions returned from Consumers to Producers, funding further creation: ${u}`,"Market Telemetry":`General Flow Telemetry for ${e}: Transactional loops coordinate capital and product distributions between producers and consumers in the market.`},p=document.getElementById(`diagram-explain`);document.querySelectorAll(`.diagram-node`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-node`),n=f[t]||`Selected coordinate details for branch: ${t}.`;p&&(p.innerHTML=`
            <div style="display:flex; flex-direction:column; gap: var(--space-3); animation: fadeIn 0.25s forwards;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-default); padding-bottom:8px;">
                <h4 style="color: var(--accent-cyan); margin: 0; font-size: 1.05rem;">
                  🔍 ${t}
                </h4>
                <span style="font-size:0.65rem; font-family:var(--font-mono); color:var(--accent-emerald); background:rgba(16,185,129,0.15); padding:2px 6px; border-radius:4px; font-weight:700;">NODE NOMINAL</span>
              </div>
              <p style="color: var(--text-primary); margin: 0; line-height: 1.5; font-size: 0.875rem;">
                ${n}
              </p>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-family:var(--font-mono); font-size:0.68rem; color:var(--text-muted); border-top:1px solid var(--border-default); padding-top:8px; margin-top:4px;">
                <div>LOAD INDEX: <span style="color:var(--accent-purple)">98.4%</span></div>
                <div>CORRELATION: <span style="color:var(--accent-cyan)">ACTIVE</span></div>
              </div>
            </div>
          `)})})}},K={render(e,t=`var(--accent-purple)`){return`
      <div class="progress-bar-container" style="width: 100%; background: var(--bg-secondary); height: 8px; border-radius: var(--radius-full); overflow: hidden; border: 1px solid var(--border-default);">
        <div class="progress-bar-fill" style="width: ${e}%; background: ${t}; height: 100%; transition: width 0.3s ease; border-radius: var(--radius-full);"></div>
      </div>
    `}},q=null;function J(){q||=new(window.AudioContext||window.webkitAudioContext)}var Y={playCorrect(){try{if(J(),!q)return;q.state===`suspended`&&q.resume();let e=q.createOscillator(),t=q.createOscillator(),n=q.createGain();e.connect(n),t.connect(n),n.connect(q.destination),e.type=`sine`,t.type=`triangle`;let r=q.currentTime;e.frequency.setValueAtTime(523.25,r),e.frequency.setValueAtTime(659.25,r+.12),e.frequency.setValueAtTime(783.99,r+.24),t.frequency.setValueAtTime(261.63,r),t.frequency.setValueAtTime(329.63,r+.12),n.gain.setValueAtTime(.15,r),n.gain.exponentialRampToValueAtTime(.01,r+.4),e.start(r),t.start(r),e.stop(r+.45),t.stop(r+.45)}catch(e){console.warn(`Web Audio not supported or blocked`,e)}},playIncorrect(){try{if(J(),!q)return;q.state===`suspended`&&q.resume();let e=q.createOscillator(),t=q.createGain();e.connect(t),t.connect(q.destination),e.type=`sawtooth`;let n=q.currentTime;e.frequency.setValueAtTime(120,n),e.frequency.linearRampToValueAtTime(70,n+.3),t.gain.setValueAtTime(.18,n),t.gain.exponentialRampToValueAtTime(.01,n+.3),e.start(n),e.stop(n+.35)}catch(e){console.warn(`Web Audio not supported or blocked`,e)}}},X={currentQuestionIndex:0,userAnswers:[],questions:[],topicTitle:``,render(e,t){return this.questions=e,this.topicTitle=t,this.currentQuestionIndex=0,this.userAnswers=[],`
      <div id="quiz-workspace-inner" style="max-width: 650px; margin: 0 auto; padding-top: var(--space-2);">
        ${this.renderQuestionCard()}
      </div>
    `},renderQuestionCard(){let e=this.currentQuestionIndex,t=this.questions[e],n=Math.round(e/this.questions.length*100),r=t.options.map((e,t)=>`
      <button 
        data-index="${t}" 
        class="btn btn-secondary quiz-option-btn" 
        style="width: 100%; justify-content: flex-start; text-align: left; padding: var(--space-4); border-radius: var(--radius-lg); font-size: 0.95rem; font-weight: 500;"
      >
        <span style="font-weight: bold; margin-right: var(--space-3); color: var(--text-muted);">${String.fromCharCode(65+t)}.</span>
        ${e}
      </button>
    `).join(``);return`
      <div class="card reveal animate-fade-up" style="display: flex; flex-direction: column; gap: var(--space-5);">
        <!-- Progress Bar -->
        <div style="display: flex; flex-direction: column; gap: var(--space-2);">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">
            <span>QUESTION ${e+1} OF ${this.questions.length}</span>
            <span>${n}% COMPLETED</span>
          </div>
          ${K.render(n,`var(--accent-cyan)`)}
        </div>

        <h3 class="text-h2" style="font-size: 1.25rem; margin: 0; line-height: 1.4;">
          ${t.question}
        </h3>

        <!-- Options Container -->
        <div id="quiz-options-mount" style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${r}
        </div>

        <!-- Explanation Card (Initially hidden) -->
        <div id="quiz-explanation-mount" class="card" style="display: none; background: var(--bg-secondary); border-left: 4px solid var(--accent-cyan); padding: var(--space-4); margin-top: var(--space-2);">
          <h4 style="margin: 0 0 var(--space-2) 0; font-size: 0.95rem; color: var(--accent-cyan); font-weight: 700;">
            Explanation Telemetry
          </h4>
          <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            ${t.explanation}
          </p>
        </div>

        <!-- Action Button -->
        <div style="display: flex; justify-content: flex-end; margin-top: var(--space-2);">
          <button id="quiz-action-btn" class="btn btn-primary" style="display: none;">
            Next Question →
          </button>
        </div>
      </div>
    `},bindEvents(){this.bindQuestionEvents()},bindQuestionEvents(){let e=document.querySelectorAll(`.quiz-option-btn`),t=document.getElementById(`quiz-explanation-mount`),n=document.getElementById(`quiz-action-btn`),r=this.questions[this.currentQuestionIndex].correctIndex,i=!1;e.forEach(a=>{a.addEventListener(`click`,()=>{if(i)return;i=!0;let o=parseInt(a.getAttribute(`data-index`));this.userAnswers.push(o),e.forEach((e,t)=>{t===r?(e.style.borderColor=`var(--accent-emerald)`,e.style.background=`rgba(16, 185, 129, 0.08)`,e.style.color=`#34d399`):t===o&&(e.style.borderColor=`var(--accent-rose)`,e.style.background=`rgba(244, 63, 94, 0.08)`,e.style.color=`#fb7185`),e.style.cursor=`default`}),o===r?Y.playCorrect():Y.playIncorrect(),t&&(t.style.display=`block`),n&&(n.innerText=this.currentQuestionIndex===this.questions.length-1?`Finish Quiz`:`Next Question →`,n.style.display=`inline-flex`)})}),n?.addEventListener(`click`,()=>{this.currentQuestionIndex++;let e=document.getElementById(`quiz-workspace-inner`);this.currentQuestionIndex<this.questions.length?e&&(e.innerHTML=this.renderQuestionCard(),this.bindQuestionEvents()):this.renderSummary(e)})},renderSummary(e){let t=_e(this.questions,this.userAnswers);o.saveQuizScore(this.topicTitle,t.score),o.markChapterComplete(this.topicTitle);let n=`var(--accent-rose)`;t.percentage>=80?n=`var(--accent-emerald)`:t.percentage>=50&&(n=`var(--accent-amber)`);let r=t.results.map((e,t)=>`
      <div class="card" style="background: var(--bg-secondary); border-left: 4px solid ${e.isCorrect?`var(--accent-emerald)`:`var(--accent-rose)`}; padding: var(--space-4); margin-bottom: var(--space-4);">
        <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-2); align-items: center;">
          <span style="font-family: var(--font-mono); font-size: 0.8rem; background: ${e.isCorrect?`rgba(16,185,129,0.12)`:`rgba(244,63,94,0.12)`}; color: ${e.isCorrect?`#34d399`:`#fb7185`}; padding: 2px 8px; border-radius: 4px; font-weight: bold;">
            ${e.isCorrect?`✓ CORRECT`:`✗ INCORRECT`}
          </span>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Question ${t+1}</span>
        </div>
        <p style="font-size: 0.95rem; font-weight: 600; margin: 0 0 var(--space-2) 0; color: var(--text-primary);">${e.question}</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 6px 0;">Your answer: <strong style="color: ${e.isCorrect?`#34d399`:`#fb7185`};">${e.userAnswer||`Skipped`}</strong></p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 var(--space-3) 0;">Correct answer: <strong style="color: #34d399;">${e.correctAnswer}</strong></p>
        <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-default); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.8rem; color: var(--text-muted);">
          <strong>Explanation:</strong> ${e.explanation}
        </div>
      </div>
    `).join(``);e.innerHTML=`
      <div class="card reveal animate-fade-up" style="display: flex; flex-direction: column; gap: var(--space-6);">
        <div class="text-center" style="padding: var(--space-6) 0;">
          <span style="font-size: 3rem; display: block; margin-bottom: var(--space-3); filter: drop-shadow(0 0 10px var(--accent-amber));">
            ${t.score===this.questions.length?`👑`:`🎯`}
          </span>
          <h2 class="text-h1" style="margin: 0; font-size: 1.75rem;">Quiz Concluded</h2>
          <p style="color: var(--text-secondary); margin-top: var(--space-2); margin-bottom: var(--space-6);">
            Dynamic analysis telemetry review complete.
          </p>

          <div style="max-width: 250px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-2); align-items: center;">
            <span style="font-size: 2.25rem; font-weight: 800; color: ${n}; font-family: var(--font-sans);">
              ${t.score} / ${t.total}
            </span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">
              ${t.percentage}% SCORE ACCURACY
            </span>
            ${K.render(t.percentage,n)}
          </div>
        </div>

        <div>
          <h3 class="text-h3" style="margin-bottom: var(--space-4); color: var(--text-secondary);">Telemetry Log Review</h3>
          ${r}
        </div>

        <div style="display: flex; justify-content: center; gap: var(--space-4); margin-top: var(--space-4);">
          <button id="quiz-retry-btn" class="btn btn-primary">Retry Quiz</button>
          <a href="#/" class="btn btn-secondary">Return Portal</a>
        </div>
      </div>
    `,document.getElementById(`quiz-retry-btn`)?.addEventListener(`click`,()=>{e.innerHTML=this.render(this.questions,this.topicTitle),this.bindEvents()}),t.score===this.questions.length&&W.show(`Perfect score! 5/5 Telemetry Accuracy!`,`success`)}},Z={render(e){return`
      <div class="explore-mode-container reveal animate-fade-up" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); padding-top: var(--space-2);">
        <!-- Platform actions -->
        <div class="card" style="display: flex; flex-direction: column; justify-content: center; padding: var(--space-6);">
          <h3 class="text-h2" style="margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem;">Explore Telemetry Control</h3>
          <p class="text-body text-secondary" style="margin-bottom: var(--space-6); font-size: 0.95rem;">
            Bookmark this topic in your browser's localStorage or open external Wikipedia database coordinates.
          </p>
          
          <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
            <button id="explore-save-btn" class="btn btn-primary">
              ${o.isFavorite(e,`topics`)?`★ Saved in Library`:`☆ Save in Library`}
            </button>
            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(e.replace(/ /g,`_`))}" target="_blank" class="btn btn-secondary">
              View Wikipedia ↗
            </a>
          </div>
        </div>

        <!-- Related Topics Mount -->
        <div class="card" style="padding: var(--space-6);">
          <h3 class="text-h2" style="margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem;">Related Conceptual Coordinates</h3>
          <div id="related-topics-list" style="display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-4);">
            <p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; margin-top: var(--space-6);">
              Retrieving related coordinate chips...
            </p>
          </div>
        </div>
      </div>
    `},async bindEvents(e){l.initScrollReveal();let t=document.getElementById(`explore-save-btn`);t?.addEventListener(`click`,()=>{let n=o.toggleFavorite(e,`topics`);t.innerText=n?`★ Saved in Library`:`☆ Save in Library`,W.show(n?`Saved to library!`:`Removed from library.`)});let n=document.getElementById(`related-topics-list`);if(n)try{let t=`https://en.wikipedia.org/api/rest_v1/page/related/${encodeURIComponent(e.replace(/ /g,`_`))}`,r=await fetch(t);if(!r.ok)throw Error(`Failed to fetch related topics`);let i=(await r.json()).pages||[];if(i.length===0){n.innerHTML=`<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center;">No related topics found.</p>`;return}n.innerHTML=i.slice(0,3).map(e=>`
        <div class="card related-chip tilt-card" data-title="${e.title}" style="cursor: pointer; padding: var(--space-4); display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); border-color: var(--border-default);">
          <div style="flex: 1; min-width: 0;">
            <h5 style="color: var(--accent-cyan); font-size: 0.95rem; margin: 0 0 4px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e.title}</h5>
            <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e.description||`General topic.`}</p>
          </div>
          <span class="badge badge-default" style="font-size: 0.65rem; padding: 2px 8px; flex-shrink: 0; margin-left: 10px;">EXPLORE</span>
        </div>
      `).join(``),n.querySelectorAll(`.related-chip`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-title`);$.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g,`_`))}`)})}),l.setupTilt()}catch(e){console.warn(`Could not fetch related pages`,e),n.innerHTML=`<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center;">Related coordinates offline.</p>`}}},we={title:``,query:``,category:``,summaryData:null,generated:{},activeMode:`story`,render(e){return this.title=(e.t||``).replace(/_/g,` `),this.query=e.q||this.title,this.activeMode=e.mode||`story`,window.topicPageInstance=this,`
      <div id="topic-page-mount" class="topic-page-container" style="display: flex; flex-direction: column; gap: var(--space-6); min-height: 80vh;">
        ${A.renderTopicPageSkeleton()}
      </div>
    `},async bindEvents(e){this.title=(e.t||``).replace(/_/g,` `),this.query=e.q||this.title;let t=e.mode||`story`,n=document.getElementById(`topic-page-mount`);if(!n)return;let r=await ee(this.title,this.query);if(!r||!r.summary||r.summary.title===void 0){this.renderError(n,`Could not load topic coordinates. Please try another search.`);return}this.summaryData=r.summary,this.title=r.summary.title,this.category=p(this.title,r.summary.extract),this.generated={story:ne(this.title,r.summary.extract,this.category),learn:re(this.title,r.summary.extract,this.category),diagram:ce(this.category,{title:this.title,extract:r.summary.extract,query:this.query}),quiz:N(this.title,r.summary.extract)},n.innerHTML=`
      <!-- Hero Header Card -->
      <div id="topic-hero-container">
        ${z.render(r.summary,this.category)}
      </div>

      <!-- Mode Telemetry Tabs -->
      <div id="topic-tabs-container">
        ${B.render(t)}
      </div>

      <!-- Active Mode Workspace -->
      <div id="topic-workspace" style="position: relative; z-index: 5;"></div>
    `,z.bindEvents(r.summary),B.bindEvents(e=>{this.switchMode(e)}),this.switchMode(t),o.addRecentSearch({title:this.title,query:this.query,category:this.category,image:r.summary.thumbnail?.source})},switchMode(e){S.stop(),this.activeMode=e;let t=document.getElementById(`topic-workspace`);if(t)switch(o.saveProgress(this.title,e),e){case`story`:t.innerHTML=V.render(this.generated.story,this.title),V.bindEvents();break;case`learn`:t.innerHTML=U.render(this.generated.learn),U.bindEvents(this.generated.learn);break;case`diagram`:t.innerHTML=G.render(this.generated.diagram,this.title,this.category),G.bindEvents(this.title,this.summaryData.extract,this.category);break;case`quiz`:t.innerHTML=X.render(this.generated.quiz,this.title),X.bindEvents();break;case`explore`:t.innerHTML=Z.render(this.title),Z.bindEvents(this.title);break;default:t.innerHTML=V.render(this.generated.story,this.title),V.bindEvents();break}},renderError(e,t){e.innerHTML=`
      <div class="card text-center reveal animate-fade-up" style="max-width: 600px; margin: var(--space-10) auto; padding: var(--space-8); border-color: var(--accent-rose); display: flex; flex-direction: column; align-items: center; gap: var(--space-4);">
        <span style="font-size: 3rem;">🔮</span>
        <h3 class="text-h2" style="color: var(--accent-rose); margin: 0;">Coordinate Retrieval Error</h3>
        <p class="text-body text-secondary" style="margin: 0; line-height: 1.5;">
          ${t}
        </p>
        <button id="error-return-btn" class="btn btn-primary" style="margin-top: var(--space-2);">
          Return to Portal
        </button>
      </div>
    `,document.getElementById(`error-return-btn`)?.addEventListener(`click`,()=>{Router.navigate(``)})},destroy(){S.stop()}},Q={render(){let e=o.getFavorites(),t=e.topics||[],n=e.diagrams||[];if(t.length+n.length===0)return`
        <div class="saved-page-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; text-align: center; gap: var(--space-4); position: relative; z-index: 5;">
          <div class="card reveal animate-fade-up" style="max-width: 500px; padding: var(--space-8); display: flex; flex-direction: column; align-items: center; gap: var(--space-4);">
            <span style="font-size: 3rem; filter: drop-shadow(0 0 10px rgba(167,139,250,0.35));">🔮</span>
            <h2 class="text-h2" style="margin: 0;">Saved Library Empty</h2>
            <p class="text-body text-secondary" style="margin: 0; line-height: 1.5;">
              Explore topics using the search portal and bookmark them to sync your learning telemetry here.
            </p>
            <button id="saved-search-btn" class="btn btn-primary" style="margin-top: var(--space-2);">
              Search Topics
            </button>
          </div>
        </div>
      `;let r=``;t.length>0&&(r=`
        <div class="reveal animate-fade-up">
          <h3 class="text-h2" style="margin-bottom: var(--space-4);">★ Bookmarked Topics</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-5);">
            ${t.map(e=>{let t=p(e,``);return`
                <div class="card card-glow tilt-card fav-topic-card" data-title="${e}" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 150px;">
                  <div class="mouse-glow"></div>
                  <div>
                    <span class="badge badge-${t}">${g(t)} ${h(t)}</span>
                    <h4 class="text-h3" style="margin-top: var(--space-3); margin-bottom: 0;">${e}</h4>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 700; margin-top: var(--space-4);">
                    Open Learning Hub →
                  </span>
                </div>
              `}).join(``)}
          </div>
        </div>
      `);let i=``;return n.length>0&&(i=`
        <div class="reveal animate-fade-up" style="margin-top: var(--space-10);">
          <h3 class="text-h2" style="margin-bottom: var(--space-4);">★ Bookmarked Vector Schemas</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-5);">
            ${n.map(e=>{let t=p(e,``);return`
                <div class="card card-glow tilt-card fav-diagram-card" data-title="${e}" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 150px;">
                  <div class="mouse-glow"></div>
                  <div>
                    <span class="badge badge-${t}">${g(t)} ${h(t)}</span>
                    <h4 class="text-h3" style="margin-top: var(--space-3); margin-bottom: 0;">${e} Schema</h4>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--accent-purple); font-weight: 700; margin-top: var(--space-4);">
                    Load Diagram Vector →
                  </span>
                </div>
              `}).join(``)}
          </div>
        </div>
      `),`
      <div class="saved-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">Saved Library</h1>
          <p class="text-small text-secondary">Your bookmarked visual learning profiles cached in localStorage.</p>
        </div>

        ${r}
        ${i}
      </div>
    `},bindEvents(){l.initScrollReveal(),l.setupTilt(),document.getElementById(`saved-search-btn`)?.addEventListener(`click`,()=>{$.navigate(``)}),document.querySelectorAll(`.fav-topic-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-title`);$.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g,`_`))}`)})}),document.querySelectorAll(`.fav-diagram-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-title`);$.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g,`_`))}&mode=diagram`)})})}},Te={render(){let e=o.getProgress(),t=o.getQuizScores(),n=o.getStreak(),r=o.getLearningTime(),i=e.completedChapters?.length||0,a=Object.keys(t).length,s=0;Object.values(t).forEach(e=>s+=e);let c=a>0?Math.round(s/(a*5)*100):0,l=[12,24,Math.min(60,r),Math.min(60,a*10),Math.min(60,s*8)],u=Math.max(...l,35),d=`
      <svg viewBox="0 0 350 150" style="width:100%; height:100%; font-family:var(--font-sans);">
        <line x1="30" y1="10" x2="30" y2="120" stroke="var(--border-default)" stroke-width="1.5"/>
        <line x1="30" y1="120" x2="330" y2="120" stroke="var(--border-default)" stroke-width="1.5"/>
        <line x1="30" y1="65" x2="330" y2="65" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
        ${l.map((e,t)=>{let n=e/u*90,r=50+t*55;return`
            <rect x="${r}" y="${120-n}" width="28" height="${n}" rx="4" fill="url(#bar-grad)" style="filter: drop-shadow(0 0 4px rgba(124, 58, 237, 0.255));"/>
            <text x="${r+14}" y="135" fill="var(--text-muted)" font-size="8" text-anchor="middle" font-weight="600">${[`Day 1`,`Day 2`,`Day 3`,`Day 4`,`Day 5`][t]}</text>
          `}).join(``)}
        <defs>
          <linearGradient id="bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--accent-cyan)"/>
            <stop offset="100%" stop-color="var(--accent-purple)"/>
          </linearGradient>
        </defs>
      </svg>
    `;return`
      <div class="dashboard-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">Progress Dashboard</h1>
          <p class="text-small text-secondary">Your personal academic telemetry console.</p>
        </div>

        <!-- Metric grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);" class="reveal animate-fade-up">
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
            <span style="font-size: 2rem;">🔥</span>
            <h4 class="text-h2" style="margin: 0; font-size: 1.85rem;">${n.currentStreak}</h4>
            <p class="text-tiny text-secondary" style="font-weight: 700; text-transform: uppercase; margin: 0;">Reading Streak</p>
          </div>
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
            <span style="font-size: 2rem;">📚</span>
            <h4 class="text-h2" style="margin: 0; font-size: 1.85rem;">${i}</h4>
            <p class="text-tiny text-secondary" style="font-weight: 700; text-transform: uppercase; margin: 0;">Completed Chapters</p>
          </div>
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
            <span style="font-size: 2rem;">⏱️</span>
            <h4 class="text-h2" style="margin: 0; font-size: 1.85rem;">${r} Mins</h4>
            <p class="text-tiny text-secondary" style="font-weight: 700; text-transform: uppercase; margin: 0;">Learning Time</p>
          </div>
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
            <span style="font-size: 2rem;">🎯</span>
            <h4 class="text-h2" style="margin: 0; font-size: 1.85rem;">${c}%</h4>
            <p class="text-tiny text-secondary" style="font-weight: 700; text-transform: uppercase; margin: 0;">Quiz Accuracy</p>
          </div>
        </div>

        <!-- Visual Analytics Grid -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-6); margin-top: var(--space-4);" class="reveal animate-fade-up">
          <div class="card" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <h3 class="text-h3" style="margin: 0;">Focus Telemetry Map</h3>
            <div style="height: 180px; display: flex; align-items: center; justify-content: center;">
              ${d}
            </div>
          </div>

          <div class="card" style="display: flex; flex-direction: column; justify-content: center; gap: var(--space-4); padding: var(--space-6);">
            <h3 class="text-h3" style="margin: 0;">Latest Logged Coordinates</h3>
            ${e.continueReading?`
              <p class="text-body text-secondary" style="margin: 0;">
                You were recently exploring <strong>${e.continueReading.topicId}</strong> in <strong>${e.continueReading.mode.toUpperCase()}</strong> mode.
              </p>
              <button id="resume-telemetry-btn" class="btn btn-primary" style="align-self: flex-start;">
                Resume Journey
              </button>
            `:`
              <p class="text-body text-secondary" style="margin: 0;">
                No active reading bookmarks found. Search for a subject to start.
              </p>
              <button id="resume-search-btn" class="btn btn-primary" style="align-self: flex-start;">
                Search Portal
              </button>
            `}
          </div>
        </div>
      </div>
    `},bindEvents(){l.initScrollReveal();let e=o.getProgress();document.getElementById(`resume-telemetry-btn`)?.addEventListener(`click`,()=>{if(e.continueReading){let t=e.continueReading.topicId,n=e.continueReading.mode;$.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g,`_`))}&mode=${n}`)}}),document.getElementById(`resume-search-btn`)?.addEventListener(`click`,()=>{$.navigate(``)})}},Ee={render(){let e=o.getBadges();return`
      <div class="badges-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">Academy Achievements</h1>
          <p class="text-small text-secondary">Earn badges by studying comic storyboards and finishing quizzes.</p>
        </div>

        <div class="badges-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-5);">
          ${[{id:`space-rookie`,title:`Space Rookie`,desc:`Completed your first space exploration topic.`,icon:`🌌`},{id:`science-explorer`,title:`Science Explorer`,desc:`Analyzed human anatomy or atomic physics structure.`,icon:`🧪`},{id:`history-hunter`,title:`History Hunter`,desc:`Successfully navigated the rise of Ancient Egypt.`,icon:`🏛️`},{id:`diagram-master`,title:`Diagram Master`,desc:`Saved at least two vector diagrams to library.`,icon:`🎛️`},{id:`quiz-warrior`,title:`Quiz Warrior`,desc:`Scored a perfect 5/5 score on any quiz module.`,icon:`🎯`},{id:`story-finisher`,title:`Story Finisher`,desc:`Successfully completed at least three comic chapters.`,icon:`📚`},{id:`knowledge-collector`,title:`Knowledge Collector`,desc:`Unlocked six badges or saved three topics.`,icon:`👑`}].map(t=>{let n=e.includes(t.id);return`
        <div class="card reveal animate-fade-up text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-3); padding: var(--space-6); filter: grayscale(${n?`0%`:`100%`}); opacity: ${n?`1`:`0.65`}; border-color: ${n?`var(--accent-purple)`:`var(--border-default)`}; position: relative; overflow: hidden;">
          <div style="width: 70px; height: 70px; border-radius: var(--radius-full); background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; font-size: 2.25rem; border: 2px solid ${n?`var(--accent-purple)`:`var(--border-default)`}; margin-bottom: var(--space-2); filter: drop-shadow(${n?`0 0 8px rgba(124,58,237,0.4)`:`none`});">
            <span>${t.icon}</span>
          </div>
          <h4 class="text-h3" style="color: ${n?`var(--text-primary)`:`var(--text-muted)`}; margin: 0;">${t.title}</h4>
          <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">${t.desc}</p>
          ${n?`
            <span style="font-size: 0.65rem; color: var(--accent-amber); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
              ★ TELEMETRY UNLOCKED
            </span>`:`
            <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
              LOCKED
            </span>`}
        </div>
      `}).join(``)}
        </div>
      </div>
    `},bindEvents(){l.initScrollReveal()}},De={render(){return`
      <div class="about-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">About WonderVerse</h1>
          <p class="text-small text-secondary">A Universal Visual Knowledge Engine.</p>
        </div>

        <div class="card reveal animate-fade-up" style="max-width: var(--content-max); margin: 0 auto; padding: var(--space-8); display: flex; flex-direction: column; gap: var(--space-5);">
          <div>
            <h3 class="text-h2" style="color: var(--accent-cyan); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.4rem;">
              The Search-Based Vision
            </h3>
            <p class="text-body text-secondary" style="line-height: 1.7; margin: 0;">
              WonderVerse is a search-centric visual learning portal. Unlike static encyclopedias, users can search literally any topic in human history, science, geography, or technology. Our client-side engines parse raw Wikipedia summary feeds, automatically compile comic dialogue frames, build dynamic branching concept schemas, and create custom fill-in-the-blank quizzes — in seconds.
            </p>
          </div>
          
          <div style="border-top: 1px solid var(--border-default); padding-top: var(--space-4);">
            <h3 class="text-h2" style="color: var(--accent-purple); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.4rem;">
              Platform Attributes & Architecture
            </h3>
            <ul style="padding-left: var(--space-5); color: var(--text-secondary); display: flex; flex-direction: column; gap: var(--space-2); line-height: 1.6;">
              <li><strong>Dynamic SVG Maps:</strong> Automatically charts branches linking the primary search keyword to subconcepts.</li>
              <li><strong>Bespoke Showcases:</strong> Pre-caches high-fidelity panels for key subjects.</li>
              <li><strong>Offline-First History:</strong> Logs streaks and recently searched articles in local cache pools.</li>
              <li><strong>Zero Cost Stack:</strong> Client-side processing utilizing Wikipedia REST endpoints, Canvas animations, and localStorage.</li>
            </ul>
          </div>

          <div style="border-top: 1px solid var(--border-default); padding-top: var(--space-6); margin-top: var(--space-4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4);">
            <div>
              <h5 style="color: var(--accent-amber); font-size: 0.9rem; margin: 0;">ENGINE TELEMETRY</h5>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin: 2px 0 0 0;">Platform version: 2.0.0 (Vite + Vanilla JS Stack)</p>
            </div>
            <button id="about-home-btn" class="btn btn-primary">
              Return to Portal
            </button>
          </div>
        </div>
      </div>
    `},bindEvents(){l.initScrollReveal(),document.getElementById(`about-home-btn`)?.addEventListener(`click`,()=>{$.navigate(``)})}},Oe=[{id:`solar-system`,title:`Solar System Orbit Diagram`,topicId:`star-birth`,desc:`Interactive map of active stellar orbits.`},{id:`black-hole`,title:`Black Hole Layers Diagram`,topicId:`black-hole`,desc:`Cross-section of a singularity well.`},{id:`human-heart`,title:`Human Heart Diagram`,topicId:`human-heart`,desc:`Double-pump blood circulation paths.`},{id:`brain`,title:`Brain Regions Diagram`,topicId:`how-ai-thinks`,desc:`Lobes and cognitive hubs of the neural brain.`},{id:`atom`,title:`Atom Structure Diagram`,topicId:`journey-inside-atom`,desc:`Quantized orbital shells and core clusters.`},{id:`water-cycle`,title:`Water Cycle Diagram`,topicId:`water-cycle`,desc:`Phase loops from ocean to cloud aggregates.`},{id:`volcano`,title:`Volcano Cross Section`,topicId:`legend-of-lightning`,desc:`Magma chambers and volcanic venting pipes.`},{id:`food-chain`,title:`Food Chain Diagram`,topicId:`water-cycle`,desc:`Energy flow links between trophic nodes.`},{id:`timeline`,title:`Timeline of Social Hierarchy`,topicId:`ancient-egypt`,desc:`Pharaoh social stratification nodes.`},{id:`neural-net`,title:`AI Neural Network Diagram`,topicId:`how-ai-thinks`,desc:`Interconnected nodes simulating feed forward calculations.`}],ke={render(){return`
      <div class="diagrams-hub-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">Interactive Diagrams Hub</h1>
          <p class="text-small text-secondary">Access all high-fidelity interactive vector models and schematic profiles locally cached on the system.</p>
        </div>

        <div class="badges-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-12);">
          ${Oe.map(e=>{let t=p(e.title,e.desc||``),n=g(t),r=h(t);return`
        <div class="card card-glow tilt-card reveal" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 220px; cursor: pointer;" data-title="${e.title}">
          <div class="mouse-glow"></div>
          <div>
            <span class="badge badge-${t}">${n} ${r}</span>
            <h3 class="text-h3" style="margin-top: var(--space-3); margin-bottom: var(--space-2);">${e.title}</h3>
            <p class="text-small text-secondary" style="line-height: 1.4; height: 50px; overflow: hidden; margin-bottom: var(--space-4);">${e.desc||`Interactive vector concept map.`}</p>
          </div>
          <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: bold; display: flex; align-items: center; gap: 5px;">
            Initialize Diagram →
          </span>
        </div>
      `}).join(``)}
        </div>
      </div>
    `},bindEvents(){l.initScrollReveal(),l.setupTilt(),document.querySelectorAll(`.diagrams-hub-page-container .tilt-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-title`);$.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g,`_`))}&mode=diagram`)})})}},Ae={render(){return`
      <div class="error-page-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; text-align: center; gap: var(--space-4); position: relative; z-index: 5;">
        <div class="card reveal animate-fade-up" style="max-width: 500px; padding: var(--space-8); border-color: var(--accent-rose); display: flex; flex-direction: column; align-items: center; gap: var(--space-4);">
          <span style="font-size: 3.5rem; filter: drop-shadow(0 0 10px rgba(244,63,94,0.3));">🛸</span>
          <h2 class="text-h1" style="color: var(--accent-rose); margin: 0;">Coordinate Lost</h2>
          <p class="text-body text-secondary" style="margin: 0; line-height: 1.5;">
            The learning trajectory you are trying to scan does not exist in our telemetry index. Return to the portal command center.
          </p>
          <button id="error-home-btn" class="btn btn-primary" style="margin-top: var(--space-2);">
            Return Portal
          </button>
        </div>
      </div>
    `},bindEvents(){l.initScrollReveal(),document.getElementById(`error-home-btn`)?.addEventListener(`click`,()=>{$.navigate(``)})}},$=new class{constructor(){this.routes={"/":w,"/search":te,"/topic":we,"/saved":Q,"/dashboard":Te,"/badges":Ee,"/about":De,"/diagrams":ke},this.currentView=null}init(e){this.onRoute=e,window.addEventListener(`hashchange`,()=>this.handleRouting()),window.addEventListener(`load`,()=>this.handleRouting()),this.handleRouting()}navigate(e){let t=e.startsWith(`#/`)?e.slice(2):e.startsWith(`#`)?e.slice(1):e;window.location.hash=`#/${t}`}parseRoute(){let e=window.location.hash||`#/`,t=e.startsWith(`#/`)?e.slice(2):e.startsWith(`#`)?e.slice(1):e;if(t=decodeURIComponent(t).trim(),t===``||t===`/`||t===`landing`)return{route:`/`,params:{}};let[n,r]=t.split(`?`),i=`/`+n.split(`/`).filter(e=>e.length>0).join(`/`),a={};if(r){let e=new URLSearchParams(r);for(let[t,n]of e.entries())a[t]=n}let o=n.split(`/`).filter(e=>e.length>0);return o[0]===`topic`&&o.length>1?(a.t=o[1],o[2]&&(a.mode=o[2]),{route:`/topic`,params:a}):o[0]===`search`&&o.length>1?(a.q=o[1],{route:`/search`,params:a}):{route:i,params:a}}handleRouting(){let{route:e,params:t}=this.parseRoute(),n=this.routes[e]||Ae;S.stop(),this.currentView&&typeof this.currentView.destroy==`function`&&this.currentView.destroy(),this.currentView=n,this.updateActiveNavLinks(e);let r=document.getElementById(`app`);r&&(window.scrollTo({top:0,behavior:`smooth`}),r.innerHTML=n.render(t),typeof n.bindEvents==`function`&&n.bindEvents(t)),this.onRoute&&this.onRoute({route:e,params:t})}updateActiveNavLinks(e){document.querySelectorAll(`.nav-link, .bottom-nav-link`).forEach(t=>{let n=t.getAttribute(`href`);if(!n)return;let r=n.startsWith(`#/`)?n.slice(1):n.startsWith(`#`)?n:`/`+n,i=e===`/`&&(r===`#/`||r===`#/landing`);r===`#${e}`||i?t.classList.add(`active`):t.classList.remove(`active`)})}back(){window.history.back()}},je={render(){let e=s.getState(),t=e.streak?.currentStreak||0;return`
      <div style="width: 420px; max-width: 100%;">
        ${c.render(`Search any topic...`,`header-search`)}
      </div>
      <div style="display: flex; align-items: center; gap: 20px;">
        <button id="theme-toggle-btn" class="btn btn-ghost btn-icon" style="font-size: 1.1rem; padding: 6px;" title="Toggle Light/Dark Mode">
          ${e.theme===`dark`?`☀️`:`🌙`}
        </button>
        <div style="font-size: 13px; font-weight: 700; color: var(--accent-cyan);" id="header-streak-badge">
          🔥 STREAK: ${t} DAYS
        </div>
      </div>
    `},bindEvents(){c.bindEvents(`header-search`,e=>{$.navigate(`search?q=${encodeURIComponent(e)}`)}),document.getElementById(`theme-toggle-btn`)?.addEventListener(`click`,()=>{s.toggleTheme(),this.updateHeader()})},updateHeader(){let e=document.querySelector(`header.top-header`);e&&(e.innerHTML=this.render(),this.bindEvents())}};({init(){je.updateHeader(),$.init(({route:e,params:t})=>{console.log(`Navigation routing to: ${e}`,t)}),o.updateReadingStreak(),setInterval(()=>{o.incrementLearningTime(1)},6e4),this.setupListeners()},setupListeners(){document.getElementById(`sidebar-logo`)?.addEventListener(`click`,()=>{$.navigate(``)}),window.addEventListener(`badge-unlocked`,e=>{let t=e.detail.badges;t&&t.length>0&&W.showAchievement(t[0])}),s.subscribe(`stateChange`,({current:e})=>{let t=document.getElementById(`header-streak-badge`);t&&e.streak&&(t.innerText=`🔥 STREAK: ${e.streak.currentStreak} DAYS`)})}}).init();