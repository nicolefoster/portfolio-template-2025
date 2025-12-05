# Background Gradient: Plan & Report

## Purpose

Document the change we made to the site's background — replacing the single-color/beige background with a lively 90deg gradient — and outline options to make it "more fun" and less minimalistic.

---

## Plan

### Objective

Apply a warm, multi-stop gradient as the global background so the entire site (including behind the navigation) shows the new gradient. Keep accessibility and visual hierarchy intact while enabling future iterations toward a more playful look.

### Goals

- Make the gradient the single source of truth for page and section backgrounds via CSS tokens.
- Ensure the navigation and mobile menus inherit or show the gradient beneath their elements.
- Preserve text contrast and readability with the bright-blue accent color (`#2A24F5`).
- Provide a short set of optional, low-effort enhancements to make the background feel "more fun" and less minimalistic.

### Implementation Steps

1. Update `--color-bg` and `--color-bg-alt` in `assets/css/themes.css` to the provided 90deg gradient.
2. Replace `body` background and `.hero-bg` gradient to the same 90deg gradient as needed (so pages load with the gradient even before other CSS tokens are resolved).
3. Confirm `.nav` and `.nav-links` use `var(--color-bg)` / `var(--color-bg-alt)` so the gradient shows behind the fixed nav and mobile menu.
4. Run a quick visual check for contrast (headings, body text, pills) and tweak muted colors if necessary.

---

## Report: Changes Applied

What we changed:

- `assets/css/themes.css`

  - Replaced `--color-bg` and `--color-bg-alt` with:
    `linear-gradient(90deg, #feffeb, #fff9e2, #fff1dc, #ffe9db, #ffe2df, #ffdbe7, #ffd6f2, #ffd4fe)`

- `assets/css/base.css`

  - Updated `body` to use the new gradient:
    `background: linear-gradient(90deg, ...);`

- `assets/css/layout.css`
  - Updated `.hero-bg` to the same 90deg gradient so the hero area matches the global background.

Why this works:

- Setting the gradient in design tokens (`--color-bg`, `--color-bg-alt`) makes the gradient the single source of truth; other components that reference these tokens now inherit the gradient automatically (including the fixed navigation which references `var(--color-bg)`).
- Applying the gradient to `body` ensures the background is present before other components render and avoids momentary flashes of a different color during load.

Accessibility note:

- The site's primary accent color (`#2A24F5`) remains unchanged; contrast should be checked on key interactive elements (buttons, nav pills). If contrast is insufficient, we should increase text weight or add subtle outlines/shadows behind text for legibility.

---

## Suggestions to Make the Background "More Fun" (Less Minimalistic)

If you want a livelier, less minimal look, try one or more of these options. Each is ordered from low-effort → moderate-effort.

1. Subtle animated gradient shift

   - Add a slow, looping background animation that shifts the gradient's position or color stops. Keeps the feel playful without distracting from content.
   - Example: use `@keyframes` to animate `background-position` or CSS variables controlling color stops.

2. Layered soft patterns

   - Overlay a very-low-opacity noise/texture or radial-light spots PNG/SVG to give organic depth.
   - Use `background-blend-mode` to combine gradient + texture for richer color.

3. Accent shapes or blobs

   - Add large, soft, slightly transparent SVG blobs or gradients positioned behind sections (hero and footer). Use different blend modes and subtle motion (parallax) for personality.

4. Interactive parallax layers

   - Introduce a 2–3 layer parallax (slow-moving abstract shapes) that respond to mouse movement or scroll to add playful depth.

5. Colorful particle or confetti layer (sparingly)

   - For special occasions (promo, launch), enable a lightweight particle/confetti effect that can be toggled on.

6. Gradient variants per section
   - Use slightly different gradients (same family of colors) for each major section to create a quilted, colorful site while maintaining cohesion via shared accent colors.

Design tips:

- Keep animations slow and subtle (10–30s loops) to avoid distraction.
- Maintain text contrast — always test with real content and various screen sizes.
- Provide a reduced-motion preference (respect `prefers-reduced-motion`).

---

## Quick Implementation Examples

- Animated gradient (CSS sketch):

```css
@keyframes slowShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-bg {
  background: linear-gradient(
    90deg,
    #feffeb,
    #fff9e2,
    #fff1dc,
    #ffe9db,
    #ffe2df,
    #ffdbe7,
    #ffd6f2,
    #ffd4fe
  );
  background-size: 200% 200%;
  animation: slowShift 30s linear infinite;
}
```

- Soft SVG blob (example placement):

```html
<svg class="bg-blob" viewBox="0 0 600 600" aria-hidden="true">...</svg>
```

And CSS:

```css
.bg-blob {
  position: absolute;
  left: -10%;
  top: -10%;
  width: 60%;
  opacity: 0.14;
  filter: blur(40px);
}
```

---

## Next Steps

- If you want, I can:
  - Implement the subtle animated gradient (`.animated-bg`) and update `body` to use it (low effort), OR
  - Add a soft SVG blob behind the hero and tweak blend modes for a more playful look (moderate effort).

Marking this todo complete.
