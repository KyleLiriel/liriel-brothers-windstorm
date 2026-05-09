import { describe, expect, it } from "vitest";
import { getFootHitbox, moveWithCollisions, rectsOverlap, type CollisionRect } from "./CollisionSystem";

const character: CollisionRect = { x: 0, y: 0, width: 10, height: 10 };
const obstacle: CollisionRect = { x: 20, y: 0, width: 10, height: 10 };

describe("CollisionSystem", () => {
  it("prevents a character from moving through an obstacle", () => {
    const result = moveWithCollisions(character, 25, 0, [obstacle]);

    expect(result.x).toBe(10);
    expect(result.collidedX).toBe(true);
  });

  it("allows free movement when there is no obstacle", () => {
    const result = moveWithCollisions(character, 12, 8, []);

    expect(result).toEqual({ x: 12, y: 8, collidedX: false, collidedY: false });
  });

  it("detects collisions on the horizontal axis", () => {
    const result = moveWithCollisions(character, 15, 0, [obstacle]);

    expect(result.collidedX).toBe(true);
    expect(result.collidedY).toBe(false);
  });

  it("detects collisions on the vertical axis", () => {
    const verticalObstacle: CollisionRect = { x: 0, y: 20, width: 10, height: 10 };
    const result = moveWithCollisions(character, 0, 15, [verticalObstacle]);

    expect(result.collidedX).toBe(false);
    expect(result.collidedY).toBe(true);
  });

  it("allows sliding along an obstacle when only one axis is blocked", () => {
    const result = moveWithCollisions(character, 15, 6, [obstacle]);

    expect(result.x).toBe(10);
    expect(result.y).toBe(6);
    expect(result.collidedX).toBe(true);
    expect(result.collidedY).toBe(false);
  });

  it("treats edge-to-edge contact as non-overlap", () => {
    const touching: CollisionRect = { x: 10, y: 0, width: 10, height: 10 };

    expect(rectsOverlap(character, touching)).toBe(false);
  });

  it("detects partial overlap", () => {
    const partiallyOverlapping: CollisionRect = { x: 8, y: 4, width: 10, height: 10 };

    expect(rectsOverlap(character, partiallyOverlapping)).toBe(true);
  });

  it("resolves diagonal movement axis by axis", () => {
    const cornerObstacle: CollisionRect = { x: 12, y: 12, width: 10, height: 10 };
    const result = moveWithCollisions(character, 8, 8, [cornerObstacle]);

    expect(result.x).toBe(8);
    expect(result.y).toBe(2);
    expect(result.collidedX).toBe(false);
    expect(result.collidedY).toBe(true);
  });

  it("checks all obstacle hitboxes, including movable puzzle objects", () => {
    const farWall: CollisionRect = { x: 80, y: 0, width: 10, height: 10 };
    const crate: CollisionRect = { x: 14, y: 0, width: 10, height: 10 };
    const result = moveWithCollisions(character, 8, 0, [farWall, crate]);

    expect(result.x).toBe(4);
    expect(result.collidedX).toBe(true);
  });

  it("builds a foot hitbox from a sprite anchor position", () => {
    expect(getFootHitbox(20, 40, 10, 12)).toEqual({ x: 15, y: 28, width: 10, height: 12 });
  });
});
