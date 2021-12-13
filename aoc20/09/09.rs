type Input = Vec<i64>;

fn read_input() -> Input {
  std::fs::read_to_string("./09/09.txt")
    .unwrap()
    .lines()
    .map(|l| l.to_string().parse::<i64>().unwrap())
    .collect()
}

const PREAMBLE_SIZE: usize = 25;

fn is_complete(w: &[i64]) -> bool {
  let mut seen: Vec<i64> = Vec::new();
  for i in 0..PREAMBLE_SIZE {
    seen.push(w[i]);
  }
  let search = w[PREAMBLE_SIZE];
  for a in 0..PREAMBLE_SIZE {
    for b in a..PREAMBLE_SIZE {
      if b == a {
        continue;
      }
      if seen[a] + seen[b] == search {
        return true;
      }
    }
  }
  false
}

fn part_1(input: &Input) -> i64 {
  for window in input.windows(PREAMBLE_SIZE + 1) {
    if !is_complete(window) {
      return window[PREAMBLE_SIZE];
    }
  }
  return 0;
}

fn part_2(input: &Input) {
  let search = part_1(input);
  for size in 2..input.len() {
    for window in input.windows(size) {
      if window.iter().fold(0, |p, c| p + *c) == search {
        let min = window.iter().fold(std::i64::MAX, |p, c| p.min(*c));
        let max = window.iter().fold(std::i64::MIN, |p, c| p.max(*c));

        println!("Weakness: {}", min + max);
        return;
      }
    }
  }
}

fn main() {
  let input = read_input();
  println!("Missing {}", part_1(&input));
  part_2(&input);
}
