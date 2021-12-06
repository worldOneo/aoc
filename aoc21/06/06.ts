import { readFileSync } from "fs";
const input = readFileSync("./06.txt").toString();

const initialFishes = input.split(",").map(f => parseInt(f));
const fishes = new Array<number>(9).fill(0);
initialFishes.forEach(fish => fishes[fish]++);

for (let i = 0; i < 256; i++) {
  var tmp = 0;
  for (let fish = 8; fish > -1; fish--) {
    if (fish === 0) {
      fishes[6] += fishes[0];
      fishes[8] += fishes[0];
    }
    let n = fishes[fish];
    fishes[fish] = tmp;
    tmp = n;
  }
}
console.log(fishes);
console.log(fishes.reduce((p, c) => p + c, 0));