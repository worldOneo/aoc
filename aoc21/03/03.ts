import { readFileSync } from "fs";
const input = readFileSync("./03.txt").toString();
const lines = input.split(/[\r\n]+/g);

const BIT_SIZE = lines[0].length;


const countZeroOnes = (numbers: string[]) => {
  const zeros = new Array<number>(BIT_SIZE).fill(0);
  const ones = new Array<number>(BIT_SIZE).fill(0);
  numbers.forEach(n => {
    for (let i = 0; i < n.length; i++) {
      if (n.charAt(i) == "0")
        zeros[i]++;
      else
        ones[i]++;
    }
  });
  return [zeros, ones];
}

const [zeros, ones] = countZeroOnes(lines);
let gamma = 0;
let epsilon = 0;

for (let i = 0; i < BIT_SIZE; i++) {
  gamma <<= 1;
  epsilon <<= 1;
  if (zeros[i] > ones[i]) {
    gamma++;
  } else {
    epsilon++;
  }
}

console.log("Epsilon", epsilon, "Gamma", gamma, "Power", epsilon * gamma);

let oxygen_numbers = [...lines];
let scrubber_numbers = [...lines];


for (let i = 0; i < BIT_SIZE; i++) {
  const [zeros, ones] = countZeroOnes(oxygen_numbers);
  const need = zeros[i] > ones[i] ? "0" : "1";
  oxygen_numbers = oxygen_numbers.filter(n => n.charAt(i) === need);
  if (oxygen_numbers.length === 1)
    break;
}

for (let i = 0; i < BIT_SIZE; i++) {
  const [zeros, ones] = countZeroOnes(scrubber_numbers);
  const need = zeros[i] > ones[i] ? "1" : "0";
  scrubber_numbers = scrubber_numbers.filter(n => n.charAt(i) === need);
  if (scrubber_numbers.length === 1)
    break;
}

let oxygen = parseInt(oxygen_numbers[0], 2);
let scrubber = parseInt(scrubber_numbers[0], 2);

console.log("OxygenN", oxygen_numbers.length, "ScrubberN", scrubber_numbers.length);
console.log("Oxygen", oxygen, "Scrubber", scrubber, "Diagnostic", oxygen * scrubber);