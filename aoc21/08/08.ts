import { readFileSync } from "fs";
import { setFlagsFromString } from "v8";
const input = readFileSync("./08.txt").toString().split(/[\r\n]+/gi);

const segA = 1;
const segB = 2;
const segC = 4;
const segD = 8;
const segE = 16;
const segF = 32;
const segG = 64;

const one = segC | segF;
const seven = one | segA;
const four = one | segB | segD | segF;
const nine = four | segA;
const eight = nine | segE;
const three = seven | segD | segG;
const five = nine ^ segC;
const six = eight ^ segC;
const zero = eight ^ segD;
const two = eight ^ segB ^ segF;

const segMap: Record<string, number> = {
  a: segA,
  b: segB,
  c: segC,
  d: segD,
  e: segE,
  f: segF,
  g: segG,
}

const patterns = input
  .map(l => ({ segs: l.split("|")[0], on: l.split("|")[1] }))
  .map(({ segs, on }) => ({ segs: segs.split(" "), on: on.split(" ") }))
  .map(({ segs, on }) => ({ segs: segs.filter(s => s.length !== 0), on: on.filter(s => s.length !== 0) }));
console.log("Part 1:", patterns
  .map(({ on }) => on)
  .map(o => o.map(l => l.length))
  .reduce((p, c) =>
    p + c.reduce((p, c) => (c == 2 || c == 3 || c == 4 || c == 7) ? p + 1 : p, 0), 0));

const bitCount = (n: number) => {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

const overlaps = (a: number, b: number) => (a & b) === b;

const mapSeg = (a: string) => a.split("").reduce((p, c) => p | segMap[c], 0);
const mapSegs = (a: string[]) => a.map(s => mapSeg(s));
const getValue = ({ segs, on }: typeof patterns[0]) => {
  const rsegs = mapSegs(segs);
  const ron = mapSegs(on);
  const idx = new Array<number>(1);
  idx[1] = rsegs.findIndex(p => bitCount(p) === 2);
  idx[4] = rsegs.findIndex(p => bitCount(p) === 4);
  idx[7] = rsegs.findIndex(p => bitCount(p) === 3);
  idx[8] = rsegs.findIndex(p => bitCount(p) === 7);
  idx[3] = rsegs.findIndex(p => bitCount(p) === 5 && overlaps(p, rsegs[idx[7]]));
  idx[9] = rsegs.findIndex(p => bitCount(p) === 6 && overlaps(p, rsegs[idx[4]]));
  idx[5] = rsegs.findIndex((p, i) => bitCount(p) === 5 && overlaps(rsegs[idx[9]], p) && !idx.includes(i));
  idx[2] = rsegs.findIndex((p, i) => bitCount(p) === 5 && !idx.includes(i));
  idx[6] = rsegs.findIndex((p, i) => bitCount(p) === 6 && overlaps(p, rsegs[idx[5]]) && !idx.includes(i));
  idx[0] = rsegs.findIndex((p, i) => bitCount(p) === 6 && !idx.includes(i));
  const mapped: Record<number, number> = {};
  idx.forEach((v, i) => mapped[rsegs[v]] = i);
  return ron.map(r => mapped[r]).reduce((p, c) => p * 10 + c, 0);
}

console.log("Part 2:", patterns.map(p => getValue(p)).reduce((p, c) => p + c, 0)); //
