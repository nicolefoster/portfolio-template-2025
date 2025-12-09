# Parallax Scrolling Dots — Plan & Report

**Purpose:** Document the design, implementation, and decisions for the parallax scrolling decorative dots added to the portfolio. The feature creates small blue dots that appear while the user scrolls and move with a subtle parallax effect.

**Files changed:**

- `index.html`: removed an earlier `parallax-dots` container and retained core structure; the dot elements are appended to `document.body` by JS.
- `assets/css/layout.css`: added `.dot` CSS and `@keyframes fadeInOut` to style and animate dots; respects `prefers-reduced-motion`.
- `assets/js/main.js`: added `initScrollDots()` which generates dots, appends fixed `.dot` elements to the DOM, and updates their positions on scroll using requestAnimationFrame.

---

**Plan (goals)**

- Add decorative dots that appear only while scrolling to provide a subtle, dynamic texture to the page.
- Keep the visual effect lightweight and performant (use transforms, rAF, passive listeners).
- Respect accessibility: disable for `prefers-reduced-motion` and avoid interfering with interactive elements.
- Provide an easy way to tune number, color, and size.

**Implementation details**

- Dot generation:

  - JavaScript creates `numDots` fixed-position `<div class="dot">` elements and appends them to `document.body` so they overlay the viewport.
  - Each dot stores a `baseY` and `speed` so the script computes a parallax Y position using `baseY - scrollY * speed`.
  - Dots are shown/hidden by setting `display: block|none` depending on whether their computed Y is within the viewport bounds.

- Performance:

  - All position updates run inside a `requestAnimationFrame` loop with a `ticking` flag to avoid layout thrashing and multiple queued rAFs.
  - CSS animations for opacity/scale (`fadeInOut`) are GPU-friendly and short; transforms are used for movement.
  - Scroll listeners are passive where appropriate.

- Accessibility & preferences:

  - `initScrollDots()` checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and aborts if the user prefers reduced motion.
  - Dots use `pointer-events: none` to avoid intercepting clicks.

- Styling:
  - `.dot` uses the accent blue color: `background: rgba(42, 36, 245, 0.95)` and a small size range (5–15px). The `fadeInOut` keyframes animate opacity and scale to make dots fade/appear smoothly.

**Why this approach**

- Appending fixed elements to `body` keeps the implementation decoupled from page layout and ensures dots always track the viewport.
- rAF-based updates are the most performant cross-browser approach for scroll-driven transforms when not using scroll-linked animations.
- Respecting `prefers-reduced-motion` prevents discomfort for motion-sensitive users.

---

**Report — What we did**

- Implemented dot generation in `assets/js/main.js` with initialization guard to avoid duplicate creation.
- Added `.dot` CSS and `@keyframes fadeInOut` to `assets/css/layout.css`; dots are hidden with media query for reduced motion.
- Removed the earlier `parallax-dots` container from `index.html` in favor of fixed `.dot` elements appended to `body`.

**Configuration & tuning**

- `numDots` (currently `50`) controls density. Lower for better mobile performance (e.g., 12–20).
- Dot size and opacity are set inline during creation; you can centralize these in CSS or use CSS variables in `assets/css/themes.css`.

**Testing & verification**

- Manual test: served site locally and scrolled — dots appear and move; they hide when scroll stops.
- Accessibility test: enabling OS-level Reduce Motion prevented dot creation.

**Next steps / Recommendations**

- Lower `numDots` for small-screen devices, or dynamically compute based on `window.innerWidth`.
- Extract the accent color to use `--color-accent` in CSS and reference it for dot color to keep theme tokens consistent.
- Consider using CSS Scroll-Linked Animations (`animation-timeline`) for browsers that support it for even smoother effects.
- Optionally bind dot visibility to specific sections (hero-only) instead of global viewport overlay.

**Status:** Completed — the parallax scrolling dots feature is implemented, accessible, and documented.
