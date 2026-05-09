import Phaser from "phaser";
import { introDialogue } from "../data/dialogues";
import { DialogueSystem } from "../systems/DialogueSystem";

export class IntroDialogueScene extends Phaser.Scene {
  private dialogue = new DialogueSystem();

  constructor() {
    super("IntroDialogueScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x151820).setOrigin(0);
    this.add.rectangle(width / 2, height / 2, width, height, 0x253248, 0.72);
    this.add.text(width / 2, 92, "Salle d’entraînement des Liriel", {
      color: "#fff8dd",
      fontFamily: "Georgia, serif",
      fontSize: "34px",
    }).setOrigin(0.5);
    this.add.text(width / 2, 138, "Une petite catastrophe magique attend d’être rangée.", {
      color: "#9ee6ff",
      fontSize: "20px",
    }).setOrigin(0.5);

    this.add.image(360, 344, "kyle-front").setDisplaySize(98, 150).setOrigin(0.5, 0.82);
    this.add.image(600, 344, "paul-front").setDisplaySize(94, 150).setOrigin(0.5, 0.82);

    this.input.keyboard?.on("keydown-ENTER", this.advanceDialogue, this);
    this.input.keyboard?.on("keydown-SPACE", this.advanceDialogue, this);
    this.input.on("pointerdown", this.advanceDialogue, this);
    this.dialogue.show(introDialogue, () => this.scene.start("MainScene"));
  }

  private advanceDialogue(): void {
    this.dialogue.advance();
  }
}
