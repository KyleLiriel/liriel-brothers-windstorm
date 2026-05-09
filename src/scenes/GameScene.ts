import Phaser from "phaser";

type DialogueLine = {
  speaker: "Kyle" | "Paul";
  text: string;
};

type MovableObject = Phaser.GameObjects.Container & {
  body: Phaser.Physics.Arcade.Body;
  solved?: boolean;
};

const TILE_SIZE = 64;
const PLAYER_SPEED = 210;
const GUST_RANGE = 112;
const GUST_PUSH = 148;

const openingDialogue: DialogueLine[] = [
  {
    speaker: "Kyle",
    text: "Paul, stop following me. I know what dark mages look like.",
  },
  {
    speaker: "Paul",
    text: "Kyle, you are eight. Yesterday you accused a broom of necromancy.",
  },
  {
    speaker: "Kyle",
    text: "That broom moved by itself.",
  },
  {
    speaker: "Paul",
    text: "Because you sneezed wind magic at it. Move the crates onto those tiles before someone sees us.",
  },
];

const progressDialogue: DialogueLine[] = [
  {
    speaker: "Paul",
    text: "One correct gust. Try not to look too surprised.",
  },
  {
    speaker: "Kyle",
    text: "I meant to do that. Mostly.",
  },
];

const winDialogue: DialogueLine[] = [
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
];

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private kyle!: Phaser.GameObjects.Container & { body: Phaser.Physics.Arcade.Body };
  private paul!: Phaser.GameObjects.Container;
  private objects: MovableObject[] = [];
  private goalTiles: Phaser.GameObjects.Rectangle[] = [];
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private lastFacing = new Phaser.Math.Vector2(1, 0);
  private activeDialogue: DialogueLine[] = [];
  private dialogueIndex = 0;
  private dialogueEl = document.querySelector<HTMLDivElement>("#dialogue");
  private speakerEl = document.querySelector<HTMLDivElement>("#speaker");
  private lineEl = document.querySelector<HTMLDivElement>("#line");
  private objectiveEl = document.querySelector<HTMLDivElement>("#objective");
  private solvedCount = 0;
  private hasPlayedProgressDialogue = false;
  private won = false;

  constructor() {
    super("GameScene");
  }

  create(): void {
    this.objects = [];
    this.goalTiles = [];
    this.solvedCount = 0;
    this.hasPlayedProgressDialogue = false;
    this.won = false;

    this.createWorld();
    this.createCharacters();
    this.createInput();
    this.updateObjective();
    this.showDialogue(openingDialogue);
  }

  update(_time: number, delta: number): void {
    this.handleDialogueInput();

    if (!this.isDialogueOpen() && !this.won) {
      this.moveKyle();
      this.castWindIfReady();
    } else {
      this.kyle.body.setVelocity(0, 0);
    }

    this.followWithPaul(delta / 1000);
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

    this.createGoalTile(704, 192);
    this.createGoalTile(768, 320);
    this.createGoalTile(640, 448);

    this.createMovable(280, 204, 0x92c56e, "leaf");
    this.createMovable(352, 344, 0xb8845a, "crate");
    this.createMovable(520, 430, 0x92c56e, "leaf");
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

  private createMovable(x: number, y: number, tint: number, kind: "leaf" | "crate"): void {
    const object = this.add.container(x, y) as MovableObject;
    const base =
      kind === "leaf"
        ? this.add.ellipse(0, 0, 44, 30, tint).setStrokeStyle(3, 0x486436)
        : this.add.rectangle(0, 0, 44, 44, tint).setStrokeStyle(3, 0x6b4936);
    const mark = this.add.line(0, 0, -13, 0, 13, 0, 0xfff1a8, 0.55).setLineWidth(3);
    object.add([base, mark]);
    this.physics.add.existing(object);
    object.body.setSize(46, 46);
    object.body.setCollideWorldBounds(true);
    object.body.setDrag(760, 760);
    object.body.setMaxVelocity(260, 260);
    this.objects.push(object);
  }

  private createCharacters(): void {
    this.kyle = this.add.container(168, 320) as Phaser.GameObjects.Container & {
      body: Phaser.Physics.Arcade.Body;
    };
    const kyleBody = this.add.circle(0, 0, 20, 0x7dd6ff).setStrokeStyle(3, 0xe9fbff);
    const kyleCape = this.add.triangle(0, 22, -15, 0, 15, 0, 0, 28, 0xecd36b);
    this.kyle.add([kyleCape, kyleBody]);
    this.physics.add.existing(this.kyle);
    this.kyle.body.setSize(34, 34);
    this.kyle.body.setCollideWorldBounds(true);

    this.paul = this.add.container(104, 358);
    const paulBody = this.add.circle(0, 0, 22, 0xdcc56a).setStrokeStyle(3, 0xfff7b5);
    const paulBolt = this.add.line(0, 0, -5, -18, 7, -4, 0xffffff).setLineWidth(4);
    this.paul.add([paulBody, paulBolt]);

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
    this.input.on("pointerdown", () => this.advanceDialogue());
  }

  private moveKyle(): void {
    if (!this.cursors || !this.wasd) {
      return;
    }

    const movement = new Phaser.Math.Vector2(0, 0);
    if (this.cursors.left.isDown || this.wasd.left.isDown) movement.x -= 1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) movement.x += 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) movement.y -= 1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) movement.y += 1;

    if (movement.lengthSq() > 0) {
      movement.normalize();
      this.lastFacing.copy(movement);
      this.kyle.body.setVelocity(movement.x * PLAYER_SPEED, movement.y * PLAYER_SPEED);
    } else {
      this.kyle.body.setVelocity(0, 0);
    }
  }

  private castWindIfReady(): void {
    if (!this.spaceKey || !Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      return;
    }

    const origin = new Phaser.Math.Vector2(this.kyle.x, this.kyle.y);
    const gustEnd = origin.clone().add(this.lastFacing.clone().scale(GUST_RANGE));
    const gust = this.add
      .arc(origin.x, origin.y, GUST_RANGE, -28, 28, false, 0x9ee6ff, 0.35)
      .setRotation(this.lastFacing.angle())
      .setStrokeStyle(6, 0x9ee6ff, 0.35);

    this.tweens.add({
      targets: gust,
      alpha: 0,
      scale: 1.35,
      duration: 180,
      onComplete: () => gust.destroy(),
    });

    for (const object of this.objects) {
      if (object.solved) continue;

      const toObject = new Phaser.Math.Vector2(object.x - origin.x, object.y - origin.y);
      const distance = toObject.length();
      const directionScore = toObject.normalize().dot(this.lastFacing);
      if (distance <= GUST_RANGE && directionScore > 0.55) {
        object.body.setVelocity(this.lastFacing.x * GUST_PUSH * 4.2, this.lastFacing.y * GUST_PUSH * 4.2);
      }
    }

    const gustLine = this.add
      .line(0, 0, origin.x, origin.y, gustEnd.x, gustEnd.y, 0xeffcff, 0.34)
      .setLineWidth(5)
      .setDepth(5);
    this.tweens.add({
      targets: gustLine,
      alpha: 0,
      duration: 160,
      onComplete: () => gustLine.destroy(),
    });
  }

  private followWithPaul(deltaSeconds: number): void {
    const targetDistance = 78;
    const dx = this.kyle.x - this.paul.x;
    const dy = this.kyle.y - this.paul.y;
    const distance = Math.hypot(dx, dy);

    if (distance > targetDistance) {
      const step = Math.min((distance - targetDistance) * 4 * deltaSeconds, distance);
      this.paul.x += (dx / distance) * step;
      this.paul.y += (dy / distance) * step;
    }
  }

  private checkGoals(): void {
    let solved = 0;
    for (const object of this.objects) {
      const onTile = this.goalTiles.some((tile) => Phaser.Math.Distance.Between(object.x, object.y, tile.x, tile.y) < 30);
      object.solved = onTile;
      object.setAlpha(onTile ? 0.74 : 1);
      if (onTile) solved += 1;
    }

    if (solved !== this.solvedCount) {
      this.solvedCount = solved;
      this.updateObjective();

      if (solved === 1 && !this.hasPlayedProgressDialogue) {
        this.hasPlayedProgressDialogue = true;
        this.showDialogue(progressDialogue);
      }
    }

    if (solved === this.goalTiles.length && !this.won) {
      this.won = true;
      this.kyle.body.setVelocity(0, 0);
      this.showDialogue(winDialogue, () => {
        this.objectiveEl?.classList.remove("hidden");
        if (this.objectiveEl) this.objectiveEl.textContent = "Puzzle solved. The brothers survived one room together.";
      });
    }
  }

  private updateObjective(): void {
    if (!this.objectiveEl) return;
    this.objectiveEl.textContent = `Glowing tiles filled: ${this.solvedCount} / ${this.goalTiles.length}`;
    this.objectiveEl.classList.remove("hidden");
  }

  private showDialogue(lines: DialogueLine[], onComplete?: () => void): void {
    this.activeDialogue = lines;
    this.dialogueIndex = 0;
    this.dialogueEl?.classList.remove("hidden");
    this.renderDialogueLine();
    this.dialogueComplete = onComplete;
  }

  private dialogueComplete?: () => void;

  private renderDialogueLine(): void {
    const line = this.activeDialogue[this.dialogueIndex];
    if (!line || !this.speakerEl || !this.lineEl) return;

    this.speakerEl.textContent = line.speaker;
    this.speakerEl.style.color = line.speaker === "Kyle" ? "#9ee6ff" : "#ffe37d";
    this.lineEl.textContent = line.text;
  }

  private handleDialogueInput(): void {
    if (!this.isDialogueOpen()) return;

    const spacePressed = this.spaceKey ? Phaser.Input.Keyboard.JustDown(this.spaceKey) : false;
    const enterPressed = this.enterKey ? Phaser.Input.Keyboard.JustDown(this.enterKey) : false;
    if (spacePressed || enterPressed) {
      this.advanceDialogue();
    }
  }

  private advanceDialogue(): void {
    if (!this.isDialogueOpen()) return;

    this.dialogueIndex += 1;
    if (this.dialogueIndex >= this.activeDialogue.length) {
      this.dialogueEl?.classList.add("hidden");
      const complete = this.dialogueComplete;
      this.dialogueComplete = undefined;
      complete?.();
      return;
    }

    this.renderDialogueLine();
  }

  private isDialogueOpen(): boolean {
    return this.dialogueEl ? !this.dialogueEl.classList.contains("hidden") : false;
  }
}
