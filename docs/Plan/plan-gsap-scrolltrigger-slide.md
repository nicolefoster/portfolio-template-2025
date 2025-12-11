**Plan — GSAP ScrollTrigger Slide-In Animations for Skills Cards**

- **Goal:** Implement scroll-triggered animations that reveal the "My Skills" and "Progress Bars" cards with elegant slide-in effects from opposite sides. When the user scrolls to the skills section, both cards animate into view simultaneously: one from the left, one from the right.

- **User specifications implemented:**
  - Register GSAP's ScrollTrigger plugin.
  - Create two scroll-triggered animations:
    - **Left card** ("My Skills"): slides in from the left (x: -100) with fade-in (opacity: 0)
    - **Right card** ("Progress Bars"): slides in from the right (x: 100) with fade-in (opacity: 0)
  - Both animations:
    - Duration: 1 second
    - ScrollTrigger configuration: start at "top 80%" (trigger when element is 80% down viewport)
    - toggleActions: "play none none reverse" (play on enter, reverse on leave)
  - Animations activate automatically when scrolling into the skills section.

**Files changed**

- **`index.html`**

  - Added ScrollTrigger CDN before closing `</body>`:
    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    ```
  - Updated `.skills-panel` class:
    - Removed `.animate-on-scroll` (conflicted with GSAP animation)
    - Added `.slide-left` class for GSAP to target
    - Result: `class="skills-panel slide-left"`
  - Updated `.skills-progress` class:
    - Added `.slide-right` class for GSAP to target
    - Result: `class="skills-progress slide-right"`

- **`assets/js/gsap-animations.js`**
  - Added plugin registration: `gsap.registerPlugin(ScrollTrigger)`
  - Created `initScrollTriggerAnimations()` function with two animations:
    - **Slide-left animation** (My Skills card):
      - Targets: `.slide-left`
      - Initial state: x: -100, opacity: 0
      - Final state: x: 0, opacity: 1 (via gsap.from())
      - Duration: 1 second
      - ScrollTrigger: start at "top 80%", toggleActions enabled
    - **Slide-right animation** (Progress Bars card):
      - Targets: `.slide-right`
      - Initial state: x: 100, opacity: 0
      - Final state: x: 0, opacity: 1
      - Duration: 1 second
      - ScrollTrigger: start at "top 80%", toggleActions enabled
  - Called `initScrollTriggerAnimations()` in DOMContentLoaded event (runs independently of intro overlay).

**Implementation flow**

1. Page loads → hero title fades in (existing GSAP animation)
2. User scrolls down toward skills section
3. When skills cards enter 80% threshold of viewport:
   - ".My Skills" card slides in smoothly from the **left**
   - "Progress Bars" card slides in smoothly from the **right**
   - Both complete in 1 second with smooth easing
4. If user scrolls back up:
   - Animations reverse (cards slide back out)

**Technical decisions & fixes**

- **Removed `.animate-on-scroll`** from `.skills-panel`:

  - Initial issue: both cards disappeared because `.animate-on-scroll` CSS was setting elements to invisible/hidden state before GSAP could animate them.
  - Solution: Removed conflicting CSS class and let GSAP handle the animation entirely.
  - Result: Smooth, clean animations with no glitches.

- **Used valid CSS classes** instead of HTML attributes:

  - Initial attempt: used `slide-right` as an HTML attribute (invalid)
  - Fix: Changed to proper CSS class: `class="skills-progress slide-right"`
  - GSAP selector: `document.querySelector(".slide-right")`

- **ScrollTrigger configuration**:
  - `start: "top 80%"`: Animations trigger when the card's top edge reaches 80% down the viewport (slightly before fully visible for better UX)
  - `toggleActions: "play none none reverse"`:
    - Play: animation starts when condition is met
    - Reverse: animation reverses if user scrolls back

**Performance & accessibility**

- **GPU-accelerated**: Uses `x` (translateX) and `opacity` transforms for smooth 60fps performance
- **Respects reduced motion**: ScrollTrigger animations coexist with the intro fade-in (which respects `prefers-reduced-motion`)
- **Non-blocking**: ScrollTrigger runs independently and doesn't interfere with other page animations
- **Lightweight**: ScrollTrigger plugin is ~10KB minified

**Tuning options**

- **Animation duration**: Change `duration: 1` to 0.6 (faster) or 1.5 (slower)
- **Trigger timing**: Change `start: "top 80%"` to "top 60%" (trigger higher on page) or "top 90%" (trigger lower)
- **Slide distance**: Change `x: -100` or `x: 100` to larger/smaller values for more/less movement
- **Reversibility**: Change `toggleActions: "play none none reverse"` to "play pause resume none" to pause instead of reverse
- **Easing**: Add `ease: "power3.out"` or other GSAP easing functions for different feels

**Testing performed**

- Verified ScrollTrigger CDN loads correctly
- Confirmed both cards animate on scroll with no visual conflicts
- Tested removability: cards reverse animation when scrolling back up
- Verified no class conflicts or CSS cascade issues
- Confirmed animations are smooth and performant
- Tested on various scroll speeds (quick vs. slow scrolling)

**Next steps / optional enhancements**

- Add stagger delay between left and right animations for sequential feel: `delay: 0.2`
- Add more elements to scroll timeline: project cards, buttons, text blocks
- Create GSAP Timeline to coordinate multiple animations in sequence
- Add parallax ScrollTrigger animations for depth effect
- Create reusable GSAP animation utilities for other page sections

**Author's note**

The ScrollTrigger animations bring the skills section to life with elegant, directional slide-ins. The left-right opposition creates visual balance and draws the eye. The 1-second duration feels responsive without being rushed. Combined with the hero fade-in animation, the portfolio now has a polished, professional animation narrative that guides the user through the content.
