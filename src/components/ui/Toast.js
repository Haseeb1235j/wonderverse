// Toast Component — notification system
export const Toast = {
  show(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.position = "fixed";
      container.style.bottom = "24px";
      container.style.right = "24px";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "10px";
      container.style.zIndex = "1000";
      document.body.appendChild(container);
    }
    
    const toast = document.createElement("div");
    toast.className = "card card-elevated animate-scale";
    
    const colors = {
      success: 'var(--accent-emerald)',
      info: 'var(--accent-purple)',
      warning: 'var(--accent-amber)',
      error: 'var(--accent-rose)'
    };
    
    const emojis = {
      success: '✓',
      info: '⚡',
      warning: '⚠️',
      error: '❌'
    };

    toast.style.background = "var(--bg-elevated)";
    toast.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
    toast.style.padding = "10px 18px";
    toast.style.borderRadius = "var(--radius-md)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "10px";
    toast.style.boxShadow = "var(--shadow-card)";
    toast.style.fontSize = "0.85rem";
    
    toast.innerHTML = `
      <span style="color: ${colors[type] || colors.info}; font-weight: bold; font-size: 1rem;">${emojis[type] || emojis.info}</span>
      <div>
        <p style="margin: 0; color: var(--text-primary); font-weight: 500;">${message}</p>
      </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  showAchievement(badgeId) {
    const toast = document.getElementById("badge-toast");
    const titleEl = document.getElementById("badge-toast-title");
    
    const badgeNames = {
      "space-rookie": "Space Rookie 🌌",
      "science-explorer": "Science Explorer 🧪",
      "history-hunter": "History Hunter 🏛️",
      "diagram-master": "Diagram Master 🎛️",
      "quiz-warrior": "Quiz Warrior 🎯",
      "story-finisher": "Story Finisher 📚",
      "knowledge-collector": "Knowledge Collector 👑"
    };

    if (toast && titleEl) {
      titleEl.innerText = badgeNames[badgeId] || badgeId.replace("-", " ").toUpperCase();
      toast.classList.add("active");
      
      // Play a quick retro chime synthesized locally via Web Audio!
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc1.type = "sine";
        osc2.type = "triangle";
        
        const now = audioCtx.currentTime;
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc1.frequency.setValueAtTime(783.99, now + 0.24); // G5
        osc2.frequency.setValueAtTime(261.63, now); // C4
        osc2.frequency.setValueAtTime(329.63, now + 0.12); // E4
        
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
      } catch (err) {
        console.warn("Web Audio chime failed", err);
      }

      setTimeout(() => {
        toast.classList.remove("active");
      }, 4500);
    }
  }
};

export default Toast;
