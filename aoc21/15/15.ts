import { readFileSync } from "fs";
import PriorityQueue, { Node, Tuple } from "./priorityQueue";
const input = readFileSync("./15.txt").toString().split(/[\r\n]+/gi);
const cols = input[0].length;
const rows = input.length;
console.log("Rows", rows, "Cols", cols);
let grid = input.map(line => line.split("").map(char => parseInt(char)));

const getIdx = ({ x, y }: Node, scale: number): number => x + y * cols * scale;

const dijkstra = (scale: number): number => {
  let pq = new PriorityQueue<Node>();
  pq.insert({ x: 0, y: 0 }, 0);

  let visited = new Set<Number>();

  while (pq.size() > 0) {
    let [{ x, y }, cost] = pq.pop();

    if (visited.has(getIdx({ x, y }, scale))) continue;
    visited.add(getIdx({ x, y }, scale));

    if (x == scale * cols - 1 && y == scale * rows - 1) return cost;

    for (let [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      let xx = x + dx;
      let yy = y + dy;
      if (xx < 0 || yy < 0) continue;
      if (yy >= scale * rows || xx >= scale * cols) continue;
      if (visited.has(getIdx({ x: xx, y: yy }, scale))) continue;
      let newCost = grid[yy % rows][xx % cols] + Math.floor(yy / cols) + Math.floor(xx / rows);
      pq.insert({ x: xx, y: yy }, cost + ((newCost - 1) % 9) + 1);
    }
  }
  return -1;
};

console.log("Part1: ", dijkstra(1));
console.log("Part2: ", dijkstra(5));