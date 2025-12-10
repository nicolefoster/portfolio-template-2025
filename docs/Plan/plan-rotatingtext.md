**Plan — Rotating Text Component**

- **Goal:** Replace the static hero subtitle with a concise, animated rotating phrase that reads: "I'm a Designer | Developer | Creator". The words "Designer", "Developer" and "Creator" rotate in the same location with smooth fade + slide animations.

- **User specifications implemented:**
  - Use CSS keyframe animations for rotation.
  - Each word fades in from bottom (translateY down → center), then fades out to top (translateY up).
  - Words are positioned absolutely inside a single container so they animate in the same spot.
  - Animation delays: `Designer` at 0s, `Developer` at 3s, `Creator` at 6s.
  - Total animation cycle: 9s, looping infinitely.
  - Each word displays for 3s.
  - Responsive media query adjustments for mobile.
  - Hero content centered using flexbox.

**Files changed**

- `index.html`

  - Replaced the static subtitle text with a rotating-text markup:
    - `<span class="rotating-prefix">I'm a&nbsp;</span>`
    - `<span class="rotating-words">` containing three `<span class="rotating-word" style="animation-delay: Xs">…</span>` children (0s, 3s, 6s).
  - The rotating words are marked `aria-hidden="true"` so screen readers aren't repeatedly announcing them (see Accessibility notes below).

- `assets/css/layout.css`
  - Added styles to center `.hero-content` with flexbox (`display: flex; flex-direction: column; align-items: center`).
  - Implemented `.rotating-prefix`, `.rotating-words`, and `.rotating-word` rules.
  - Keyframes `@keyframes rotateWord` implement the three-stage animation per word: fade-in/slide-from-bottom → visible center → fade-out/slide-to-top.
  - Each `.rotating-word` runs the same 9s animation and uses inline `animation-delay` values (0s/3s/6s) to stagger words so each is visible for ~3s.
  - Added `white-space: nowrap` on the subtitle for desktop to keep prefix and words on one line, and a mobile media query to allow wrapping and smaller offsets.
  - To ensure visual alignment, words are vertically centered using `top: 50%` plus `translateY(calc(-50% ± offset))` so the words' center matches the prefix baseline; a CSS variable `--rotate-offset` controls slide distance.

**Accessibility & progressive enhancement**

- The animated words are `aria-hidden="true"` to avoid noisy repetition for screen reader users. If you want the current role announced, we can add a small `aria-live` region that updates when the visible word changes.
- The animation respects user motion preferences where applicable (the rest of the site uses `prefers-reduced-motion` fallbacks elsewhere); if you want an explicit reduced-motion rule for the rotating text, I can add it to show the first word statically.

**Testing & verification steps performed**

- Verified markup insertion in `index.html` and that the three rotating-word elements have inline delays (0s, 3s, 6s).
- Confirmed CSS contains the `rotateWord` keyframes and responsive overrides at `@media (max-width: 640px)`.
- Performed visual alignment adjustments so animated words use `top:50%` + `translateY(-50%)` center logic to line up with the static prefix.

**Notes / Next recommendations**

- Optionally add an `aria-live` announcer to provide screen reader updates without repeating the phrase constantly. Implementation approach:
  - Keep animated words `aria-hidden`.
  - Use a visually-hidden `<div aria-live="polite">` and update its text via a small JS callback when a new word becomes visible (the existing animation delays or IntersectionObserver can drive this).
- Optionally center the rotating word text relative to the prefix by switching `.rotating-word { text-align: center }` if you prefer that visual style.
- Small tweak suggestion: adjust `--rotate-offset` (in `assets/css/layout.css`) by ±0.1em if you want the slide distance subtly shorter or longer.

**Author's note**

- The rotating text implements the user's exact timing and motion requirements: 3s per word, 9s loop, staggered delays (0 / 3 / 6s), fade/slide motion, absolute positioning in one container, and responsive handling. If you'd like any accessibility enhancements or a slightly different alignment (center vs left), tell me which option and I will apply it.
