import Phaser from "phaser";

export type KyleSprite = Phaser.GameObjects.Container & {
  body: Phaser.Physics.Arcade.Body;
};

export class Kyle {
  readonly sprite: KyleSprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.container(x, y) as KyleSprite;

    const body = scene.add.circle(0, 0, 20, 0x7dd6ff).setStrokeStyle(3, 0xe9fbff);
    const cape = scene.add.triangle(0, 22, -15, 0, 15, 0, 0, 28, 0xecd36b);

    this.sprite.add([cape, body]);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setSize(34, 34);
    this.sprite.body.setCollideWorldBounds(true);
  }
}
