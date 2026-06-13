// Animations Utility — handles scroll reveals, tilts, and interactive effects
export const Animations = {
  // Intersection observer for scroll reveal
  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  },

  // Setup 3D tilt interaction for premium cards
  setupTilt() {
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".tilt-card");
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within card
      const y = e.clientY - rect.top;  // y coordinate within card
      
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      
      const tiltX = (50 - py) * 0.25; 
      const tiltY = (px - 50) * 0.25;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      const glow = card.querySelector(".mouse-glow");
      if (glow) {
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      }
    });

    document.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".tilt-card");
      if (!card) return;
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  }
};

export default Animations;
