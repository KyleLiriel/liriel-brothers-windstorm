import Phaser from "phaser";
import type { WindOrbSprite } from "../entities/WindOrb";

export class QuestSystem {
  private readonly objectiveEl = document.querySelector<HTMLDivElement>("#objective");
  private solvedCount = 0;

  constructor(
    private readonly goalTiles: Phaser.GameObjects.Rectangle[],
    private readonly objects: WindOrbSprite[],
  ) {}

  update(): { solvedCount: number; changed: boolean; complete: boolean } {
    let solved = 0;

    for (const object of this.objects) {
      const onTile = this.goalTiles.some((tile) => Phaser.Math.Distance.Between(object.x, object.y, tile.x, tile.y) < 30);
      object.solved = onTile;
      object.setAlpha(onTile ? 0.74 : 1);
      if (onTile) solved += 1;
    }

    const changed = solved !== this.solvedCount;
    this.solvedCount = solved;
    this.updateObjective();

    return {
      solvedCount: solved,
      changed,
      complete: solved === this.goalTiles.length,
    };
  }

  showSolvedMessage(): void {
    if (!this.objectiveEl) return;
    this.objectiveEl.classList.remove("hidden");
    this.objectiveEl.textContent = "Victory! All 3 objects are placed correctly.";
  }

  private updateObjective(): void {
    if (!this.objectiveEl) return;
    this.objectiveEl.textContent = `Glowing tiles filled: ${this.solvedCount} / ${this.goalTiles.length}`;
    this.objectiveEl.classList.remove("hidden");
  }
}
