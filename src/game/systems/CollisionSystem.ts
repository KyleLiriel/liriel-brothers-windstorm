export type CollisionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MoveResult = {
  x: number;
  y: number;
  collidedX: boolean;
  collidedY: boolean;
};

export function rectsOverlap(a: CollisionRect, b: CollisionRect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function getFootHitbox(x: number, y: number, width: number, height: number): CollisionRect {
  return {
    x: x - width / 2,
    y: y - height,
    width,
    height,
  };
}

export function moveWithCollisions(
  hitbox: CollisionRect,
  dx: number,
  dy: number,
  obstacles: CollisionRect[],
): MoveResult {
  const afterX = resolveAxis(hitbox, dx, obstacles, "x");
  const afterY = resolveAxis(afterX.hitbox, dy, obstacles, "y");

  return {
    x: afterY.hitbox.x,
    y: afterY.hitbox.y,
    collidedX: afterX.collided,
    collidedY: afterY.collided,
  };
}

function resolveAxis(
  hitbox: CollisionRect,
  amount: number,
  obstacles: CollisionRect[],
  axis: "x" | "y",
): { hitbox: CollisionRect; collided: boolean } {
  if (amount === 0) {
    return { hitbox, collided: false };
  }

  const moved = { ...hitbox, [axis]: hitbox[axis] + amount };
  let collided = false;

  for (const obstacle of obstacles) {
    if (!rectsOverlap(moved, obstacle)) continue;

    collided = true;
    if (axis === "x") {
      moved.x = amount > 0 ? obstacle.x - moved.width : obstacle.x + obstacle.width;
    } else {
      moved.y = amount > 0 ? obstacle.y - moved.height : obstacle.y + obstacle.height;
    }
  }

  return { hitbox: moved, collided };
}
