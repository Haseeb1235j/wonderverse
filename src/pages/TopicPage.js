// TopicPage Component
import { fetchTopicData } from "../services/wikipedia.js";
import { detectCategory } from "../generators/categoryDetector.js";
import { generateStoryPanels } from "../generators/storyGenerator.js";
import { generateLearnContent } from "../generators/learnGenerator.js";
import { generateDiagram } from "../generators/diagramGenerator.js";
import { generateQuiz } from "../generators/quizGenerator.js";
import { StorageService } from "../services/storage.js";

import { HeroCard } from "../components/HeroCard.js";
import { ModeNav } from "../components/ModeNav.js";
import { SkeletonLoader } from "../components/ui/SkeletonLoader.js";

import { StoryMode } from "../components/modes/StoryMode.js";
import { LearnMode } from "../components/modes/LearnMode.js";
import { DiagramMode } from "../components/modes/DiagramMode.js";
import { QuizMode } from "../components/modes/QuizMode.js";
import { ExploreMode } from "../components/modes/ExploreMode.js";

export const TopicPage = {
  title: "",
  query: "",
  category: "",
  summaryData: null,
  generated: {},
  activeMode: "story",

  render(params) {
    this.title = (params.t || "").replace(/_/g, ' ');
    this.query = params.q || this.title;
    this.activeMode = params.mode || "story";

    // Set globally accessible reference for modes CTA redirection
    window.topicPageInstance = this;

    return `
      <div id="topic-page-mount" class="topic-page-container" style="display: flex; flex-direction: column; gap: var(--space-6); min-height: 80vh;">
        ${SkeletonLoader.renderTopicPageSkeleton()}
      </div>
    `;
  },

  async bindEvents(params) {
    this.title = (params.t || "").replace(/_/g, ' ');
    this.query = params.q || this.title;
    const initialMode = params.mode || "story";

    const mountEl = document.getElementById("topic-page-mount");
    if (!mountEl) return;

    // 1. Fetch all data in parallel
    const data = await fetchTopicData(this.title, this.query);

    if (!data || !data.summary || data.summary.title === undefined) {
      this.renderError(mountEl, 'Could not load topic coordinates. Please try another search.');
      return;
    }

    this.summaryData = data.summary;
    this.title = data.summary.title; // Use official normalized Wikipedia title

    // 2. Detect category
    this.category = detectCategory(this.title, data.summary.extract);

    // 3. Pre-generate all mode content (so tab switches are instant)
    this.generated = {
      story:   generateStoryPanels(this.title, data.summary.extract, this.category),
      learn:   generateLearnContent(this.title, data.summary.extract, this.category),
      diagram: generateDiagram(this.category, { title: this.title, extract: data.summary.extract, query: this.query }),
      quiz:    generateQuiz(this.title, data.summary.extract)
    };

    // 4. Render main layout
    mountEl.innerHTML = `
      <!-- Hero Header Card -->
      <div id="topic-hero-container">
        ${HeroCard.render(data.summary, this.category)}
      </div>

      <!-- Mode Telemetry Tabs -->
      <div id="topic-tabs-container">
        ${ModeNav.render(initialMode)}
      </div>

      <!-- Active Mode Workspace -->
      <div id="topic-workspace" style="position: relative; z-index: 5;"></div>
    `;

    // Bind HeroCard actions (save, share)
    HeroCard.bindEvents(data.summary);

    // Bind tab controls
    ModeNav.bindEvents((mode) => {
      this.switchMode(mode);
    });

    // 5. Activate first mode
    this.switchMode(initialMode);

    // 6. Save to recent searches
    StorageService.addRecentSearch({ 
      title: this.title, 
      query: this.query, 
      category: this.category, 
      image: data.summary.thumbnail?.source 
    });
  },

  switchMode(modeId) {
    this.activeMode = modeId;
    const workspace = document.getElementById("topic-workspace");
    if (!workspace) return;

    // Save reading progress coordinate in local telemetry
    StorageService.saveProgress(this.title, modeId);

    // Switch and render
    switch (modeId) {
      case "story":
        workspace.innerHTML = StoryMode.render(this.generated.story, this.title);
        StoryMode.bindEvents();
        break;
      case "learn":
        workspace.innerHTML = LearnMode.render(this.generated.learn);
        LearnMode.bindEvents(this.generated.learn);
        break;
      case "diagram":
        workspace.innerHTML = DiagramMode.render(this.generated.diagram, this.title, this.category);
        DiagramMode.bindEvents(this.title, this.summaryData.extract, this.category);
        break;
      case "quiz":
        workspace.innerHTML = QuizMode.render(this.generated.quiz, this.title);
        QuizMode.bindEvents();
        break;
      case "explore":
        workspace.innerHTML = ExploreMode.render(this.title);
        ExploreMode.bindEvents(this.title);
        break;
      default:
        workspace.innerHTML = StoryMode.render(this.generated.story, this.title);
        StoryMode.bindEvents();
        break;
    }
  },

  renderError(container, message) {
    container.innerHTML = `
      <div class="card text-center reveal animate-fade-up" style="max-width: 600px; margin: var(--space-10) auto; padding: var(--space-8); border-color: var(--accent-rose); display: flex; flex-direction: column; align-items: center; gap: var(--space-4);">
        <span style="font-size: 3rem;">🔮</span>
        <h3 class="text-h2" style="color: var(--accent-rose); margin: 0;">Coordinate Retrieval Error</h3>
        <p class="text-body text-secondary" style="margin: 0; line-height: 1.5;">
          ${message}
        </p>
        <button id="error-return-btn" class="btn btn-primary" style="margin-top: var(--space-2);">
          Return to Portal
        </button>
      </div>
    `;

    document.getElementById("error-return-btn")?.addEventListener("click", () => {
      Router.navigate("");
    });
  }
};

export default TopicPage;
