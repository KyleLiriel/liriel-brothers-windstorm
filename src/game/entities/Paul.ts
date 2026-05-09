import Phaser from "phaser";

export class Paul {
  readonly sprite: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.container(x, y);

    const body = scene.add.circle(0, 0, 22, 0xdcc56a).setStrokeStyle(3, 0xfff7b5);
    const bolt = scene.add.line(0, 0, -5, -18, 7, -4, 0xffffff).setLineWidth(4);

    this.sprite.add([body, bolt]);
  }

  follow(target: Phaser.GameObjects.Container, deltaSeconds: number): void {
    const targetDistance = 78;
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const distance = Math.hypot(dx, dy);

    if (distance > targetDistance) {
      const step = Math.min((distance - targetDistance) * 4 * deltaSeconds, distance);
      this.sprite.x += (dx / distance) * step;
      this.sprite.y += (dy / distance) * step;
    }
  }
}
