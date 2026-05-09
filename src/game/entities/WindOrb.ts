import Phaser from "phaser";
import type { PuzzleObjectKind } from "../data/quests";

export type WindOrbSprite = Phaser.GameObjects.Container & {
  body: Phaser.Physics.Arcade.Body;
  solved?: boolean;
};

export class WindOrb {
  readonly sprite: WindOrbSprite;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: PuzzleObjectKind) {
    this.sprite = scene.add.container(x, y) as WindOrbSprite;

    const tint = kind === "leaf" ? 0x92c56e : 0xb8845a;
    const base =
      kind === "leaf"
        ? scene.add.ellipse(0, 0, 44, 30, tint).setStrokeStyle(3, 0x486436)
        : scene.add.rectangle(0, 0, 44, 44, tint).setStrokeStyle(3, 0x6b4936);
    const mark = scene.add.line(0, 0, -13, 0, 13, 0, 0xfff1a8, 0.55).setLineWidth(3);

    this.sprite.add([base, mark]);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setSize(46, 46);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.setDrag(760, 760);
    this.sprite.body.setMaxVelocity(260, 260);
  }
}
