/**
 * GSAP Animations for Portfolio
 *
 * 1. Hero title fade-in animation
 * 2. ScrollTrigger animations for skills cards (slide in from left/right)
 */

// Register ScrollTrigger plugin
if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// 1. HERO TITLE FADE-IN (Nicole Foster)
// ============================================================================

// Wait for GSAP to be available and animate Nicole Foster title
function initGSAPAnimations() {
  // Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.warn("GSAP library not loaded");
    return;
  }

  // Select the hero title element
  const heroTitle = document.querySelector(".hero-title");

  if (heroTitle) {
    // Animate from the CSS initial state to visible
    // CSS already sets: opacity: 0, transform: translateY(50px)
    gsap.to(heroTitle, {
      opacity: 1, // Animate to full opacity
      y: 0, // Animate to original position
      duration: 3, // Animation duration 3 seconds (very slow)
      ease: "power2.out", // Professional easing
      delay: 1, // Wait 1 second before starting
    });
  }
}

// ============================================================================
// 2. SCROLLTRIGGER ANIMATIONS FOR SKILLS CARDS
// ============================================================================

function initScrollTriggerAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP or ScrollTrigger not loaded");
    return;
  }

  // Animate skills panel (My Skills card) - slide from left
  const skillsPanel = document.querySelector(".slide-left");
  if (skillsPanel) {
    gsap.from(skillsPanel, {
      x: -100, // Start 100px to the left
      opacity: 0, // Start invisible
      duration: 1, // 1 second animation
      scrollTrigger: {
        trigger: skillsPanel,
        start: "top 80%", // Start when top of element is 80% down viewport
        toggleActions: "play none none reverse", // Play on enter, reverse on leave
        markers: false, // Set to true for debugging
      },
    });
  }

  // Animate skills progress card - slide from right
  const skillsProgress = document.querySelector(".slide-right");
  if (skillsProgress) {
    gsap.from(skillsProgress, {
      x: 100, // Start 100px to the right
      opacity: 0, // Start invisible
      duration: 1, // 1 second animation
      scrollTrigger: {
        trigger: skillsProgress,
        start: "top 80%", // Start when top of element is 80% down viewport
        toggleActions: "play none none reverse", // Play on enter, reverse on leave
        markers: false, // Set to true for debugging
      },
    });
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Hook into the intro overlay promise to trigger animation when it completes
document.addEventListener("DOMContentLoaded", () => {
  // Check if prefers-reduced-motion (intro would be skipped)
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // If reduced motion, run animations immediately
    initGSAPAnimations();
  } else {
    // Otherwise, wait for intro to complete
    setTimeout(() => {
      // Check if intro has completed by looking for the overlay
      const checkIntroComplete = setInterval(() => {
        const overlay = document.querySelector(".intro-overlay");
        if (!overlay) {
          // Overlay is gone, animation can start
          clearInterval(checkIntroComplete);
          initGSAPAnimations();
        }
      }, 100); // Check every 100ms
    }, 500); // Wait 500ms before starting to check
  }

  // Initialize ScrollTrigger animations (these run independently of intro)
  initScrollTriggerAnimations();
});
