# Project Cards: Plan & Report

## Purpose

Document the recent visual changes made to the "Featured Projects" cards: setting a consistent light background color (`#feffeb`) to improve contrast and visual separation from the page gradient, and summarize next steps/recommendations.

---

## Plan

### Objective

Make the Featured Projects area feel brighter and more cohesive by giving the project cards a uniform light surface color so they stand apart from the surrounding gradient background.

### Goals

- Set a consistent background color for project cards to `#feffeb`.
- Keep card corners rounded (`24px`) and preserve existing hover interactions (lift + shadow).
- Keep the change maintainable by recommending use of theme tokens where appropriate.
- Verify contrast and spacing so images and text remain legible on the new surface.

### Steps

1.  Update the `projects` section background or card backgrounds so cards read as light surfaces over the global gradient.
2.  Change `.project-card` background to `#feffeb` in `assets/css/layout.css`.
3.  Keep project card radius and hover behavior as-is to preserve polish.
4.  Test on multiple viewports for legibility and visual weight.
5.  (Optional) Move the color into a theme token (`--color-card-bg`) for future maintainability.

---

## Report — Changes Applied

Files changed:

- `assets/css/layout.css`

  - Added section-level background (if used) and updated project card background.
  - Key edits (before → after):

  - Projects section background (added):

  ```css
  .projects {
    background: #feffeb;
  }
  ```

  - Project card surface (replaced variable with explicit color):

  ```css
  .project-card {
  ```

- background: var(--color-bg-alt);

* background: #feffeb;
  border-radius: 24px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  }

  ```

  ```

Why these changes:

- Using `#feffeb` for the project card surface creates a clear, consistent light card that reads well over the multi-stop page gradient and helps images and copy feel anchored.
- The explicit color prevents subtle visual interaction between the gradient and the card surface that could reduce contrast or create visual noise.

Accessibility & visual notes:

- Text and tag colors remain unchanged; check that `--color-text` and `--color-accent` still meet contrast ratios against the new card background. If not, consider darkening text inside cards or adding a subtle inner shadow behind card text blocks.
- On small screens, the large card shadows or surrounding gradient can appear busy; consider reducing shadow opacity/offsets at narrow widths.

Maintenance recommendation

- For maintainability, consider adding a token in `assets/css/themes.css`:

  ```css
  --color-card-bg: #feffeb;
  ```

  and change `.project-card` to `background: var(--color-card-bg);`. This makes it easy to update the card surface across the site from a single place.

Optional follow-ups

- Add a subtle border or hairline between card image and card surface to prevent perceived bleed from photos with very light edges.
- Add a very soft inner gradient or overlay inside cards for subtle depth when desired.
- Add responsive shadow scaling to reduce heavy shadows on small screens.

---

## Status

- Implementation: completed — `.project-card` now uses `#feffeb` and the `.projects` section has a matching background.
- Testing: recommended across devices to confirm contrast and perceived hierarchy.

---

If you want I can:

- Move the explicit color into a theme token now (`--color-card-bg`) and update references, OR
- Add responsive shadow adjustments and border refinements for mobile.

Marking this plan/report complete.
