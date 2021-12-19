import { readFileSync } from "fs";
import { Z_PARTIAL_FLUSH } from "zlib";


type Point = [x: number, y: number, z: number];

let relatives: Point[][] = [];
let r = -1;
readFileSync("./19.txt")
  .toString()
  .split(/[\r\n]+/gi)
  .forEach(s => {
    let els = s.split(/(-?\d+),(-?\d+),(-?\d+)/gi);
    if (els.length !== 5) {
      r++;
      return;
    }
    relatives[r] ??= [];
    relatives[r].push(els.filter(s => s).map(s => parseInt(s)) as Point)
  });

const buildTransforms = () => {
  const transforms: ((n: Point) => Point)[] = [];
  for (const a of [true, false]) {
    for (const b of [true, false]) {
      for (const c of [true, false]) {
        for (const d of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) {
          transforms.push((p: Point) => [a ? -p[d[0]] : p[d[0]], b ? -p[d[1]] : p[d[1]], c ? -p[d[2]] : p[d[2]]]);
        }
      }
    }
  }
  return transforms;
}

const transforms = buildTransforms();
const mapped: Record<string, Point[]> = { "0,0,0": relatives[0] };
relatives.shift();

const add = ([x1, y1, z1]: Point, [x2, y2, z2]: Point) => [x1 + x2, y1 + y2, z1 + z2] as Point;
const sub = ([x1, y1, z1]: Point, [x2, y2, z2]: Point) => [x1 - x2, y1 - y2, z1 - z2] as Point;


// Sheer violence to brute force it.
findNext: while (relatives.length > 0) {
  console.log("Solved:", Object.values(mapped).length);
  for (const trusted of Object.values(mapped)) {
    for (let rel = 0; rel < relatives.length; rel++) {
      for (const transformation of transforms) {
        const transformed = relatives[rel].map(transformation);
        const matches: Record<string, number> = {};
        for (const trustedBeacon of trusted) {
          for (const unkownBeacon of transformed) {
            const delta = sub(trustedBeacon, unkownBeacon);
            const deltaKey = delta.join(",");
            matches[deltaKey] ??= 0;
            matches[deltaKey]++;
            if (matches[deltaKey] === 12) {
              const trust = transformed.map(transformed => add(delta, transformed));
              mapped[deltaKey] = trust;
              relatives.splice(rel, 1);
              continue findNext;
            }
          }
        }
      }
    }
  }
}

const scanners = Object.keys(mapped)
  .map(s => s.split(","))
  .map(d => d.map(a => parseInt(a)) as Point);
const known = new Set<string>();
Object.values(mapped)
  .map(beacons => beacons
    .forEach(v => known.add(v.join(","))));
console.log(known.size);
let dist = -1000000;
for (let i = 0; i < scanners.length; i++) {
  for (let j = 0; j < scanners.length; j++) {
    if (i === j)
      continue;
    dist = Math.max(sub(scanners[i], scanners[j])
      .map(a => Math.abs(a))
      .reduce((p, c) => p + c, 0), dist);
  }
}
console.log(dist);