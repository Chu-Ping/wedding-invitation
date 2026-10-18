# Instructions for the project agent

## Project goal

Help create an interactive wedding invitation that guests can open in a desktop web browser without installing software. The experience may feel like a small game, with clickable items, zooming, scene changes, animation, and cutscenes. The exact story, scenes, and visual design have not been decided yet.

## Start here

1. Read `README.md` and `CREATIVE_BRIEF.md`, then inspect the project files before changing anything.
2. Start with a small, runnable browser prototype and keep it easy to preview locally. Use only information supplied in the project files; do not invent names, dates, places, story details, or visual preferences.
3. Where details are missing, leave clear `TODO` placeholders in the project files or code. Never show unfinished placeholders as if they were final invitation content.
4. Use HTML and CSS for the page, presentation, and simple transitions. Add JavaScript only when interaction needs state or logic that HTML and CSS do not handle cleanly.
5. Prefer plain web technologies and open-source dependencies. Do not add a framework or service without a clear need; record any dependency and its license.
6. Keep invitation details readable and make interactive controls usable with a mouse and keyboard. Respect reduced-motion preferences when adding animation.
7. Before finishing a change, run the project using the available workflow and check the affected scenes and interactions in a browser when possible. Update `README.md` if setup or preview steps change.

## Source of truth

`CREATIVE_BRIEF.md` holds the current experience requirements and fields to be filled in. If it conflicts with an assumption in code or another note, follow the brief and remove the unsupported assumption. Ask the user only when a decision is essential to proceed; otherwise build a neutral scaffold and leave the decision open.
