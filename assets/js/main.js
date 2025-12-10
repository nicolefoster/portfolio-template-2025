/**
 * ==========================================================================
 * GRADE 1: VANILLA JAVASCRIPT PORTFOLIO DEMO
 * Scroll animations using IntersectionObserver
 * No frameworks, no dependencies — just modern JavaScript!
 * ==========================================================================
 *
 * 🎓 LEARNING OBJECTIVES:
 * - Understand the IntersectionObserver API for scroll-based triggers
 * - Learn why IntersectionObserver is better than scroll event listeners
 * - Implement accessible animations with prefers-reduced-motion
 * - Master the observer pattern for performant scroll detection
 *
 * 📚 WHAT IS INTERSECTIONOBSERVER?
 * IntersectionObserver is a browser API that efficiently detects when elements
 * enter or leave the viewport (or any ancestor element). It's the modern
 * replacement for scroll event listeners.
 *
 * ⚡ WHY NOT USE addEventListener('scroll', ...)?
 * - scroll events fire on EVERY PIXEL of scroll (60+ times per second!)
 * - This blocks the main thread and causes "jank" (stuttering)
 * - IntersectionObserver is optimized by the browser, runs asynchronously,
 *   and only fires when intersection state actually changes
 *
 * 🔗 MDN DOCS: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */

// ==========================================================================
// 1. INTERSECTIONOBSERVER CONFIGURATION
// ==========================================================================

/**
 * Observer options control WHEN the callback fires.
 *
 * 📐 UNDERSTANDING THE OPTIONS:
 *
 * root: The element to use as the viewport for checking visibility.
 *       - null = browser viewport (most common)
 *       - element = custom scroll container
 *
 * rootMargin: Expands or shrinks the root's bounding box.
 *       - Format: "top right bottom left" (like CSS margin)
 *       - Negative values shrink the detection area
 *       - "0px 0px -10% 0px" means: trigger when element is 10% INTO the viewport
 *         (not at the very edge, which feels more natural)
 *
 * threshold: What percentage of the element must be visible to trigger.
 *       - 0 = trigger as soon as 1 pixel is visible
 *       - 0.1 = trigger when 10% is visible
 *       - 1.0 = trigger only when 100% visible
 *       - [0, 0.5, 1] = trigger at multiple thresholds
 */
const observerOptions = {
  root: null, // Use the browser viewport
  rootMargin: "0px 0px -10% 0px", // Trigger 10% before fully visible
  threshold: 0.1, // Need 10% visibility to trigger
};

/**
 * CALLBACK: Single-element reveals
 *
 * This function is called by IntersectionObserver whenever an observed
 * element's intersection state changes.
 *
 * @param {IntersectionObserverEntry[]} entries - Array of intersection events
 * @param {IntersectionObserver} observer - The observer instance (for cleanup)
 *
 * 📐 WHAT'S IN AN ENTRY?
 * - entry.isIntersecting: boolean - is element currently visible?
 * - entry.intersectionRatio: number - how much is visible (0-1)
 * - entry.target: Element - the DOM element being observed
 * - entry.boundingClientRect: DOMRect - element's position/size
 */
const revealOnScroll = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add class that triggers CSS transition (see style.css)
      entry.target.classList.add("visible");

      // 🎯 PERFORMANCE OPTIMIZATION: Stop observing after reveal
      // Once an element is revealed, we don't need to watch it anymore.
      // This reduces work for the observer and prevents re-triggering.
      observer.unobserve(entry.target);
    }
  });
};

/**
 * CALLBACK: Staggered container reveals
 *
 * Same pattern, but adds 'revealed' class to containers.
 * CSS handles the staggered animation of children via transition-delay.
 */
const revealStaggered = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    }
  });
};

/**
 * CREATE OBSERVER INSTANCES
 *
 * We create two separate observers because they add different classes.
 * You could use one observer with logic to determine which class to add,
 * but separate observers are clearer and more maintainable.
 */
const singleObserver = new IntersectionObserver(
  revealOnScroll,
  observerOptions
);
const staggerObserver = new IntersectionObserver(
  revealStaggered,
  observerOptions
);

// ==========================================================================
// 2. INITIALIZE OBSERVERS
// ==========================================================================

/**
 * Main initialization function for scroll animations.
 *
 * 🎓 KEY CONCEPT: PROGRESSIVE ENHANCEMENT
 * We check for reduced motion FIRST, before setting up any animations.
 * This ensures users who need reduced motion get a good experience immediately.
 *
 * 📐 THE FLOW:
 * 1. Check if user prefers reduced motion
 * 2. If yes → make everything visible immediately, skip animations
 * 3. If no → set up observers to trigger animations on scroll
 */
