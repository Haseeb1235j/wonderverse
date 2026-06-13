// SkeletonLoader Component — loading placeholders
export const SkeletonLoader = {
  renderCard() {
    return `
      <div class="card" style="height: 180px; width: 100%; margin-bottom: var(--space-4); display: flex; gap: var(--space-4); padding: var(--space-4);">
        <div class="skeleton" style="width: 100px; height: 100px; flex-shrink: 0; border-radius: var(--radius-md);"></div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: var(--space-2);">
          <div class="skeleton" style="width: 40%; height: 20px; border-radius: var(--radius-sm);"></div>
          <div class="skeleton" style="width: 80%; height: 14px; border-radius: var(--radius-sm);"></div>
          <div class="skeleton" style="width: 90%; height: 14px; border-radius: var(--radius-sm);"></div>
          <div class="skeleton" style="width: 30%; height: 28px; border-radius: var(--radius-sm); margin-top: auto;"></div>
        </div>
      </div>
    `;
  },
  
  renderSearchSkeletons() {
    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-4); max-width: var(--content-max); margin: 0 auto;">
        ${Array.from({ length: 4 }).map(() => this.renderCard()).join('')}
      </div>
    `;
  },
  
  renderTopicPageSkeleton() {
    return `
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
    `;
  }
};

export default SkeletonLoader;
