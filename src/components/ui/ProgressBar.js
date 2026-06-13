// ProgressBar Component
export const ProgressBar = {
  render(percentage, color = "var(--accent-purple)") {
    return `
      <div class="progress-bar-container" style="width: 100%; background: var(--bg-secondary); height: 8px; border-radius: var(--radius-full); overflow: hidden; border: 1px solid var(--border-default);">
        <div class="progress-bar-fill" style="width: ${percentage}%; background: ${color}; height: 100%; transition: width 0.3s ease; border-radius: var(--radius-full);"></div>
      </div>
    `;
  }
};

export default ProgressBar;