function initScrollAnimations() {
  /**
   * CHECK FOR REDUCED MOTION PREFERENCE
   *
   * window.matchMedia() is like CSS media queries, but in JavaScript!
   * It returns a MediaQueryList object with a .matches boolean property.
   *
   * This respects the user's OS-level accessibility settings:
   * - macOS: System Preferences → Accessibility → Display → Reduce motion
   * - Windows: Settings → Ease of Access → Display → Show animations
   * - iOS: Settings → Accessibility → Motion → Reduce Motion
   *
   * ⚠️ IMPORTANT: Always check this BEFORE initializing animations!
   */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    /**
     * GRACEFUL DEGRADATION FOR REDUCED MOTION
     *
     * Instead of animations, we immediately show all content.
     * Users get the same information, just without the motion.
     *
     * This is NOT about removing features — it's about providing
     * an equivalent experience for users who need it.
     */
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      el.classList.add("visible");
    });
    document.querySelectorAll("[data-reveal-stagger]").forEach((el) => {
      el.classList.add("revealed");
    });
    return; // Exit early — no observers needed
  }

  /**
   * OBSERVE ELEMENTS FOR SCROLL-TRIGGERED ANIMATIONS
   *
   * querySelectorAll returns a NodeList (array-like).
   * forEach loops through each element and tells the observer to watch it.
   *
   * Once observed, the callback (revealOnScroll) will fire when the
   * element enters the viewport according to our observerOptions.
   */

  // Single element reveals (e.g., headings, paragraphs)
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    singleObserver.observe(el);
  });

  // Staggered container reveals (e.g., skill grids, project cards)
  document.querySelectorAll("[data-reveal-stagger]").forEach((el) => {
    staggerObserver.observe(el);
  });
}

// ==========================================================================
// 3. SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================================================

/**
 * Enhanced smooth scrolling for in-page navigation.
 *
 * 🎓 WHY NOT JUST USE CSS scroll-behavior: smooth?
 * CSS smooth scrolling works great, but it has limitations:
 * 1. Can't account for fixed header height
 * 2. Can't update URL without page jump
 * 3. Less control over timing/easing
 *
 * This JavaScript approach gives us full control while still being simple.
 *
 * 📐 THE PATTERN:
 * 1. Find all links starting with "#" (anchor links)
 * 2. On click, prevent default jump behavior
 * 3. Calculate target position accounting for fixed nav height
 * 4. Smoothly scroll to that position
 * 5. Update URL for bookmarking/sharing
 */
function initSmoothScroll() {
  // Select all anchor links (href starts with "#")
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");

      // Ignore links that are just "#" (often used for JavaScript triggers)
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        // Prevent the default "jump to anchor" behavior
        e.preventDefault();

        /**
         * CALCULATE SCROLL POSITION
         *
         * We need to account for the fixed navigation bar, otherwise
         * the target would be hidden behind it.
         *
         * getBoundingClientRect().top = distance from viewport top
         * window.scrollY = how far page is already scrolled
         * navHeight = height of fixed nav to offset
         */
        const navHeight = document.querySelector(".nav")?.offsetHeight || 0;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight;

        /**
         * SCROLL WITH SMOOTH BEHAVIOR
         *
         * window.scrollTo() with behavior: 'smooth' animates the scroll.
         * This is supported in all modern browsers.
         *
         * Note: CSS scroll-behavior: smooth on <html> provides a fallback
         * for browsers where this JS might fail.
         */
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        /**
         * UPDATE URL WITHOUT PAGE RELOAD
         *
         * history.pushState() changes the URL in the address bar
         * without triggering a page reload or scroll jump.
         *
         * This means:
         * - Users can bookmark specific sections
         * - Sharing the URL goes to the right section
         * - Back button works as expected
         */
        history.pushState(null, "", targetId);
      }
    });
  });
}

// ==========================================================================
// 4. ACTIVE NAVIGATION STATE
// ==========================================================================

