import { readFileSync } from "fs";
const input = readFileSync("./05.txt").toString();
const inputLines = input.split(/[\r\n]+/g);

type Point = { x: number, y: number }

class Line {
  private from: Point;
  private to: Point;
  constructor(from: Point, to: Point) {
    this.from = from;
    this.to = to;
  }

  getPoints(): Point[] {
    let points = new Array<Point>();
    if (this.from.x === this.to.x) {
      const x = this.from.x;
      const ttb = this.from.y < this.to.y;
      const start = ttb ? this.from.y : this.to.y;
      const stop = ttb ? this.to.y : this.from.y;
      for (let i = start; i <= stop; i++)
        points.push({ x, y: i });
    } else if (this.from.y === this.to.y) {
      const y = this.from.y;
      const ttb = this.from.x < this.to.x;
      const start = ttb ? this.from.x : this.to.x;
      const stop = ttb ? this.to.x : this.from.x;
      for (let i = start; i <= stop; i++)
        points.push({ x: i, y });
    }
    return points;
  }

  getDiagonals(): Point[] {
    if (this.from.x === this.to.x || this.from.y === this.to.y) {
      return this.getPoints();
    }
    let points = new Array<Point>();
    const diffX = Math.abs(this.from.x - this.to.x);
    let [x, y] = [this.from.x, this.from.y];
    for (let i = 0; i < diffX + 1; i++) {
      points.push({ x, y });
      x += this.from.x > this.to.x ? -1 : 1;
      y += this.from.y > this.to.y ? -1 : 1;
    }
    return points;
  }
}

const lines = inputLines.map(l => l.split("->"))
  .map(([a, b]) => [a.split(","), b.split(",")])
  .map(([a, b]) => [parseInt(a[0]), parseInt(a[1]), parseInt(b[0]), parseInt(b[1])])
  .map(([x1, y1, x2, y2]) => new Line({ x: x1, y: y1 }, { x: x2, y: y2 }));

const counted = {} as { [key: string]: number };
lines.map(l => l.getPoints())
  .forEach(p => p.forEach(p => {
    let k = `${p.x},${p.y}`;
    let n = counted[k];
    counted[k] = n ? n + 1 : 1;
  }));
console.log("Double", Object.values(counted).filter(v => v !== 1).length);

const countedDiagonal = {} as { [key: string]: number };
lines.map(l => l.getDiagonals())
  .forEach(p => p.forEach(p => {
    let k = `${p.x},${p.y}`;
    let n = countedDiagonal[k];
    countedDiagonal[k] = n ? n + 1 : 1;
  }));

console.log("Double2", Object.values(countedDiagonal).filter(v => v !== 1).length);