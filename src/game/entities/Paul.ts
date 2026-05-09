import Phaser from "phaser";

type PaulDirection = "front" | "back" | "left" | "right";

export class Paul {
  readonly sprite: Phaser.GameObjects.Sprite;
  private direction: PaulDirection = "front";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, "paul-front");
    this.sprite.setDisplaySize(46, 74);
    this.sprite.setOrigin(0.5, 0.82);
  }

  follow(target: { x: number; y: number }, deltaSeconds: number): void {
    const targetDistance = 78;
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const distance = Math.hypot(dx, dy);

    if (distance > targetDistance) {
      const step = Math.min((distance - targetDistance) * 4 * deltaSeconds, distance);
      this.sprite.x += (dx / distance) * step;
      this.sprite.y += (dy / distance) * step;
      this.setDirectionFromMovement(dx, dy);
    }
  }

  private setDirectionFromMovement(dx: number, dy: number): void {
    let nextDirection: PaulDirection;

    if (Math.abs(dx) > Math.abs(dy)) {
      nextDirection = dx > 0 ? "right" : "left";
    } else {
      nextDirection = dy > 0 ? "front" : "back";
    }

    if (nextDirection !== this.direction) {
      this.direction = nextDirection;
      this.sprite.setTexture(`paul-${nextDirection}`);
    }
  }
}
