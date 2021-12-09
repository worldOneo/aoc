import { readFileSync } from "fs";
const input = readFileSync("./09.txt").toString();
const cols = input.split(/[\r\n]+/gi)[0].length;
const rows = input.split(/[\r\n]+/gi).length;
console.log("Rows", rows, "Cols", cols);
const grid = input.split("").map(v => parseInt(v)).filter(v => !isNaN(v));

const getIdx = (x: number, y: number): number =>
  (x >= cols || y >= rows || x < 0 || y < 0) ? -1 : x + y * cols;

const getCords = (idx: number): [number, number] => [idx % cols, (idx / cols) | 0];

const getValue = (x: number, y: number): number =>
  getIdx(x, y) === -1 ? -1 : grid[getIdx(x, y)];

const getLowValue = (x: number, y: number): number =>
  [getValue(x - 1, y), getValue(x, y - 1), getValue(x, y + 1), getValue(x + 1, y)]
    .filter(v => v !== -1)
    .every(v => v > getValue(x, y)) ? getValue(x, y) + 1 : 0;


console.log("Part1: ", grid
  .map((_, i) => getCords(i))
  .map(([x, y]) => getLowValue(x, y))
  .reduce((p, c) => p + c, 0));


const addBasin = (x: number, y: number, walked: Record<string, number> = {}): number => {
  return [[x - 1, y], [x + 1, y], [x, y + 1], [x, y - 1]]
    .filter(([x, y]) => getIdx(x, y) != -1)
    .filter(([x, y]) => getValue(x, y) !== 9)
    .filter(([x, y]) => !(`${x},${y}` in walked))
    .map(([x, y]) => {
      walked[`${x},${y}`] = getValue(x, y);
      return [x, y];
    }).map(([x, y]) => 1 + addBasin(x, y, walked))
    .reduce((p, c) => p + c, 0);
}

const getBasinSize = (x: number, y: number, walked: Record<string, number> = {}): number => {
  const lowValue = getLowValue(x, y);
  if (lowValue === 0)
    return 0;
  walked[`${x},${y}`] = getValue(x, y);
  return addBasin(x, y, walked) + 1;;
}

console.log("Part2: ", grid
  .map((_, i) => getCords(i))
  .map(([x, y]) => getBasinSize(x, y))
  .filter(v => v !== 0)
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((p, c) => p * c, 1));

