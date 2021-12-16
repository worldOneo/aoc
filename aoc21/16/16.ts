import { readFileSync } from "fs";
import { inspect } from "util";

const HEADER_VERSION_SIZE = 3;
const HEADER_TYPE_SIZE = 3;
const HEADER_IS15BITS = 1;
const GROUP_SIZE = 5;

const intToBin = (n: number): number[] => {
  const a = [];
  for (let idx of [0b1, 0b10, 0b100, 0b1000])
    a.push((n & idx) === idx ? 1 : 0);
  return a;
}

const pullBits = (bits: number[], n: number): number[] => bits.splice(0, n);

const bitsToInt = (bits: number[]): number => {
  let a = 0;
  bits.forEach(bit => {
    a <<= 1;
    a += bit;
  });
  return a;
}

const input = new Array<number>();
readFileSync("./16.txt")
  .toString()
  .split("")
  .map(c => parseInt(c, 16))
  .map(n => intToBin(n).reverse())
  .forEach((e) => input.push(...e));

type Operator = "SUM" | "PRODUCT" | "MIN" | "MAX" | "GT" | "LT" | "EQ";
type Packate = {
  version: number,
}
  & ({
    type: "LITERAL",
    payload: bigint,
  } | {
    type: Operator,
    payload: Packate[]
  });

const operatorMapping: Record<number, Operator> = {
  0: "SUM",
  1: "PRODUCT",
  2: "MIN",
  3: "MAX",
  5: "GT",
  6: "LT",
  7: "EQ",
};

const readLiteral = (bits: number[]): bigint => {
  let a = BigInt(0);
  while (true) {
    const pulled = pullBits(bits, GROUP_SIZE);
    const last = pulled.shift();
    a <<= BigInt(4);
    a += BigInt(bitsToInt(pulled));
    if (last !== 1)
      return a;
  }
}

const parsePacket = (bits: number[]): Packate => {
  const version = bitsToInt(pullBits(bits, HEADER_VERSION_SIZE));
  const type = bitsToInt(pullBits(bits, HEADER_TYPE_SIZE));
  if (type == 4) {
    return {
      version,
      type: "LITERAL",
      payload: readLiteral(bits),
    };
  } else {
    const is15Bit = bitsToInt(pullBits(bits, HEADER_IS15BITS)) == 0;
    let payload = new Array<Packate>();
    if (is15Bit) {
      const size = 15;
      const subBits = bitsToInt(pullBits(bits, size));
      const subPackages = pullBits(bits, subBits);
      while (subPackages.includes(1)) {
        payload.push(parsePacket(subPackages));
      }
    } else {
      const size = 11;
      const length = bitsToInt(pullBits(bits, size));
      for (let i = 0; i < length; i++) {
        payload.push(parsePacket(bits));
      }
    }
    return {
      version,
      type: operatorMapping[type],
      payload
    }
  };
}

const sumVersions = (packet: Packate): number => {
  if (packet.type == "LITERAL")
    return packet.version;
  else
    return packet.version + packet.payload
      .map(p => sumVersions(p))
      .reduce((p, c) => p + c, 0);
}

const part1 = (bits: number[]) => {
  const copy = [...bits];
  const pkg = parsePacket(copy);
  console.log(inspect(pkg, { depth: null }))
  console.log("Part1", sumVersions(pkg));
}

const runPacket = (packet: Packate): bigint => {
  switch (packet.type) {
    case "LITERAL":
      return packet.payload;
    case "EQ":
      return runPacket(packet.payload[0]) == runPacket(packet.payload[1]) ? 1n : 0n;
    case "GT":
      return runPacket(packet.payload[0]) > runPacket(packet.payload[1]) ? 1n : 0n;
    case "LT":
      return runPacket(packet.payload[0]) < runPacket(packet.payload[1]) ? 1n : 0n;
    case "MAX":
      return packet.payload.map(p => runPacket(p)).reduce((p, c) => p > c ? p : c, -1_000_000_000_000_000n);
    case "MIN":
      return packet.payload.map(p => runPacket(p)).reduce((p, c) => p < c ? p : c, 1_000_000_000_000_000n);
    case "PRODUCT":
      return packet.payload.map(p => runPacket(p)).reduce((p, c) => p * c, 1n);
    case "SUM":
      return packet.payload.map(p => runPacket(p)).reduce((p, c) => p + c, 0n);
    default:
      throw "Packate has no type.";
  }
}

const part2 = (bits: number[]) => {
  const copy = [...bits];
  const pkg = parsePacket(copy);
  console.log("Part2", runPacket(pkg));
}

part1(input);
part2(input);