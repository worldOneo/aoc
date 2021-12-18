import { readFileSync } from "fs";

const lines = readFileSync("./18.txt")
  .toString()
  .split(/[\r\n]+/gi)
  .map(n => JSON.parse(n) as SnailfishNumber);
let input = () => JSON.parse(JSON.stringify(lines));

type SnailfishNumber = [SnailfishNumber | number, SnailfishNumber | number];

const isNumber = (n: SnailfishNumber | number) => typeof n === "number";
const isArray = Array.isArray;

const pushTo = (n: SnailfishNumber, v: number, idx: number): number | void =>
  isNumber(n[idx])
    ? (n[idx] as number) += v
    : pushTo(n[idx] as SnailfishNumber, v, idx);

const pushToL = (n: SnailfishNumber, v: number): number | void => pushTo(n, v, 0);

const pushToR = (n: SnailfishNumber, v: number): number | void => pushTo(n, v, 1);

const explode = (n: SnailfishNumber, depth: number = 4): [boolean, number, number] => {
  if (depth === 1) {
    if (isArray(n[0]) && isNumber(n[0][1]) && isNumber(n[0][1])) {
      let temp = n[0];
      n[0] = 0;
      if (isArray(n[1])) {
        (n[1][0] as number) += (temp[1] as number)
      } else n[1] += temp[1] as number;
      return [true, (temp[0] as number), 0];
    }
    if (isArray(n[1]) && isNumber(n[1][0]) && isNumber(n[1][1])) {
      let temp = n[1];
      n[1] = 0;
      if (isArray(n[0])) {
        (n[0][1] as number) += (temp[1] as number);
      } else n[0] += temp[0] as number;
      return [true, 0, (temp[1] as number)];
    }
  }

  if (isNumber(n[0]) && isArray(n[1])) {
    let [did, a, b] = explode(n[1], depth - 1);
    (n[0] as number) += a;
    return [did, 0, b];
  } else if (isArray(n[0]) && isNumber(n[1])) {
    let [did, a, b] = explode(n[0], depth - 1);
    (n[1] as number) += b;
    return [did, a, 0];
  } else if (isArray(n[0]) && isArray(n[1])) {
    let [did, a, b] = explode(n[0], depth - 1);
    if (did) {
      pushToL(n[1], b);
      return [true, a, 0];
    }
    [did, a, b] = explode(n[1], depth - 1);
    pushToR(n[0], a);
    return [did, 0, b];
  }
  return [false, 0, 0];
}

const split = (n: SnailfishNumber): boolean => {
  if (isArray(n[0])) {
    if (split(n[0] as SnailfishNumber))
      return true;
  } else if (n[0] >= 10) {
    n[0] = [Math.floor((n[0] as number) / 2), Math.ceil((n[0] as number) / 2)];
    return true;
  }
  if (isArray(n[1])) {
    return split(n[1] as SnailfishNumber);
  } else if (n[1] >= 10) {
    n[1] = [Math.floor((n[1] as number) / 2), Math.ceil((n[1] as number) / 2)];
    return true;
  }
  return false;
}

const reduce = (n: SnailfishNumber) => {
  while (true) {
    let did: boolean;
    do {
      [did] = explode(n);
    } while (did);
    if (!split(n))
      break;
  }
}

const magnitude = (n: SnailfishNumber | number): number => {
  if (isArray(n))
    return 3 * magnitude(n[0]) + 2 * magnitude(n[1]);
  return n as number;
}

const add = (a: SnailfishNumber, b: SnailfishNumber): SnailfishNumber => {
  const c: SnailfishNumber = [a, b];
  reduce(c);
  return c;
}

const equals = (a: SnailfishNumber, b: SnailfishNumber) =>
  a.length == b.length && a.every((t, i) => t == b[i])

const sum = (a: SnailfishNumber[]): SnailfishNumber =>
  a.reduce((p, c) => equals(p, [-1, -1]) ? c : add(p, c), [-1, -1]);

let calculated = sum(input());
console.log("Part1:", magnitude(calculated));

let max = -Infinity;
let len = input().length;
for (let i = 0; i < len; i++) {
  let b = input();
  for (let j = 0; j < len; j++) {
    if (i == j)
      continue;
    let a = input();
    max = Math.max(magnitude(sum([a[i], b[j]])), max);
  }
}
console.log("Part2:", max);