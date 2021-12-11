type Input = Vec<Vec<bool>>;

fn read_input() -> Input {
  return std::fs::read_to_string("./03/03.txt")
    .expect("Failed to read file 03.txt")
    .lines()
    .map(|line| line.chars().map(|tree| tree == '#').collect::<Vec<bool>>())
    .collect();
}

fn count_hits(dx: usize, dy: usize, input: &Input) -> usize {
  let mut x = 0;
  let mut y = 0;
  let mut hits = 0;
  while y < input.len() {
    x %= input[0].len();
    if input[y][x] {
      hits += 1;
    }
    y += dy;
    x += dx;
  }
  hits
}

fn part1(input: &Input) {
  println!("Hit {} trees", count_hits(3, 1, input));
}

fn part2(input: &Input) {
  println!(
    "Result {}",
    count_hits(1, 1, input)
      * count_hits(3, 1, input)
      * count_hits(5, 1, input)
      * count_hits(7, 1, input)
      * count_hits(1, 2, input)
  );
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
