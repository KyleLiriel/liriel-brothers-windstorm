import Phaser from "phaser";

export type KyleSprite = Phaser.GameObjects.Sprite & {
  body: Phaser.Physics.Arcade.Body;
};

type KyleDirection = "front" | "back" | "left" | "right";

export class Kyle {
  readonly sprite: KyleSprite;
  private direction: KyleDirection = "front";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, "kyle-front") as KyleSprite;
    this.sprite.setDisplaySize(48, 74);
    this.sprite.setOrigin(0.5, 0.82);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setSize(30, 34);
    this.sprite.body.setOffset(this.sprite.width / 2 - 15, this.sprite.height * 0.66);
    this.sprite.body.setCollideWorldBounds(true);
  }

  setDirectionFromMovement(dx: number, dy: number): void {
    let nextDirection: KyleDirection;

    if (Math.abs(dx) > Math.abs(dy)) {
      nextDirection = dx > 0 ? "right" : "left";
    } else {
      nextDirection = dy > 0 ? "front" : "back";
    }

    if (nextDirection !== this.direction) {
      this.direction = nextDirection;
      this.sprite.setTexture(`kyle-${nextDirection}`);
    }
  }
}
