import { readFileSync } from "fs";

const [x1, x2, y1, y2] = readFileSync("./17.txt")
  .toString()
  .split(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/gi)
  .filter(n => n !== "")
  .map(n => parseInt(n));

const solve = () => {
  let tickHitY: Record<number, Set<number>> = {};
  let tickMax: Record<number, number> = {};
  let hitYmax = 0;
  new Array(1_000).fill(0).map((_, vy) => {
    vy -= 500;
    let initVy = vy;
    let y = 0;
    let tick = 0;
    let maxy = 0;
    while (y >= y1) {
      if (y1 <= y && y <= y2) {
        if (!(tick in tickHitY))
          tickHitY[tick] = new Set();
        tickHitY[tick].add(initVy);
        tickMax[tick] = Math.max(tickMax[tick] || 0, maxy);
        hitYmax = Math.max(maxy, hitYmax);
      }
      y += vy;
      vy -= 1;
      tick++;
      maxy = Math.max(y, maxy);
    }
  });

  let maxY = 0;
  let hits = 0;
  new Array(1_000).fill(0).map((_, vx) => {
    let x = 0;
    let tick = 0;
    let detectedOn = new Set<number>();
    while (x <= x2 && tick <= hitYmax) {
      if (x1 <= x && x <= x2) {
        maxY = Math.max(maxY, tickMax[tick] || 0);
        if (tick in tickHitY) {
          tickHitY[tick].forEach(e => {
            if (!detectedOn.has(e))
              hits++;
            detectedOn.add(e);
          });
        }
      }
      x += vx;
      vx = Math.max(vx - 1, 0);
      tick++;
    }
  });
  console.log("Part1:", maxY);
  console.log("Part2:", hits);
}
console.log(x1, x2, y1, y2);
solve();