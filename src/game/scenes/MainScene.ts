import Phaser from "phaser";
import { failedWindDialogue, openingDialogue, paulActionComments, progressDialogue, winDialogue } from "../data/dialogues";
import { firstQuest } from "../data/quests";
import { Kyle, type KyleSprite } from "../entities/Kyle";
import { Paul } from "../entities/Paul";
import { WindOrb, type WindOrbSprite } from "../entities/WindOrb";
import { DialogueSystem } from "../systems/DialogueSystem";
import { QuestSystem } from "../systems/QuestSystem";

const TILE_SIZE = 64;
const PLAYER_SPEED = 210;
const GUST_RANGE = 112;
const GUST_PUSH_SPEED = 622;
const WIND_COOLDOWN_MS = 650;

type MovementKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export class MainScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: MovementKeys;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private kyleCharacter!: Kyle;
  private kyle!: KyleSprite;
  private paul!: Paul;
  private objects: WindOrbSprite[] = [];
  private goalTiles: Phaser.GameObjects.Rectangle[] = [];
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private lastFacing = new Phaser.Math.Vector2(1, 0);
  private dialogue = new DialogueSystem();
  private quest!: QuestSystem;
  private hasPlayedProgressDialogue = false;
  private nextWindReadyAt = 0;
  private windCastCount = 0;
  private nextPaulCommentAt = 3;
  private won = false;

  constructor() {
    super("MainScene");
  }

  create(): void {
    this.objects = [];
    this.goalTiles = [];
    this.hasPlayedProgressDialogue = false;
    this.nextWindReadyAt = 0;
    this.windCastCount = 0;
    this.nextPaulCommentAt = 3;
    this.won = false;

    this.createWorld();
    this.createCharacters();
    this.createInput();
    this.quest = new QuestSystem(this.goalTiles, this.objects);
    this.quest.update();
    this.dialogue.show(openingDialogue);
  }

  update(_time: number, delta: number): void {
    this.handleDialogueInput();

    if (!this.dialogue.isOpen() && !this.won) {
      this.moveKyle();
      this.castWindIfReady(this.time.now);
    } else {
      this.kyle.body.setVelocity(0, 0);
    }

    this.paul.follow(this.kyle, delta / 1000);
    this.checkGoals();
  }

  private createWorld(): void {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x253248).setOrigin(0);

    for (let x = 32; x < width; x += TILE_SIZE) {
      for (let y = 32; y < height; y += TILE_SIZE) {
        const color = (x + y) % (TILE_SIZE * 2) === 0 ? 0x33415d : 0x2d3a54;
        this.add.rectangle(x, y, TILE_SIZE - 2, TILE_SIZE - 2, color, 0.72);
      }
    }

    this.walls = this.physics.add.staticGroup();
    this.addWall(width / 2, 16, width, 32);
    this.addWall(width / 2, height - 16, width, 32);
    this.addWall(16, height / 2, 32, height);
    this.addWall(width - 16, height / 2, 32, height);
    this.addWall(480, 176, 256, 28);
    this.addWall(310, 464, 220, 28);

    for (const goal of firstQuest.goalTiles) {
      this.createGoalTile(goal.x, goal.y);
    }

    for (const object of firstQuest.puzzleObjects) {
      this.objects.push(new WindOrb(this, object.x, object.y, object.kind).sprite);
    }
  }

  private addWall(x: number, y: number, width: number, height: number): void {
    const wall = this.add.rectangle(x, y, width, height, 0x182033);
    this.physics.add.existing(wall, true);
    this.walls.add(wall);
  }

  private createGoalTile(x: number, y: number): void {
    const tile = this.add.rectangle(x, y, 50, 50, 0x8df7b4, 0.28).setStrokeStyle(3, 0xc7ffd8);
    this.tweens.add({
      targets: tile,
      alpha: 0.55,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });
    this.goalTiles.push(tile);
  }

  private createCharacters(): void {
    this.kyleCharacter = new Kyle(this, 168, 320);
    this.kyle = this.kyleCharacter.sprite;
    this.paul = new Paul(this, 104, 358);

    this.physics.add.collider(this.kyle, this.walls);
    for (const object of this.objects) {
      this.physics.add.collider(object, this.walls);
      this.physics.add.collider(this.kyle, object);
      this.physics.add.collider(object, this.objects);
    }
  }

  private createInput(): void {
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.input.on("pointerdown", () => this.dialogue.advance());
  }

  private moveKyle(): void {
    if (!this.cursors || !this.wasd) return;

    const movement = new Phaser.Math.Vector2(0, 0);
    if (this.cursors.left.isDown || this.wasd.left.isDown) movement.x -= 1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) movement.x += 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) movement.y -= 1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) movement.y += 1;

    if (movement.lengthSq() > 0) {
      movement.normalize();
      this.lastFacing.copy(movement);
      this.kyleCharacter.setDirectionFromMovement(movement.x, movement.y, this.time.now);
      this.kyle.body.setVelocity(movement.x * PLAYER_SPEED, movement.y * PLAYER_SPEED);
    } else {
      this.kyle.body.setVelocity(0, 0);
    }
  }

  private castWindIfReady(now: number): void {
    if (!this.spaceKey || !Phaser.Input.Keyboard.JustDown(this.spaceKey)) return;
    if (now < this.nextWindReadyAt) {
      this.showCooldownFizzle();
      return;
    }

    const origin = new Phaser.Math.Vector2(this.kyle.x, this.kyle.y);
    this.nextWindReadyAt = now + WIND_COOLDOWN_MS;
    this.windCastCount += 1;
    this.showWindGust(origin);
    const pushedCount = this.pushObjectsInWindCone(origin);
    this.reactToWindCast(pushedCount);
  }

  private showWindGust(origin: Phaser.Math.Vector2): void {
    const angle = this.lastFacing.angle();
    const end = origin.clone().add(this.lastFacing.clone().scale(GUST_RANGE));
    const left = new Phaser.Math.Vector2(Math.cos(angle - 0.42), Math.sin(angle - 0.42))
      .scale(GUST_RANGE)
      .add(origin);
    const right = new Phaser.Math.Vector2(Math.cos(angle + 0.42), Math.sin(angle + 0.42))
      .scale(GUST_RANGE)
      .add(origin);
    const cone = this.add.graphics();
    cone.fillStyle(0x9ee6ff, 0.2);
    cone.lineStyle(2, 0xd6f7ff, 0.45);
    cone.beginPath();
    cone.moveTo(origin.x, origin.y);
    cone.lineTo(left.x, left.y);
    cone.lineTo(right.x, right.y);
    cone.closePath();
    cone.fillPath();
    cone.strokePath();

    const gust = this.add
      .arc(origin.x, origin.y, GUST_RANGE, -28, 28, false, 0x9ee6ff, 0.35)
      .setRotation(angle)
      .setStrokeStyle(6, 0x9ee6ff, 0.35);

    this.tweens.add({
      targets: [cone, gust],
      alpha: 0,
      scale: 1.35,
      duration: 220,
      onComplete: () => {
        cone.destroy();
        gust.destroy();
      },
    });

    const gustLine = this.add.line(0, 0, origin.x, origin.y, end.x, end.y, 0xeffcff, 0.34).setLineWidth(5);
    this.tweens.add({
      targets: gustLine,
      alpha: 0,
      duration: 160,
      onComplete: () => gustLine.destroy(),
    });
  }

  private showCooldownFizzle(): void {
    const puff = this.add.circle(this.kyle.x, this.kyle.y, 18, 0xd6f7ff, 0.28).setStrokeStyle(2, 0x9ee6ff, 0.55);
    this.tweens.add({
      targets: puff,
      alpha: 0,
      scale: 1.5,
      duration: 180,
      onComplete: () => puff.destroy(),
    });
  }

  private pushObjectsInWindCone(origin: Phaser.Math.Vector2): number {
    let pushedCount = 0;

    for (const object of this.objects) {
      if (object.solved) continue;

      const toObject = new Phaser.Math.Vector2(object.x - origin.x, object.y - origin.y);
      const distance = toObject.length();
      if (distance === 0 || distance > GUST_RANGE) continue;

      // Dot product keeps the gust directional: objects must be close and mostly in front of Kyle.
      const directionScore = toObject.normalize().dot(this.lastFacing);
      if (directionScore > 0.55) {
        object.body.setVelocity(this.lastFacing.x * GUST_PUSH_SPEED, this.lastFacing.y * GUST_PUSH_SPEED);
        pushedCount += 1;
      }
    }

    return pushedCount;
  }

  private reactToWindCast(pushedCount: number): void {
    if (this.dialogue.isOpen() || this.won) return;

    if (pushedCount === 0) {
      this.dialogue.show(failedWindDialogue);
      return;
    }

    if (this.windCastCount >= this.nextPaulCommentAt) {
      const commentIndex = Math.floor(this.windCastCount / 3 - 1) % paulActionComments.length;
      this.nextPaulCommentAt += 3;
      this.dialogue.show(paulActionComments[commentIndex]);
    }
  }

  private checkGoals(): void {
    const result = this.quest.update();

    if (result.changed && result.solvedCount === 1 && !this.hasPlayedProgressDialogue) {
      this.hasPlayedProgressDialogue = true;
      this.dialogue.show(progressDialogue);
    }

    if (result.complete && !this.won) {
      this.won = true;
      this.kyle.body.setVelocity(0, 0);
      this.dialogue.show(winDialogue, () => this.quest.showSolvedMessage());
    }
  }

  private handleDialogueInput(): void {
    if (!this.dialogue.isOpen()) return;

    const spacePressed = this.spaceKey ? Phaser.Input.Keyboard.JustDown(this.spaceKey) : false;
    const enterPressed = this.enterKey ? Phaser.Input.Keyboard.JustDown(this.enterKey) : false;
    if (spacePressed || enterPressed) {
      this.dialogue.advance();
    }
  }
}
