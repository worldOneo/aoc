import { readFileSync } from "fs";
const input = readFileSync("./01.txt").toString();

const measurements = input.split(/[\r\n]+/g).map(m => parseInt(m));

const scan = (ms: number[]) => {
  let prev = ms[0];
  let measured = 0;
  ms.forEach(m => {
    if (m > prev)
      measured++;
    prev = m;
  });
  return measured;
}

console.log("Inc:", scan(measurements)); // 1557

const windows = new Array<number>();
for (let i = 2; i < measurements.length; i++) {
  windows.push(measurements[i] + measurements[i - 1] + measurements[i - 2]);
}


console.log("Avg:", scan(windows)); // 1608
