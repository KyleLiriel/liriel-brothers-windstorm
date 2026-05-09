export type PuzzleObjectKind = "leaf" | "crate";

export type PuzzleObjectData = {
  x: number;
  y: number;
  kind: PuzzleObjectKind;
};

export type QuestData = {
  goalTiles: Array<{ x: number; y: number }>;
  puzzleObjects: PuzzleObjectData[];
};

export const firstQuest: QuestData = {
  goalTiles: [
    { x: 704, y: 192 },
    { x: 768, y: 320 },
    { x: 640, y: 448 },
  ],
  puzzleObjects: [
    { x: 280, y: 204, kind: "leaf" },
    { x: 352, y: 344, kind: "crate" },
    { x: 520, y: 430, kind: "leaf" },
  ],
};
