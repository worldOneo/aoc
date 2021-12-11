import { readFileSync } from "fs";
const input = readFileSync("./11.txt").toString();
const cols = input.split(/[\r\n]+/gi)[0].length;
const rows = input.split(/[\r\n]+/gi).length;
console.log("Rows", rows, "Cols", cols);
let grid = input.split("").map(v => parseInt(v)).filter(v => !isNaN(v));
const copy = [...grid];

const getIdx = (x: number, y: number): number =>
  (x >= cols || y >= rows || x < 0 || y < 0) ? -1 : x + y * cols;

const getCords = (idx: number): [number, number] => [idx % cols, (idx / cols) | 0];

const getValue = (x: number, y: number): number =>
  getIdx(x, y) === -1 ? -1 : grid[getIdx(x, y)];

const getNearby = (x: number, y: number) =>
  [[x + 1, y], [x - 1, y], [x + 1, y + 1], [x + 1, y - 1], [x - 1, y - 1], [x - 1, y + 1], [x, y + 1], [x, y - 1]];

const checkFlash = (x: number, y: number, flashed: Record<string, boolean> = {}) => {
  const strPos = `${x},${y}`
  if (strPos in flashed)
    return;
  if (getValue(x, y) > 9) {
    grid[getIdx(x, y)] = 0;
    flashed[strPos] = true;
    const near = getNearby(x, y)
      .filter(([x, y]) => getIdx(x, y) !== -1)
      .filter(([x, y]) => !(`${x},${y}` in flashed));
    near.forEach(([x, y]) => grid[getIdx(x, y)]++);
    near.forEach(([x, y]) => checkFlash(x, y, flashed));
  }
}

console.log("Part1:", new Array(100).fill(0).map(() => {
  const flashed = {};
  const unflashed = grid.map((_, i) => getCords(i));
  unflashed.forEach(([x, y]) => grid[getIdx(x, y)]++);
  unflashed.forEach(([x, y]) => checkFlash(x, y, flashed));
  return Object.keys(flashed).length;
}).reduce((p, c) => p + c, 0));


grid = [...copy];
let i = 0;
while (true) {
  i++;
  const flashed = {};
  const unflashed = grid.map((_, i) => getCords(i));
  unflashed.forEach(([x, y]) => grid[getIdx(x, y)]++);
  unflashed.forEach(([x, y]) => checkFlash(x, y, flashed));
  const count = Object.keys(flashed).length;
  if (count === grid.length)
    break;
}
console.log("Part2:", i);