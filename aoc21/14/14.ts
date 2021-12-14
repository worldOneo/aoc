import { readFileSync } from "fs";

const input = readFileSync("./14.txt")
  .toString()
  .split(/[\r\n]+/gi);

const mappings: Record<string, string> = {};
input.slice(1).map(s => s.split(" -> ")).forEach(s => mappings[s[0]] = s[1]);

const transform = (template: Record<string, number>) => {
  template = { ...template };
  for (let entrie of Object.entries(template)) {
    const [conn, inc] = entrie;
    const [a, b] = [conn.charAt(0), conn.charAt(1)];
    const part = a + b;
    if (part in mappings) {
      const mapping = mappings[part];
      const transformedA = a + mapping;
      const transformedB = mapping + b;
      template[part] = (template[part] || inc) - inc;
      template[transformedA] = (template[transformedA] || 0) + inc;
      template[transformedB] = (template[transformedB] || 0) + inc;
    }
  }
  return template;
}

const transformN = (template: Record<string, number>, n: number): Record<string, number> => {
  if (n === 0)
    return template;
  return transformN(transform(template), n - 1)
}


const calc = (n: number) => {
  const polymerTemplate = input[0];
  const parsedPolyTemplate: Record<string, number> = {};

  for (let i = 1; i < polymerTemplate.length; i++) {
    const part = polymerTemplate.charAt(i - 1) + polymerTemplate.charAt(i);
    parsedPolyTemplate[part] = (parsedPolyTemplate[part] || 0) + 1;
  }

  const poly = transformN(parsedPolyTemplate, n);
  const results: Record<string, number> = {};
  Object.entries(poly).forEach(([a, b]) => {
    results[a.charAt(0)] = (results[a.charAt(0)] || 0) + b;
    results[a.charAt(1)] = (results[a.charAt(1)] || 0) + b;
  });
  results[polymerTemplate.charAt(0)] += 1;
  results[polymerTemplate.charAt(polymerTemplate.length - 1)] += 1;

  const counts = Object.entries(results).map(item => item[1]);
  const [min, max] = [Math.min(...counts), Math.max(...counts)];
  return (max - min) / 2;
}


console.log("Part1:", calc(10));
console.log("Part2:", calc(40));