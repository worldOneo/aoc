import { readFileSync } from "fs";
const input = readFileSync("./02.txt").toString();
const lines = input.split(/[\r\n]+/g);
const instructions = lines.map<[string, number]>(line => {
  const parts = line.split(" ");
  return [parts[0], parseInt(parts[1])];
});

let horizontal = 0;
let depth = 0;

instructions.forEach(instruction => {
  switch (instruction[0]) {
    case "forward":
      horizontal += instruction[1];
      break;
    case "down":
      depth += instruction[1];
      break;
    case "up":
      depth -= instruction[1];
      break;
  }
});

console.log("Depth", depth, "Horizontal", horizontal, "Mult", depth * horizontal);


horizontal = 0;
depth = 0;
let aim = 0;

instructions.forEach(instruction => {
  switch (instruction[0]) {
    case "forward":
      horizontal += instruction[1];
      depth += aim * instruction[1];
      break;
    case "down":
      aim += instruction[1];
      break;
    case "up":
      aim -= instruction[1];
      break;
  }
});


console.log("Depth", depth, "Horizontal", horizontal, "Aim", aim, "Mult", depth * horizontal);