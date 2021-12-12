import { readFileSync } from "fs";
import { start } from "repl";
const input = readFileSync("./12.txt")
  .toString()
  .split(/[\r\n]+/gi)
  .map(c => c.split("-"))
  .filter(n => n.length === 2);

class Cave {
  public to: Array<string>;
  public big: boolean;
  constructor(to: Array<string>, big: boolean) {
    this.to = to;
    this.big = big;
  }
}

const isBig = (n: string) => n == n.toUpperCase();

const caves: Record<string, Cave> = {};
input.forEach(([name, to]) => {
  if (name in caves) {
    caves[name].to.push(to);
  } else {
    caves[name] = new Cave([to], isBig(name));
  }
  if (to in caves && !caves[to].to.includes(name)) {
    caves[to].to.push(name);
  } else {
    caves[to] = new Cave([name], isBig(to));
  }
});

type WDir = Record<string, number>;

const getConnectedCaves = (from: string, walked: WDir, p2 = false) => {
  let limit = Object.values(walked).includes(2) ? 1 : 2;
  return caves[from].to
    .map(name => ({ name, cave: caves[name] }))
    .filter(({ name }) => name !== "start")
    .filter(({ name, cave }) => cave.big || !(p2 ? ((walked[name] || 0) === limit || (walked[name] || 0) === 2) : name in walked))
}

const walkCaves = (from: string = "start", walked: WDir = {}, route: string[] = [], p2 = false): string[][] | null => {
  walked = { ...walked };
  if (from === "end")
    return [[...route, from]];

  if (p2 && !caves[from].big) {
    walked[from] = from in walked ? 2 : 1;
  } else {
    walked[from] = 1;
  }
  const connected = getConnectedCaves(from, walked, p2);
  if (connected.length === 0)
    return null; // Dead end
  const res: string[][] = [];
  connected
    .map(({ name }) => walkCaves(name, walked, [...route, from], p2))
    .filter(r => r != null)
    .forEach(r => r && res.push(...r));
  return res;
}

console.log("Part1:", walkCaves("start")?.length);
console.log("Part2:", walkCaves("start", {}, [], true)?.length);