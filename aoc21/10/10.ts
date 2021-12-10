import { readFileSync } from "fs";
const input = readFileSync("./10.txt").toString().split(/[\r\n]+/gi);
const lines = input.map(line => line.split(""));

const closing: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">"
}

const scores: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137
}

const scores2: Record<string, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4
}

console.log("Part1:", lines.map(v => {
  const required = new Array<string>();
  return v.map(e => {
    if (e in closing) {
      required.push(closing[e]);
      return 0;
    }
    return required.pop() === e ? 0 : scores[e];
  }).filter(v => v != 0)
    .splice(0, 1)[0];
}).filter(v => v).reduce((p, c) => p + c, 0));

const p2 = lines.map(line => {
  const required = new Array<string>();
  let corrupt = false;
  line.forEach(e => {
    if (corrupt) return;
    if (e in closing) {
      required.push(closing[e]);
    } else if (required[required.length - 1] === e) {
      required.pop();
    } else corrupt = true;
  })
  return !corrupt ? required.reverse().join("") : "";
}).filter(v => v)
  .map(v => v?.split("")
    .reduce((p, c) => p * 5 + scores2[c], 0))
  .sort((a, b) => a - b);

console.log("Part2:", p2[(p2.length - 1) / 2]); //
