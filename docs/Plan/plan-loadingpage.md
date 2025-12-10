**Plan — Loading Page (Intro Overlay + Exploding Dots)**

- **Goal:** Provide a graceful loading/intro experience that begins with a single blue dot centered on the screen and then expands into the decorative parallax dots used across the site. The transition should be smooth, accessible (respecting `prefers-reduced-motion`), and should seed the persistent parallax dots so the visual language feels cohesive.

- **High-level approach implemented:**
  - A DOM-overlay (`.intro-overlay`) is temporarily appended to `document.body` containing a central dot element (`.intro-dot`).
  - After a short hint (gentle scale pulse), the central dot explodes into multiple small particles which animate outward.
  - When the explosion animation completes the overlay fades out; then persistent `.dot` elements are created and the main site initialization runs.
  - The entire sequence is skipped for users who prefer reduced motion.

**Files changed**

- `assets/js/main.js`

  - Added `createIntroOverlay()` which:
    - Appends an `.intro-overlay` with a center dot.
    - Runs a small scale pulse to cue the explosion.
    - Spawns ~48 temporary `.intro-particle` elements with randomized angles, distances and sizes and transitions them outward.
    - After particle animation, fades the overlay (`.intro-overlay.fade-out`) and removes temporary particles and overlay only after the CSS transition completes.
    - Calls `createPersistentDots()` to create the longer-lived `.dot` elements and set up parallax scroll handlers.
  - Added `createPersistentDots(num)` which creates the persistent `dot` elements used by the parallax system, and installs the scroll/resize handlers that move those dots.
  - Updated DOMContentLoaded flow to:
    - Respect `prefers-reduced-motion`.
    - Run `createIntroOverlay()` (returns a Promise) and wait for it to resolve before running the rest of the initialization (scroll animations, cursor trail, skill bars, etc.).

- `assets/css/layout.css` (already contained styles)
  - Uses existing rules for `.intro-overlay` and `.intro-dot` to center and style the overlay + dot. JavaScript sets the dot color to the theme token `--color-text-muted` (fallback `#241fb0`) for consistency.
  - Uses `.intro-overlay.fade-out` to fade the overlay smoothly (CSS transition matched in the JS wait timer).

**Why this design**

- The overlay prevents abrupt content pop-in and provides a single, branded visual moment (the blue dot) that logically morphs into the page's decorative dots. This keeps visual continuity between the intro and the parallax elements used while scrolling.
- Using a Promise-based `createIntroOverlay()` allows initial page logic to wait until the overlay completes — improving UX without complicating the main initialization code.
- Respecting `prefers-reduced-motion` is essential for accessibility and performance.

**Smoothing & UX polish applied**

- A gentle scale pulse on the center dot before explosion cues the user without being jarring.
- The overlay uses a fade-out transition; the JS waits for the fade to finish before removing DOM elements so the handoff is visually smooth.
- Particles are removed after the fade, then persistent dots are created. This keeps the short-lived visual effect separate from the long-lived parallax dots.

**Performance & accessibility considerations**

- Reduced-motion users skip the intro entirely and the page initializes immediately.
- The particle count is moderate (48) to balance visual density and performance. This can be reduced on smaller screens or low-end devices.
- The persistent dots creation uses `requestAnimationFrame` updates for scroll-driven position updates to keep the main thread responsive.

**Files to inspect for tuning**

- `assets/js/main.js` — timing values: `explodeDelay` (default 700ms), particle transition (900ms), overlay fade wait (approx 460ms). Adjust these if you want faster/slower transitions.
- `assets/css/layout.css` — the `.intro-overlay`, `.intro-dot`, and `.dot` rules control visual appearance; swap the solid blue for the existing radial gradient if you prefer a softer entrance.

**Testing performed**

- Verified `createIntroOverlay()` exists and returns a Promise used by DOMContentLoaded initialization.
- Confirmed reduced-motion branch skips the intro path.
- Confirmed the overlay fade class is added and JS waits before removing nodes (prevents abrupt DOM changes during transitions).

**Next steps / optional enhancements**

- Reduce particle count on mobile (conditional based on `window.innerWidth`).
- Use the explosion particles themselves as persistent dots (keep the elements and convert them rather than removing them and creating new dots) — this would create a literal continuity but needs extra bookkeeping.
- Add an `aria-live` friendly short load message for screen readers while the intro runs (keeps overlay `aria-hidden` or uses a polite announcer).

**Author's note**

- The loading page is implemented to be visually pleasing and performant while honoring accessibility settings. Tell me which follow-up you'd like (reduce mobile particles, use gradient intro dot, or keep particle elements as persistent dots) and I'll apply it.
