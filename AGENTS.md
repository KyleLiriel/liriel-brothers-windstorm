# AGENTS.md

## Project goal

Build a small 2D browser game prototype using Phaser, TypeScript and Vite.

The game is about two young brothers in a heroic fantasy world:
- Kyle Liriel, 8 years old, wind mage apprentice.
- Paul Liriel, 12 years old, lightning mage apprentice.

Kyle often makes mistakes, cries easily, and believes Paul is secretly a dark mage.
Paul is arrogant, protective, and believes Kyle is a mischievous goblin.

The tone should be funny, tender, adventurous and lightly absurd.

## Technical stack

- Phaser 3
- TypeScript
- Vite
- npm

## Development rules

- Keep the game small and playable.
- Prefer simple systems over complex architecture.
- Every feature must be testable manually in the browser.
- Use readable names and keep files short.
- Do not add backend code.
- Do not add external assets unless they are free and clearly credited.
- Use placeholder shapes or simple generated sprites when assets are missing.

## First milestone

Create a playable prototype with:
- A title screen.
- A top-down playable Kyle character.
- Paul following Kyle.
- A wind spell action.
- At least one simple puzzle using the wind spell.
- At least five dialogue lines between Kyle and Paul.
- A win condition.

## Expected repository structure

```text
liriel-brothers-windstorm/
|- AGENTS.md
|- README.md
|- package.json
|- index.html
|- tsconfig.json
|- vite.config.ts
|- src/
|  |- main.ts
|  |- game/
|  |  |- scenes/
|  |  |  |- BootScene.ts
|  |  |  |- IntroDialogueScene.ts
|  |  |  |- MainScene.ts
|  |  |  `- UIScene.ts
|  |  |- entities/
|  |  |  |- Kyle.ts
|  |  |  |- Paul.ts
|  |  |  `- WindOrb.ts
|  |  |- systems/
|  |  |  |- AudioSystem.ts
|  |  |  |- CollisionSystem.ts
|  |  |  |- DialogueSystem.ts
|  |  |  `- QuestSystem.ts
|  |  `- data/
|  |     |- dialogues.ts
|  |     `- quests.ts
|  `- styles.css
`- docs/
   |- game-design.md
   `- roadmap.md
```

## Current structure notes

- The codebase should match the expected structure above.
- Build output (`dist/`), installed dependencies (`node_modules/`), local tooling (`.tools/`), and logs are local generated files and are intentionally ignored.
- Project metadata files such as `.gitignore`, `.gitattributes`, and `package-lock.json` are allowed even though they are not shown in the simplified tree.
