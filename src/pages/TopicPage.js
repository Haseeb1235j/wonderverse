// TopicPage Component
import { fetchTopicData } from "../services/wikipedia.js";
import { Router } from "../router.js";
import { escapeHTML, icon } from "../utils/icons.js";
import { detectCategory } from "../generators/categoryDetector.js";
import { generateStoryPanels } from "../generators/storyGenerator.js";
import { generateLearnContent } from "../generators/learnGenerator.js";
import { generateDiagram } from "../generators/diagramGenerator.js";
import { generateQuiz } from "../generators/quizGenerator.js";
import { StorageService } from "../services/storage.js";
import { VoiceService } from "../services/voice.js";

import { HeroCard } from "../components/HeroCard.js";
import { SourceNote } from "../components/SourceNote.js";
import { wikiArticleURL } from "../utils/sourceText.js";
import { renderExternalSearch } from "../components/ExternalSearch.js";
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
  requestId: 0,

  render(params) {
    this.requestId++;
    this.title = (params.t || "").replace(/_/g, " ");
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
    this.title = (params.t || "").replace(/_/g, " ");
    this.query = params.q || this.title;
    const initialMode = params.mode || "story";

    const mountEl = document.getElementById("topic-page-mount");
    if (!mountEl) return;

    // 1. Fetch all data in parallel
    const request = ++this.requestId;
    const data = await fetchTopicData(this.title, this.query);
    if (request !== this.requestId || !mountEl.isConnected) return;

    if (!data || !data.summary || data.summary.title === undefined) {
      if (data?.choices?.length) {
        mountEl.innerHTML = `<div class="page-title-banner"><h1 class="text-h1">Choose a matching article</h1><p class="text-secondary">An article couldn’t be loaded for “${escapeHTML(this.title)}”. These are search matches from Wikipedia; select the subject you meant.</p></div><div class="collection-grid">${data.choices.map((hit) => `<a class="collection-item" href="#/topic?t=${encodeURIComponent(hit.title.replace(/ /g, "_"))}&q=${encodeURIComponent(this.query)}"><strong>${escapeHTML(hit.title)}</strong><span>${escapeHTML((hit.snippet || "").replace(/<[^>]*>/g, ""))}</span></a>`).join("")}</div>`;
        return;
      }
      this.renderError(
        mountEl,
        "We couldn’t load this topic. Check your connection or try another search.",
      );
      return;
    }

    this.summaryData = data.summary;
    this.title = data.summary.title; // Use official normalized Wikipedia title

    if (data.summary.type === "disambiguation") {
      const choices = (data.choices || []).filter(
        (hit) => hit.title !== this.title,
      );
      mountEl.innerHTML = `<div class="page-title-banner"><h1 class="text-h1">Which meaning of ${escapeHTML(this.title)}?</h1><p class="text-secondary">This name refers to several subjects. Choose an article to continue.</p></div><div class="collection-grid">${choices.map((hit) => `<a class="collection-item" href="#/topic?t=${encodeURIComponent(hit.title.replace(/ /g, "_"))}"><strong>${escapeHTML(hit.title)}</strong><span>${escapeHTML((hit.snippet || "").replace(/<[^>]*>/g, ""))}</span></a>`).join("")}</div><a class="btn btn-secondary" href="${wikiArticleURL(this.title)}" target="_blank" rel="noopener noreferrer">View all meanings on Wikipedia</a>`;
      return;
    }

    // 2. Detect category
    this.category = detectCategory(this.title, data.summary.extract);

    // 3. Pre-generate all mode content (so tab switches are instant)
    this.generated = {
      story: generateStoryPanels(
        this.title,
        data.leadExtract || data.summary.extract,
        this.category,
      ),
      learn: generateLearnContent(
        this.title,
        data.leadExtract || data.summary.extract,
        this.category,
      ),
      diagram: generateDiagram(this.category, {
        title: this.title,
        extract: data.leadExtract || data.summary.extract,
        query: this.query,
      }),
      quiz: generateQuiz(this.title, data.leadExtract || data.summary.extract),
    };
    this.sourceExtract = data.leadExtract || data.summary.extract;
    this.relatedData = data.related;

    // 4. Render main layout
    mountEl.innerHTML = `
      <!-- Hero Header Card -->
      <div id="topic-hero-container">
        ${HeroCard.render(data.summary, this.category)}
      </div>

      ${SourceNote.render(data)}

      <!-- Mode Telemetry Tabs -->
      <div id="topic-tabs-container">
        ${ModeNav.render(initialMode)}
      </div>

      <!-- Active Mode Workspace -->
      <div id="topic-workspace" role="tabpanel" tabindex="0" style="position: relative;"></div>
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
      image: data.summary.thumbnail?.source,
    });
  },

  switchMode(modeId) {
    if (!["story", "learn", "diagram", "quiz", "explore"].includes(modeId))
      modeId = "story";
    // Stop any active narration when changing modes/tabs
    VoiceService.stop();

    this.activeMode = modeId;
    ModeNav.select(modeId);
    const workspace = document.getElementById("topic-workspace");
    if (!workspace) return;
    const params = new URLSearchParams({
      t: this.title.replace(/ /g, "_"),
      mode: modeId,
    });
    if (this.query) params.set("q", this.query);
    window.history.replaceState(null, "", `#/topic?${params.toString()}`);

    // Save reading progress coordinate in local telemetry
    StorageService.saveProgress(this.title, modeId);

    // Switch and render
    switch (modeId) {
      case "story":
        workspace.innerHTML = StoryMode.render(
          this.generated.story,
          this.title,
        );
        StoryMode.bindEvents();
        break;
      case "learn":
        workspace.innerHTML = LearnMode.render(this.generated.learn);
        LearnMode.bindEvents(this.generated.learn);
        break;
      case "diagram":
        workspace.innerHTML = DiagramMode.render(
          this.generated.diagram,
          this.title,
          this.category,
        );
        DiagramMode.bindEvents(this.title, this.sourceExtract, this.category);
        break;
      case "quiz":
        workspace.innerHTML = QuizMode.render(this.generated.quiz, this.title);
        QuizMode.bindEvents();
        break;
      case "explore":
        workspace.innerHTML = ExploreMode.render(this.title, this.relatedData);
        ExploreMode.bindEvents(this.title);
        break;
      default:
        workspace.innerHTML = StoryMode.render(
          this.generated.story,
          this.title,
        );
        StoryMode.bindEvents();
        break;
    }
  },

  renderError(container, message) {
    container.innerHTML = `
      <div class="card text-center reveal animate-fade-up" style="max-width: 600px; margin: var(--space-10) auto; padding: var(--space-8); border-color: var(--accent-rose); display: flex; flex-direction: column; align-items: center; gap: var(--space-4);">
        ${icon("info", 32)}
        <h3 class="text-h2" style="margin: 0;">This topic is unavailable</h3>
        <p class="text-body text-secondary" style="margin: 0; line-height: 1.5;">
          ${escapeHTML(message)}
        </p>
        <button id="error-return-btn" class="btn btn-primary" style="margin-top: var(--space-2);">
          Back to explore
        </button>
      </div>
      <div class="result-actions"><a class="btn btn-secondary" href="#/search?q=${encodeURIComponent(this.query || this.title)}&scope=topics">Find matching articles</a></div>
      ${renderExternalSearch(this.query || this.title)}
    `;

    document
      .getElementById("error-return-btn")
      ?.addEventListener("click", () => {
        Router.navigate("");
      });
  },

  destroy() {
    this.requestId++;
    VoiceService.stop();
  },
};

export default TopicPage;