/**
 * Highlight the nav link corresponding to the currently visible section.
 *
 * 🎓 UX PRINCIPLE: LOCATION AWARENESS
 * Users should always know where they are in the page. Highlighting the
 * active nav link provides this feedback without requiring user action.
 *
 * 📐 THE APPROACH:
 * We use IntersectionObserver again! But with different rootMargin settings
 * that define a "detection zone" in the middle of the viewport.
 *
 * rootMargin: '-50% 0px -50% 0px' means:
 * - Shrink the detection area by 50% from top AND bottom
 * - This creates a narrow band in the middle of the viewport
 * - Only the section crossing this band is considered "active"
 */
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observerOptions = {
    root: null,
    rootMargin: "-50% 0px -50% 0px", // Detect section in middle of viewport
    threshold: 0, // Trigger as soon as ANY part enters
  };

  /**
   * NAV HIGHLIGHT OBSERVER
   *
   * When a section enters our detection zone (middle of viewport),
   * we find the corresponding nav link and highlight it.
   */
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        // Update all nav links: highlight matching, reset others
        navLinks.forEach((link) => {
          link.style.color =
            link.getAttribute("href") === `#${id}`
              ? "var(--color-accent)" // Highlighted color
              : ""; // Reset to default (inherits from CSS)
        });
      }
    });
  }, observerOptions);

  // Observe all sections with IDs
  sections.forEach((section) => navObserver.observe(section));

  // Parallax for elements with [data-parallax]
  const initParallax = () => {
    const elems = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!elems.length) return;

    let ticking = false;

    const update = () => {
      const vh = window.innerHeight;
      elems.forEach((el) => {
        // speed 0 = no movement, 0.2 = subtle
        const speed = parseFloat(el.getAttribute("data-speed")) || 0.15;
        const rect = el.getBoundingClientRect();
        // center of element relative to viewport center (-1 .. 1)
        const elCenter = rect.top + rect.height / 2;
        const distanceFromCenter = (elCenter - vh / 2) / (vh / 2);
        // translate amount in px (tuned multiplier)
        const translateY = Math.round(distanceFromCenter * speed * 40);
        el.style.transform = `translateY(${translateY}px)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    // Initial update and listeners
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  };

  initParallax();
}

// --------------------------------------------------------------------------
// Decorative scroll-activated dots (user-supplied implementation)
// --------------------------------------------------------------------------
const initScrollDots = () => {
  // Respect reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (window._pageDotsInited) return;
  window._pageDotsInited = true;

  const dots = [];
  const numDots = 50; // Adjust number of dots

  // Create dots
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";

    const size = Math.random() * 10 + 5;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (document.body.scrollHeight - window.innerHeight);
    const speed = Math.random() * 0.5 + 0.2;
    const delay = Math.random() * 3;

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${x}px`;
    dot.style.animationDelay = `${delay}s`;
    dot.style.top = `${y}px`;

    document.body.appendChild(dot);

    dots.push({
      el: dot,
      baseY: y,
      speed: speed,
      x: x,
    });
  }

  let ticking = false;

  const updateDots = () => {
    const scrollY = window.scrollY;

    dots.forEach((dot) => {
      const y = dot.baseY - scrollY * dot.speed;
      dot.el.style.top = `${y}px`;

      // Check if dot is in viewport
      const inView = y > -50 && y < window.innerHeight + 50;
      dot.el.style.display = inView ? "block" : "none";
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateDots);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    dots.forEach((dot) => {
      dot.x = Math.random() * window.innerWidth;
      dot.el.style.left = `${dot.x}px`;
    });
    updateDots();
  });

  // Initial update
  updateDots();
};

// ==========================================================================
// 5. INITIALIZATION
// ==========================================================================

/**
 * DOMContentLoaded: The safe time to run DOM-manipulating JavaScript.
 *
 * 🎓 WHY DOMContentLoaded?
 * - Fires when HTML is fully parsed (DOM is ready)
 * - Doesn't wait for images/stylesheets to load (that's 'load' event)
 * - Safe to query and manipulate DOM elements
 *
 * If your script is in <head> without 'defer', this is essential.
 * If your script is at end of <body> or has 'defer', it's optional but good practice.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Respect reduced motion: skip intro animation if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const runInits = () => {
    initScrollAnimations();
    initSmoothScroll();
    initActiveNav();

    console.log("🚀 Grade 1 Demo: Vanilla scroll animations initialized");

    // Initialize decorative scroll dots (if not created by intro)
    try {
      initScrollDots();
    } catch (err) {
      // non-fatal
      console.warn("parallax dots init failed", err);
    }
    // Make hero scroll indicator actionable (click or keyboard -> scroll down)
    try {
      initScrollIndicator();
    } catch (err) {
      console.warn("scroll indicator init failed", err);
    }
    // Initialize cursor trail effect
    try {
      initCursorTrail();
    } catch (err) {
      console.warn("cursor trail init failed", err);
    }
    // Initialize animated skill progress bars
    try {
      initSkillBars();
    } catch (err) {
      console.warn("skill bars init failed", err);
    }
  };

  if (prefersReducedMotion) {
    // Skip fancy intro for users who prefer reduced motion
    runInits();
  } else {
    // Show intro overlay, then initialize when done
    createIntroOverlay().then(() => runInits());
  }

  // Mobile nav toggle behavior
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    // Initialize aria-hidden based on screen size
    const mobileQuery = window.matchMedia("(max-width:640px)");
    const setNavHidden = (isMobile) => {
      if (isMobile) {
        navLinks.setAttribute("aria-hidden", "true");
      } else {
        navLinks.setAttribute("aria-hidden", "false");
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    };
    setNavHidden(mobileQuery.matches);
    mobileQuery.addEventListener("change", (e) => setNavHidden(e.matches));

    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("open");
      // Reflect visibility for assistive tech
      navLinks.setAttribute("aria-hidden", String(expanded));
    });

    // Close mobile menu when a nav link is clicked
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.setAttribute("aria-hidden", "true");
      });
    });
  }

  // Initialize decorative scroll dots
  try {
    initScrollDots();
  } catch (err) {
    // non-fatal
    console.warn("parallax dots init failed", err);
  }
  // Make hero scroll indicator actionable (click or keyboard -> scroll down)
  try {
    initScrollIndicator();
  } catch (err) {
    console.warn("scroll indicator init failed", err);
  }
  // Initialize cursor trail effect
  try {
    initCursorTrail();
  } catch (err) {
    console.warn("cursor trail init failed", err);
  }
  // Initialize animated skill progress bars
  try {
    initSkillBars();
  } catch (err) {
    console.warn("skill bars init failed", err);
  }
});

// ===========================================================================
// INTRO: Loading overlay with exploding dots that seed the persistent dots
// ===========================================================================
function createIntroOverlay() {
  return new Promise((resolve) => {
    if (window._introShown) return resolve();
    window._introShown = true;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "intro-overlay";

    // Central blue dot
    const centerDot = document.createElement("div");
    centerDot.className = "intro-dot";
    // Use the site's muted blue color token if available, fall back to hex
    const rootStyles = getComputedStyle(document.documentElement);
    const blue = rootStyles.getPropertyValue("--color-text-muted") || "#241fb0";
    centerDot.style.background = blue.trim() || "#241fb0";
    centerDot.style.width = "36px";
    centerDot.style.height = "36px";
    centerDot.style.borderRadius = "50%";
    centerDot.style.boxShadow = "0 18px 40px rgba(0,0,0,0.12)";

    overlay.appendChild(centerDot);
    document.body.appendChild(overlay);

    // After a short delay, explode into particles
    const explodeDelay = 700; // ms
    const particleCount = 48;

    setTimeout(() => {
      const particles = [];
      const rect = centerDot.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.className = "intro-particle";
        const size = Math.random() * 10 + 4;
        p.style.position = "fixed";
        p.style.left = `${cx - size / 2}px`;
        p.style.top = `${cy - size / 2}px`;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.borderRadius = "50%";
        p.style.background = blue.trim() || "#241fb0";
        p.style.pointerEvents = "none";
        p.style.zIndex = 10999;
        p.style.transition = `transform 900ms cubic-bezier(.22,1,.36,1), opacity 900ms ease`;

        document.body.appendChild(p);
        particles.push(p);

        // compute random angle & distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 160;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        // apply transform in next frame to trigger transition
        requestAnimationFrame(() => {
          p.style.transform = `translate(${dx}px, ${dy}px) scale(${
            0.9 + Math.random() * 0.8
          })`;
          p.style.opacity = "0";
        });
      }

      // After particles finish, remove overlay & particles, then create persistent dots
      setTimeout(() => {
        particles.forEach((p) => p.remove());
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);

        // Seed persistent parallax dots so they match the exploded particles
        createPersistentDots(50);

        resolve();
      }, 1000);
    }, explodeDelay);
  });
}

function createPersistentDots(numDots = 50) {
  if (window._pageDotsInited) return;
  window._pageDotsInited = true;

  const dots = [];
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";

    const size = Math.random() * 10 + 5;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * (document.body.scrollHeight - window.innerHeight);
    const speed = Math.random() * 0.5 + 0.2;
    const delay = Math.random() * 3;

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.animationDelay = `${delay}s`;

    document.body.appendChild(dot);

    dots.push({ el: dot, baseY: y, speed, x });
  }

  let ticking = false;

  const updateDots = () => {
    const scrollY = window.scrollY;
    dots.forEach((dot) => {
      const y = dot.baseY - scrollY * dot.speed;
      dot.el.style.top = `${y}px`;
      const inView = y > -50 && y < window.innerHeight + 50;
      dot.el.style.display = inView ? "block" : "none";
    });
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateDots);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    dots.forEach((dot) => {
      dot.x = Math.random() * window.innerWidth;
      dot.el.style.left = `${dot.x}px`;
    });
    updateDots();
  });

  // store for possible future access
  window._pageDots = dots;

  // initial update
  updateDots();
}

// ==========================================================================
// 6. CLEANUP (FOR SPA ENVIRONMENTS)
// ==========================================================================

/**
 * Cleanup function for Single Page Application (SPA) routing.
 *
 * 🎓 WHY IS CLEANUP IMPORTANT?
 * In SPAs (React, Vue, etc.), pages don't fully reload when navigating.
 * If you don't disconnect observers, they keep watching elements that
 * may have been removed, causing memory leaks and bugs.
 *
 * 📐 WHEN TO CALL THIS:
 * - Before navigating away from this page in an SPA
 * - In React: useEffect cleanup function
 * - In Vue: onUnmounted lifecycle hook
 *
 * For traditional multi-page sites, this isn't needed (page reload cleans up).
 */
window.cleanupScrollObservers = () => {
  singleObserver.disconnect(); // Stop observing all elements
  staggerObserver.disconnect();
  console.log("🧹 Observers cleaned up");
};

// Scroll indicator: when clicked (or Enter/Space) scroll to the next section
function initScrollIndicator() {
  const indicator = document.querySelector(".scroll-indicator");
  if (!indicator) return;

  // Choose target: prefer #about, fallback to the next section after hero
  let target = document.querySelector("#about");
  if (!target) {
    const hero = document.querySelector("#hero");
    target = hero ? hero.nextElementSibling : null;
  }
  if (!target) return;

  // Make it behave like a button for accessibility
  indicator.setAttribute("role", "button");
  if (!indicator.hasAttribute("tabindex"))
    indicator.setAttribute("tabindex", "0");

  const doScroll = () => {
    const navHeight = document.querySelector(".nav")?.offsetHeight || 0;
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  };

  indicator.addEventListener("click", (e) => {
    e.preventDefault();
    doScroll();
  });

  indicator.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      doScroll();
    }
  });
}

