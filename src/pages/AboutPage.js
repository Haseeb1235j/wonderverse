// AboutPage Component
import { Animations } from "../utils/animations.js";
import { Router } from "../router.js";

export const AboutPage = {
  render() {
    return `
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
    `;
  },

  bindEvents() {
    Animations.initScrollReveal();

    document.getElementById("about-home-btn")?.addEventListener("click", () => {
      Router.navigate("");
    });
  }
};

export default AboutPage;
