import Phaser from "phaser";

export class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");
  }

  create(): void {
    document.querySelector<HTMLDivElement>("#dialogue")?.classList.add("hidden");
    document.querySelector<HTMLDivElement>("#objective")?.classList.add("hidden");
  }
}
