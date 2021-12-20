import { readFileSync } from "fs";

let input = readFileSync("./20.txt")
  .toString()
  .split(/[\r\n]+/gi)
  .filter(s => s);

type Grid<T> = T[][];
type Image = Grid<boolean>;
type Eva = Grid<number>;

const c = (a: string, _: number = 0) => a === "#";
let mapping = input.shift()?.split("").map(c) || [];
let image = input.map(l => l.split("")).map(d => d.map(c)) as Image;


const extendImage = (image: Image, i: number): Image => {
  const a = inf(i);
  let extended = new Array<boolean[]>(image.length + 2)
    .fill([])
    .map(() => new Array<boolean>(1).fill(a));
  for (let i = 1; i < image.length + 1; i++) {
    extended[i].splice(1, 0, ...image[i - 1]);
  }
  extended[0] = new Array<boolean>(extended.length).fill(a);
  extended[extended.length - 1] = new Array<boolean>(extended.length).fill(a);

  return extended;
}

const get = <T>(grid: Grid<T>, x: number, y: number, d: T): T =>
  y < 0 || y >= grid.length || x < 0 || x >= grid[y].length
    ? d
    : grid[y][x];

const inf = (i: number) => !mapping[0] ? false : ((i % 2) === 1);

const evaluateImage = (image: Image, inf: boolean): Eva => {
  let n: Eva = [];
  for (let y = 0; y < image.length; y++) {
    let slice = [];
    for (let x = 0; x < image.length; x++) {
      let e = 0;
      for (let [dx, dy] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) {
        e <<= 1;
        e += get(image, x + dx, y + dy, inf) ? 1 : 0;
      }
      slice.push(e);
    }
    n.push(slice);
  }
  return n;
}

const buildImage = (a: Eva): Image => a.map(s => s.map(n => mapping[n]));

const enhanceImage = (image: Image, i: number): Image => {
  const extended = extendImage(image, i);
  const evaluated = evaluateImage(extended, inf(i));
  return buildImage(evaluated);
}

const part1 = () => {
  let newImage = enhanceImage(enhanceImage(image, 0), 1);
  console.log(newImage
    .map(s => s.filter(a => a).length)
    .reduce((p, c) => p + c, 0));
}

const part2 = () => {
  let newImage = image;
  for (let i = 0; i < 50; i++)
    newImage = enhanceImage(newImage, i);
  console.log(newImage
    .map(s => s.filter(a => a).length)
    .reduce((p, c) => p + c, 0));
}

part1();
part2();