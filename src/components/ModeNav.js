import { icon } from "../utils/icons.js";
const modes = [
  { id: "story", label: "Story", icon: "book" },
  { id: "learn", label: "Explain", icon: "learn" },
  { id: "diagram", label: "Diagram", icon: "diagram" },
  { id: "quiz", label: "Quiz", icon: "quiz" },
  { id: "explore", label: "Explore", icon: "explore" },
];
export const ModeNav = {
  render(activeMode = "story") {
    return `<div class="mode-navigation-bar"><div class="mode-switches-container" role="tablist" aria-label="Ways to explore this topic">${modes.map((mode) => `<button type="button" id="mode-${mode.id}" data-mode="${mode.id}" role="tab" aria-selected="${activeMode === mode.id}" aria-controls="topic-workspace" tabindex="${activeMode === mode.id ? "0" : "-1"}" class="mode-tab ${activeMode === mode.id ? "active" : ""}">${icon(mode.icon, 18)}<span>${mode.label}</span></button>`).join("")}</div></div>`;
  },
  select(mode) {
    document.querySelectorAll(".mode-tab").forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    document
      .getElementById("topic-workspace")
      ?.setAttribute("aria-labelledby", `mode-${mode}`);
  },
  bindEvents(onModeChange) {
    const buttons = [...document.querySelectorAll(".mode-tab")];
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        this.select(button.dataset.mode);
        onModeChange?.(button.dataset.mode);
      });
      button.addEventListener("keydown", (event) => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
        if (event.key === "ArrowLeft")
          next = (index + buttons.length - 1) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        buttons[next].focus();
        buttons[next].click();
      });
    });
  },
};
export default ModeNav;
