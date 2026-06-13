// StoryVerse Academy Animation & Visual Effects Engine

export const Animations = {
  starCanvas: null,
  ctx: null,
  stars: [],
  maxStars: 120,
  warpSpeed: 0.5,
  targetWarpSpeed: 0.5,
  lastScrollY: 0,
  animationFrameId: null,

  init() {
    this.setupStarfield();
    this.setupScrollReveal();
    this.setup3DTilt();
    
    // Listen for window scroll to accelerate stars temporarily
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const speed = Math.min(10, Math.abs(currentScrollY - this.lastScrollY) * 0.5 + 0.5);
      this.targetWarpSpeed = speed;
      this.lastScrollY = currentScrollY;
      
      // Update vertical progress drawing line if present
      this.updateScrollPath();
    });
  },

  setupStarfield() {
    this.starCanvas = document.getElementById("star-canvas");
    if (!this.starCanvas) return;

    this.ctx = this.starCanvas.getContext("2d");
    this.resizeCanvas();
    
    window.addEventListener("resize", () => this.resizeCanvas());

    // Initialize stars
    this.stars = [];
    for (let i = 0; i < this.maxStars; i++) {
      this.stars.push({
        x: Math.random() * this.starCanvas.width - this.starCanvas.width / 2,
        y: Math.random() * this.starCanvas.height - this.starCanvas.height / 2,
        z: Math.random() * this.starCanvas.width,
        color: this.getRandomStarColor(),
        size: Math.random() * 1.5 + 0.5
      });
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    const loop = () => {
      this.drawStarfield();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  },

  resizeCanvas() {
    if (!this.starCanvas) return;
    this.starCanvas.width = window.innerWidth;
    this.starCanvas.height = window.innerHeight;
  },

  getRandomStarColor() {
    const colors = ["#ffffff", "#00f3ff", "#ff007f", "#8a2be2", "#ffc400"];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  drawStarfield() {
    if (!this.ctx || !this.starCanvas) return;
    
    const cx = this.starCanvas.width / 2;
    const cy = this.starCanvas.height / 2;
    
    // Create dark space effect with trail lines
    this.ctx.fillStyle = "rgba(5, 4, 12, 0.2)";
    this.ctx.fillRect(0, 0, this.starCanvas.width, this.starCanvas.height);
    
    // Smoothly decay warpSpeed back to default base speed
    this.warpSpeed += (this.targetWarpSpeed - this.warpSpeed) * 0.08;
    this.targetWarpSpeed += (0.5 - this.targetWarpSpeed) * 0.08;

    this.stars.forEach(star => {
      star.z -= this.warpSpeed;
      
      // Reset star if it passes the viewer
      if (star.z <= 0) {
        star.z = this.starCanvas.width;
        star.x = Math.random() * this.starCanvas.width - cx;
        star.y = Math.random() * this.starCanvas.height - cy;
      }
      
      // 3D projections
      const px = (star.x / star.z) * cx + cx;
      const py = (star.y / star.z) * cy + cy;
      const size = (1 - star.z / this.starCanvas.width) * 3 * star.size;

      // Draw star trail if scrolling fast
      if (this.warpSpeed > 2) {
        const tailLength = this.warpSpeed * 2;
        const pzPrev = star.z + tailLength;
        const pxPrev = (star.x / pzPrev) * cx + cx;
        const pyPrev = (star.y / pzPrev) * cy + cy;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = star.color;
        this.ctx.lineWidth = size;
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(pxPrev, pyPrev);
        this.ctx.stroke();
      } else {
        this.ctx.beginPath();
        this.ctx.fillStyle = star.color;
        this.ctx.arc(px, py, size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  },

  setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    // Observe all elements with scroll-reveal class
    document.querySelectorAll(".scroll-reveal").forEach(el => observer.observe(el));
  },

  setup3DTilt() {
    // Detect mouse moves over grid cards for a 3D float/tilt effect
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".tilt-card");
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within card
      const y = e.clientY - rect.top;  // y coordinate within card
      
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      
      const tiltX = (50 - py) * 0.3; // Max 15 degrees
      const tiltY = (px - 50) * 0.3;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
      
      // Glow follow effect
      const glow = card.querySelector(".card-glow");
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
  },

  updateScrollPath() {
    // Draws SVG scroll progress path if active
    const path = document.querySelector(".progress-path-svg path");
    if (!path) return;
    
    const pathLength = path.getTotalLength();
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength * (1 - scrollPercent);
  }
};
