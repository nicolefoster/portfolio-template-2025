# README: Plan & Report

## Purpose

Document the work performed to improve the repository `README.md` — adding a live demo link, quick start instructions, a clear guide for theme-based personalization, an AI usage policy, contribution instructions, and other helpful notes for users and contributors.

---

## Plan

### Objective

Create a concise, useful README that helps visitors: preview the live site, run the project locally, customize the design using theme tokens, understand how AI was used, and know how to contribute.

### Goals

- Provide a clear link to the deployed demo.
- Add step-by-step quick start instructions for local testing and GitHub Pages deployment.
- Explain where and how to customize visual tokens (`assets/css/themes.css`).
- Add an AI use policy / attribution line.
- Include contributing instructions, notes for accessibility, and contact/licensing info.

### Implementation steps (planned)

1. Open and read the existing `README.md` to capture current content.
2. Replace the placeholder text with structured sections: Overview, Quick Start, Personalization, Accessibility, AI Use Policy, Contributing, Notes, License, Contact.
3. Add example commands for local serving and cloning.
4. Add recommended tokens and file locations for theme edits.
5. Add a short AI policy paragraph and a suggested attribution line.
6. Save `README.md` and document the changes in a plan/report file (`docs/Plan/plan-readme.md`).

---

## Report — Changes Applied

Files reviewed and changed

- `README.md` — replaced minimal placeholder content with a full guide including demo link, quick start, personalization instructions, AI policy, contributing steps, notes, license and contact info.
- `docs/Plan/plan-readme.md` — (this file) documents the plan and records the exact changes and rationale.

Key edits in `README.md` (high level)

- Added: Live demo URL pointing to the GitHub Pages deployment.
- Added: Quick Start section with commands to clone, serve locally with `python3 -m http.server`, and notes about GitHub Pages deployment.
- Added: 'Personalizing the Theme' section detailing `assets/css/themes.css` tokens to change fonts, colors, spacing and guidance to add tokens like `--color-card-bg` for maintainability.
- Added: Accessibility section encouraging WCAG contrast checks when changing colors.
- Added: AI Use Policy with recommended attribution text: "This project was developed with assistance from AI tools. All code and content were reviewed and adapted by the author.".
- Added: Contributing, Notes & Tips, License, and Contact sections.

Before → After (excerpt)

Before (existing README):

```markdown
# Hi

> by @nicolefoster

You can find the project deployed here: [https://nicolefoster.github.io/portfolio-template-2025/]

to costumize the style of this template you just have to change the themes
```

After (new README highlights):

```markdown
# Portfolio Template 2025

By @nicolefoster

Live demo: https://nicolefoster.github.io/portfolio-template-2025/

## Overview

This is a lightweight, vanilla-HTML/CSS/JS portfolio template designed to be
easy to customize and deploy. It uses CSS custom properties (theme tokens)
to centralize typography, colors, spacing and layout decisions so you can
personalize the whole site from a single file.

## Quick Start

1. Clone the repo: `git clone ...`
2. Serve locally: `python3 -m http.server 8000`
3. Deploy: use GitHub Pages

## Personalizing the Theme (recommended)

Edit `assets/css/themes.css` tokens such as `--color-bg`, `--color-accent`,
`--font-family-base` to change the whole site.

## AI Use Policy

This project was developed with assistance from AI tools. All code and
content were reviewed and adapted by the author.
```

Rationale

- The new README is designed to lower the barrier for other users to run,
  personalize and contribute to the project. Centralizing customization
  instructions on `themes.css` reduces accidental inconsistencies.
- Adding an AI policy provides transparency about tool usage and encourages
  reviewers to double-check generated outputs.

Accessibility & Maintenance Notes

- After changing theme colors, verify contrast (WCAG AA) for body text and
  interactive elements. Use the design tokens for easy global updates.
- Consider adding `--color-card-bg` token if more surfaces need a stable
  background color separate from the global page background.

Next steps / Recommendations

1. If you want, I can add a small screenshot or animated GIF to the README to
   preview the design (I can generate a simple screenshot from the local file).
2. Add a badge for GitHub Pages or CI if you set up a workflow.
3. If you prefer a different local server command (e.g., `serve` from npm),
   I can add that as an alternative.

Status

- Plan: completed
- Report: written (this file)

---

If you'd like, I will now:

- add a screenshot to the README, OR
- create the `--color-card-bg` token in `assets/css/themes.css` and update
  `.project-card` to use it for maintainability.
