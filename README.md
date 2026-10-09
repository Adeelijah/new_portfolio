# Elijah — Web Developer Portfolio

A responsive, single-page portfolio with a CSS 3D kinetic sculpture, project tilt interactions, scroll reveals, and reduced-motion support. No build step or runtime dependencies.

## Run locally

From the repository directory, run `python -m http.server 8000` and open http://localhost:8000.

## Netlify

Build command: leave blank. Publish directory: `.`. The included netlify.toml sets this automatically.

## Content

Projects: Richlogistics, Wemisville Driving School, and Ifeoluwa Odejinmi. Email and WhatsApp are taken from the existing résumé. The retained résumé predates the rebuild and should be reviewed before public release. The Wemisville and Ifeoluwa project artwork is an illustrative introduction, rather than a screenshot of the live page.

## Motion and accessibility

Motion can be paused with the persistent button. System reduced-motion preferences are respected. Content remains visible without JavaScript; navigation and project links are standard accessible anchors.

## Toolbox logos

The continuous carousel uses locally embedded Simple Icons SVGs (v13.0.0, CC0), sourced from https://github.com/simple-icons/simple-icons/tree/13.0.0/icons. The Framer mark represents Framer Motion. Technology marks belong to their respective owners. The loop's duplicate list is hidden from assistive technology; hover/focus and the global motion button pause it. With system reduced motion it becomes a manually scrollable single list.
