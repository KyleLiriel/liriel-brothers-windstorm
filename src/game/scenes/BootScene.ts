import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.scene.launch("UIScene");

    this.add.rectangle(0, 0, width, height, 0x121721).setOrigin(0);
    this.add.rectangle(width / 2, height / 2, width, height, 0x203749, 0.18);

    for (let i = 0; i < 12; i += 1) {
      const y = 90 + i * 42;
      this.add.arc(120 + i * 72, y, 52, 210, 330, false, 0x79d9ff, 0.12).setStrokeStyle(3, 0x79d9ff, 0.12);
    }

    this.add
      .text(width / 2, 145, "Liriel Brothers", {
        color: "#fff8dd",
        fontFamily: "Georgia, serif",
        fontSize: "66px",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 218, "Windstorm", {
        color: "#9ee6ff",
        fontFamily: "Georgia, serif",
        fontSize: "54px",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 330, "A tiny heroic fantasy prototype", {
        color: "#f5f1df",
        fontSize: "22px",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 430, "Press Enter, Space, or click to begin", {
        color: "#eaf8c7",
        fontSize: "22px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("MainScene"));
    this.input.keyboard?.once("keydown-SPACE", () => this.scene.start("MainScene"));
    this.input.once("pointerdown", () => this.scene.start("MainScene"));
  }
}
