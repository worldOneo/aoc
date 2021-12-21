import { readFileSync } from "fs";


const input = readFileSync("./21.txt").toString();
const [p1, p2] = input
  .split(/Player 1 starting position: (\d+)\s+Player 2 starting position: (\d+)/)
  .filter(s => s)
  .map(s => parseInt(s));



let dice = 0;
let rolls = 0;
const rollDice = () => {
  dice++;
  if (dice > 100) dice %= 100;
  rolls++;
  return dice;
}

const part1 = () => {
  let p1turn = true;
  let p1score = 0,
    p2score = 0,
    p1pos = p1,
    p2pos = p2;
  while (Math.max(p1score, p2score) < 1000) {
    let roll = rollDice() + rollDice() + rollDice();
    if (p1turn) {
      p1pos += roll - 1;
      p1pos = p1pos > 10 ? p1pos % 10 : p1pos;
      p1pos++;
      p1score += p1pos;
    } else {
      p2pos += roll - 1;
      p2pos = p2pos > 10 ? p2pos % 10 : p2pos;
      p2pos++;
      p2score += p2pos;
    }
    p1turn = !p1turn;
  }
  console.log("Part1:", rolls, p1score, p2score, rolls * Math.min(p1score, p2score));
}

var splits: Record<number, number> = {};
for (let a = 1; a < 4; a++) {
  for (let b = 1; b < 4; b++) {
    for (let c = 1; c < 4; c++) {
      let outcome = a + b + c;
      splits[outcome] ??= 0;
      splits[outcome]++;
    }
  }
}

// Highest/Lowest possible rolls (1+1+1 | 3+3+3)
const [min, max] = [3, 9];
type Player = { score: number, pos: number };
const play = (p1: Player, p2: Player, p1turn: boolean) => {
  if (p1.score >= 21) return 1;
  if (p2.score >= 21) return 0;
  let m = 0;
  const c = p1turn ? p1 : p2;
  for (let a = min; a <= max; a++) {
    const { pos, score } = c;
    c.pos = ((pos - 1 + a) % 10) + 1;
    c.score += c.pos;
    m += splits[a] * play(p1, p2, !p1turn);
    c.pos = pos;
    c.score = score;
  }
  return m;
}

const part2 = () => {
  console.log("Part2: ", play({ score: 0, pos: p1 }, { score: 0, pos: p2 }, true))
}

part1();
part2();