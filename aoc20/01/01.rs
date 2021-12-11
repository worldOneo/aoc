use std::collections::HashSet;

type Input = Vec<i32>;

fn read_input() -> Input {
  return std::fs::read_to_string("./01/01.txt")
    .expect("Failed to read file 01.txt")
    .lines()
    .map(|line| line.parse::<i32>().unwrap())
    .collect();
}

fn part1(input: &Input) {
  let mut set: HashSet<i32> = HashSet::new();
  for &n in input {
    if set.contains(&(2020 - n)) {
      println!("{} x {} = {}", n, 2020 - n, n * (2020 - n));
      return;
    }
    set.insert(n);
  }
}

fn part2(input: &Input) {
  let mut set: HashSet<i32> = HashSet::new();
  for (i, &n) in input.iter().enumerate() {
    set.clear();
    for &b in &input[i + 1..] {
      let needed = 2020 - b - n;
      if set.contains(&needed) {
        println!("{} x {} x {} = {}", n, b, needed, n * b * needed);
        return;
      }
      set.insert(b);
    }
  }
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
