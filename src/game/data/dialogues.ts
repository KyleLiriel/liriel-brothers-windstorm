export type DialogueSpeaker = "Kyle" | "Paul";

export type DialogueLine = {
  speaker: DialogueSpeaker;
  text: string;
};

export const openingDialogue: DialogueLine[] = [
  {
    speaker: "Kyle",
    text: "Paul, stop following me. I know what dark mages look like.",
  },
  {
    speaker: "Paul",
    text: "Kyle, you are eight. Yesterday you accused a broom of necromancy.",
  },
  {
    speaker: "Kyle",
    text: "That broom moved by itself.",
  },
  {
    speaker: "Paul",
    text: "Because you sneezed wind magic at it. Move the crates onto those tiles before someone sees us.",
  },
];

export const progressDialogue: DialogueLine[] = [
  {
    speaker: "Paul",
    text: "One correct gust. Try not to look too surprised.",
  },
  {
    speaker: "Kyle",
    text: "I meant to do that. Mostly.",
  },
];

export const winDialogue: DialogueLine[] = [
  {
    speaker: "Kyle",
    text: "The tiles are glowing! My wind spell worked!",
  },
  {
    speaker: "Paul",
    text: "Good. The suspicious goblin may continue his apprenticeship.",
  },
  {
    speaker: "Kyle",
    text: "I am not a goblin. And you are still suspicious.",
  },
];
