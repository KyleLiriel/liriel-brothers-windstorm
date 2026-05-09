export type DialogueSpeaker = "Kyle" | "Paul";

export type DialogueLine = {
  speaker: DialogueSpeaker;
  text: string;
};

export const introDialogue: DialogueLine[] = [
  {
    speaker: "Paul",
    text: "Kyle.",
  },
  {
    speaker: "Kyle",
    text: "J’ai rien fait.",
  },
  {
    speaker: "Paul",
    text: "Remarquable. Tu mens avant même de savoir de quoi je parle.",
  },
  {
    speaker: "Kyle",
    text: "C’est parce que tu prends toujours ta voix de mage noir.",
  },
  {
    speaker: "Paul",
    text: "Je prends ma voix de grand frère qui vient de trouver trois dalles magiques complètement déplacées.",
  },
  {
    speaker: "Kyle",
    text: "Elles avaient l’air tristes.",
  },
  {
    speaker: "Paul",
    text: "Les dalles ne sont pas tristes, Kyle.",
  },
  {
    speaker: "Kyle",
    text: "Tu dis ça parce que tu ne les écoutes pas.",
  },
  {
    speaker: "Paul",
    text: "Mère veut que tu ranges tout avant le dîner. Et, par une décision injuste de l’univers, je dois te surveiller.",
  },
  {
    speaker: "Kyle",
    text: "Donc tu es mon gardien ?",
  },
  {
    speaker: "Paul",
    text: "Je suis ton témoin. Pour le procès.",
  },
  {
    speaker: "Kyle",
    text: "Je savais que tu étais un mage noir.",
  },
  {
    speaker: "Paul",
    text: "Avance, lutin farceur. Tu dois remettre les trois dalles lumineuses en place.",
  },
  {
    speaker: "Kyle",
    text: "Si je réussis, tu arrêtes d’être menaçant ?",
  },
  {
    speaker: "Paul",
    text: "Je promets d’être menaçant en silence.",
  },
  {
    speaker: "Kyle",
    text: "Marché conclu !",
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

export const failedWindDialogue: DialogueLine[] = [
  {
    speaker: "Kyle",
    text: "That gust was supposed to look much more impressive.",
  },
  {
    speaker: "Paul",
    text: "It impressed the air. Nothing else.",
  },
];

export const paulActionComments: DialogueLine[][] = [
  [
    {
      speaker: "Paul",
      text: "Try aiming before you unleash weather indoors.",
    },
  ],
  [
    {
      speaker: "Paul",
      text: "Careful, Kyle. Heroic winds still count as property damage.",
    },
  ],
  [
    {
      speaker: "Paul",
      text: "That one almost looked intentional.",
    },
  ],
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
  {
    speaker: "Paul",
    text: "Victory, then. A tiny, noisy, suspicious victory.",
  },
];
