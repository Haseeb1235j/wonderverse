// Badge Component
import { getCategoryIcon, getCategoryLabel } from "../../generators/categoryDetector.js";

export const Badge = {
  renderCategory(category) {
    const icon = getCategoryIcon(category);
    const label = getCategoryLabel(category);
    return `<span class="badge badge-${category}">${icon} ${label}</span>`;
  },
  
  renderDifficulty(difficulty) {
    return `<span class="badge badge-${difficulty}">${difficulty}</span>`;
  }
};

export default Badge;
