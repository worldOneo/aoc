import { readFileSync } from "fs";
import { stdout } from "process";
const input = readFileSync("./13.txt")
  .toString()
  .split(/[\r\n]{1,2}/gi);

const FOLD_Y = 0, FOLD_X = 1;
type Inst = {
  d: 0 | 1,
  n: number,
}

const newGrid = (w: number, h: number) => {
  const grid = new Array<Array<number>>();
  new Array(h).fill(0).forEach(() => grid.push(new Array<number>(w).fill(0)));
  return grid;
}

const buildGrid = (): [number[][], Inst[]] => {
  const split = input.findIndex(p => p == "");
  const dots = input.slice(0, split).map(d => d.split(",")).map(([x, y]) => ({ x: parseInt(x), y: parseInt(y) }));
  const folds = input.slice(split + 1, input.length)
    .map(s => s.split(/fold along ([xy])=(\d+)/gi))
    .map(([, d, n]) => ({ d: (d === "y" ? FOLD_Y : FOLD_X), n: parseInt(n) }));

  const cols = dots.reduce((p, c) => Math.max(p, c.x), -1) + 1;
  const rows = dots.reduce((p, c) => Math.max(p, c.y), -1) + 1;
  const grid = newGrid(cols, rows);
  dots.forEach(({ x, y }) => grid[y][x] = 1);
  return [grid, folds as Inst[]];
}

const foldGridX = (idx: number, grid: number[][]): number[][] => {
  return grid.map(row => {
    let first = row.slice(0, idx);
    let second = row.slice(idx + 1, row.length);
    first.reverse().forEach((n, i) => second[i] = second[i] || n ? 1 : 0);
    return second;
  });
}

const foldGridY = (idx: number, grid: number[][]): number[][] => {
  let first = grid.slice(0, idx);
  let second = grid.slice(idx + 1, grid.length).reverse();
  if (first.length > second.length)
    second.unshift(new Array(second[0].length)); // Hacky magik trick that works
  if (second.length != first.length)
    throw `Didn't expect this ${first.length},${second.length}`;
  let result = newGrid(grid[0].length, first.length);
  result.forEach((_, y) => result[y].forEach((_, x) => {
    result[y][x] = (first[y] || [])[x] || (second[y] || [])[x] ? 1 : 0;
  }));
  return result;
}

const displayGrid = (grid: number[][]) => {
  for (let row of grid) {
    for (let col of row) {
      stdout.write(col == 1 ? "#" : ".")
    }
    stdout.write("\n");
  }
}

const part1 = () => {
  let [inp, folds] = buildGrid();
  if (folds[0].d == FOLD_Y)
    inp = foldGridY(folds[0].n, inp)
  else
    inp = foldGridX(folds[0].n, inp);
  console.log("Dots visible: ", inp.reduce((p, c) => p + c.reduce((p, c) => p + c, 0), 0));
}

const part2 = () => {
  let [inp, folds] = buildGrid();
  for (let fold of folds) {
    if (fold.d == FOLD_Y)
      inp = foldGridY(fold.n, inp)
    else
      inp = foldGridX(fold.n, inp);
  }
  displayGrid(inp);
}

part1();
part2();