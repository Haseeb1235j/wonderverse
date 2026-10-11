// ErrorPage Component
import { Router } from "../router.js";
import { Animations } from "../utils/animations.js";

export const ErrorPage = {
  render() {
    return `
      <div class="error-page-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; text-align: center; gap: var(--space-4); position: relative; z-index: 5;">
        <div class="card reveal animate-fade-up" style="max-width: 500px; padding: var(--space-8); border-color: var(--accent-rose); display: flex; flex-direction: column; align-items: center; gap: var(--space-4);">
          <span style="font-size: 3.5rem; filter: drop-shadow(0 0 10px rgba(244,63,94,0.3));">?</span>
          <h2 class="text-h1" style="color: var(--accent-rose); margin: 0;">Page not found</h2>
          <p class="text-body text-secondary" style="margin: 0; line-height: 1.5;">
            This page doesn’t exist. Return to Explore to find a topic.
          </p>
          <button id="error-home-btn" class="btn btn-primary" style="margin-top: var(--space-2);">
            Back to explore
          </button>
        </div>
      </div>
    `;
  },

  bindEvents() {
    Animations.initScrollReveal();

    document.getElementById("error-home-btn")?.addEventListener("click", () => {
      Router.navigate("");
    });
  },
};

export default ErrorPage;
