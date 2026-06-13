// ModeNav Component — Tab navigation for topic page

export const ModeNav = {
  render(activeMode = "story") {
    const modes = [
      { id: "story", label: "Story Mode", icon: "📚" },
      { id: "learn", label: "Learn Mode", icon: "🧠" },
      { id: "diagram", label: "Diagram Mode", icon: "📊" },
      { id: "quiz", label: "Quiz Mode", icon: "🎯" },
      { id: "explore", label: "Explore Mode", icon: "🧭" }
    ];

    return `
      <div class="mode-navigation-bar" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-default); padding-bottom: var(--space-4); margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4);">
        <h2 class="text-tiny text-muted" style="text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin: 0;">Mode Telemetry</h2>
        <div class="mode-switches-container" style="display: flex; gap: 4px; background: var(--bg-secondary); border: 1px solid var(--border-default); border-radius: var(--radius-full); padding: 4px; overflow-x: auto; max-width: 100%;">
          ${modes.map(mode => `
            <button 
              data-mode="${mode.id}" 
              class="btn btn-sm ${activeMode === mode.id ? 'btn-primary' : 'btn-ghost'}"
              style="border-radius: var(--radius-full); white-space: nowrap;"
            >
              <span style="margin-right: 4px;">${mode.icon}</span>${mode.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  bindEvents(onModeChange) {
    document.querySelectorAll(".mode-switches-container button").forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedMode = btn.getAttribute("data-mode");
        
        // Update visual active state immediately
        document.querySelectorAll(".mode-switches-container button").forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-ghost");
        });
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-ghost");

        if (onModeChange) {
          onModeChange(selectedMode);
        }
      });
    });
  }
};

export default ModeNav;
