**Plan — GSAP Fade-In Animation for Hero Title**

- **Goal:** Implement a smooth fade-in and slide-up animation for the "Nicole Foster" hero title using the GSAP animation library. The animation triggers after the loading page (intro overlay) completes, creating a polished entrance effect that highlights the portfolio owner's name.

- **User specifications implemented:**
  - Use GSAP (GreenSock Animation Platform) library via CDN.
  - Animate the `.hero-title` element ("Nicole Foster") from below with opacity 0 → fading in as it slides up.
  - Animation properties:
    - y: 50 (starts 50px below)
    - opacity: 0 (starts invisible)
    - duration: 3 seconds (slow, elegant)
    - ease: "power2.out" (professional easing)
    - delay: 1 second (waits before starting)
  - Trigger only after the intro overlay disappears.
  - Respect `prefers-reduced-motion` for accessibility.

**Files changed**

- **`index.html`**

  - Added GSAP CDN before closing `</body>`:
    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    ```
  - Added link to custom GSAP animation script:
    ```html
    <script src="./assets/js/gsap-animations.js"></script>
    ```
  - Updated footer copyright: "Jane Developer" → "Nicole Foster"

- **`assets/css/layout.css`**

  - Set initial state for `.hero-title`:
    - `opacity: 0` (invisible on page load)
    - `transform: translateY(50px)` (positioned 50px below)
  - This ensures the element is hidden before GSAP animation starts, eliminating visual glitches.

- **`assets/js/gsap-animations.js`** (new file)
  - Created custom animation script that:
    - Checks if GSAP library is loaded.
    - Selects the `.hero-title` element.
    - Uses `gsap.to()` to animate from CSS initial state to visible:
      - Opacity animates from 0 → 1
      - Y position animates from 50px → 0
      - Duration: 3 seconds (slow, elegant)
      - Ease: "power2.out" (professional smoothing)
      - Delay: 1 second (waits before starting)
    - Detects when the intro overlay has disappeared from the DOM.
    - Triggers animation only after intro completes (or immediately if `prefers-reduced-motion`).

**Implementation flow**

1. Page loads → intro overlay shows and plays explosion animation (~2.4s total)
2. Overlay fades out and is removed from DOM (~0.46s)
3. Script detects overlay is gone (checks every 100ms)
4. After 1-second delay, GSAP animation begins
5. "Nicole Foster" slides up from below while fading in (3 seconds)
6. Title remains visible and positioned normally

**Accessibility & progressive enhancement**

- Respects `prefers-reduced-motion`: users with reduced-motion preference skip the intro overlay entirely and GSAP animation runs immediately.
- CSS initial state ensures no visible glitch or flash before animation.
- Uses vanilla GSAP (no additional plugins), keeping library footprint small.
- Animation delay and duration are generous (3s + 1s delay = 4s total) ensuring smooth, professional appearance without rushing.

**Performance considerations**

- GSAP is loaded via CDN (minified, ~20KB).
- Animation uses GPU-accelerated transforms (`translateY`, `opacity`) for smooth 60fps performance.
- Script checks for overlay removal every 100ms, switching to polling once overlay exists (minimal overhead).
- No continuous scroll listeners; animation triggers once on page load.

**Tuning options**

- **Duration**: Change `duration: 3` to `duration: 2` for faster, or `duration: 4` for even slower.
- **Delay**: Change `delay: 1` to adjust wait time after intro completes.
- **Easing**: Change `ease: "power2.out"` to "power3.out" (even smoother) or "back.out" (subtle bounce).
- **Slide distance**: Change CSS `transform: translateY(50px)` to more or less vertical movement.

**Testing performed**

- Verified GSAP CDN loads correctly.
- Confirmed animation triggers only after intro overlay is removed.
- Confirmed no visual glitch, flash, or double animation.
- Tested with `prefers-reduced-motion` enabled (animation runs immediately without intro).
- Verified animation duration and delay values work as specified.

**Next steps / optional enhancements**

- Add subtitle animation (`.hero-subtitle`) with staggered delay for sequential reveal.
- Add button animation (`.btn--glass`) to continue the hero sequence.
- Use GSAP Timeline to orchestrate multiple animations in sequence.
- Create a reusable GSAP animation function for other page elements.

**Author's note**

The GSAP fade-in animation provides a polished, professional entrance for the portfolio. The slow 3-second duration and 1-second delay create an elegant moment that draws attention to the name while respecting accessibility preferences. The animation is performant and non-intrusive, enhancing the user experience without being obtrusive.
