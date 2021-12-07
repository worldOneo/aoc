import { readFileSync } from "fs";
const input = readFileSync("./07.txt").toString();

const crabs = input.split(",").map(f => parseInt(f));


const getFuelCost = (from: number, to: number) => Math.abs(from - to);
const linCost = getFuelCost;
const incCost = (from: number, to: number) => (linCost(from, to) * (linCost(from, to) + 1)) / 2;
const getTotalCost =
  (from: number[], to: number, cost: (a0: number, a1: number) => number) => from
    .map(f => cost(f, to))
    .reduce((p, c) => p + c, 0);

const minTotalCost = (crabs: number[], cost: (a0: number, a1: number) => number) => {
  const max = Math.max(...crabs);
  const min = Math.min(...crabs);
  let minFuelCost = 1E10;
  for (let position = min; position < max; position++) {
    minFuelCost = Math.min(minFuelCost, getTotalCost(crabs, position, cost));
  }
  return minFuelCost;
}

console.log("Fuelcost p1", minTotalCost(crabs, linCost));
console.log("Fuelcost p2", minTotalCost(crabs, incCost));