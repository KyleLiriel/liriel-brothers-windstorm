# Liriel Brothers: Windstorm

A small 2D top-down heroic fantasy prototype built with Phaser 3, TypeScript, and Vite.

Kyle Liriel is an 8-year-old wind mage apprentice. His older brother Paul follows close behind, throwing sharp comments while trying to protect him. The first playable puzzle asks Kyle to push three leaves or crates onto glowing wind tiles with a gust spell.

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Controls

- Arrow keys or WASD: move Kyle.
- Space: cast a wind spell. The spell has a short cooldown, so aim before casting.
- Enter or click: advance dialogue and start from the title screen.

## Assets

- `public/assets/kyle/KyleLiriel_pose.png`: user-provided Kyle Liriel pose sheet.
- `public/assets/kyle/kyle-*.png`: gameplay crops derived from the provided Kyle pose sheet.
- `public/assets/paul/PaulLiriel.png`: user-provided Paul Liriel character sheet.
- `public/assets/paul/paul-*.png`: gameplay crops derived from the provided Paul sheet.

## Project Structure

```text
src/
├─ main.ts                 # Phaser game setup
├─ styles.css              # Page and dialogue overlay styles
└─ game/
   ├─ scenes/              # Boot/title, main gameplay, and UI scene shell
   ├─ entities/            # Kyle, Paul, and movable wind puzzle objects
   ├─ systems/             # Dialogue and quest/puzzle state helpers
   └─ data/                # Dialogue lines and quest layout data
docs/
├─ game-design.md          # Concept, characters, and future ideas
└─ roadmap.md              # Short next-step plan
```

## First Playable Goal

Push all three movable objects onto the glowing tiles. Paul follows Kyle and reacts as the puzzle progresses. When all tiles are filled, the win dialogue appears.