// Cursor trail effect: create particles that follow and fade
function initCursorTrail() {
  // Skip if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (window._cursorTrailInited) return;
  window._cursorTrailInited = true;

  let lastX = 0;
  let lastY = 0;

  const createTrailParticle = (x, y) => {
    const particle = document.createElement("div");
    particle.className = "cursor-trail";

    // Random size between 4px and 10px
    const size = Math.random() * 6 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x - size / 2}px`;
    particle.style.top = `${y - size / 2}px`;

    document.body.appendChild(particle);

    // Add fade animation
    particle.classList.add("fade");

    // Remove particle from DOM after animation completes
    setTimeout(() => {
      if (particle.parentNode) particle.parentNode.removeChild(particle);
    }, 600);
  };

  const onMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Only create particles if mouse has moved far enough (distance threshold)
    const distance = Math.hypot(x - lastX, y - lastY);
    if (distance > 8) {
      createTrailParticle(x, y);
      lastX = x;
      lastY = y;
    }
  };

  document.addEventListener("mousemove", onMouseMove, { passive: true });
}

// Animated skill progress bars: animate width and count when in view
function initSkillBars() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    // If reduced motion, reveal final states immediately
    document.querySelectorAll(".skill").forEach((skill) => {
      const progress = skill.querySelector(".skill-progress");
      const percentage = skill.querySelector(".skill-percentage");
      const target = parseInt(skill.dataset.skill, 10) || 0;
      progress.style.width = target + "%";
      percentage.textContent = target + "%";
    });
    return;
  }

  const skills = Array.from(document.querySelectorAll(".skill"));
  if (!skills.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skill = entry.target;
          const progress = skill.querySelector(".skill-progress");
          const percentage = skill.querySelector(".skill-percentage");
          const target = parseInt(skill.dataset.skill, 10) || 0;

          if (!progress.classList.contains("animate")) {
            progress.classList.add("animate");
            // Set CSS width (uses --skill-width via inline style already)
            progress.style.width = target + "%";

            // Count up animation
            let current = 0;
            const duration = 1800; // ms
            const start = performance.now();

            const step = (now) => {
              const elapsed = now - start;
              const pct = Math.min(1, elapsed / duration);
              const value = Math.round(pct * target);
              percentage.textContent = value + "%";
              if (pct < 1) requestAnimationFrame(step);
              else percentage.textContent = target + "%";
            };
            requestAnimationFrame(step);
          }

          obs.unobserve(skill);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );

  skills.forEach((s) => observer.observe(s));
}
