type Input = Vec<String>;

fn read_input() -> Input {
  return std::fs::read_to_string("./05/05.txt")
    .unwrap()
    .lines()
    .map(|f| f.to_string())
    .collect();
}

fn to_seat_id(input: &Input) -> Vec<i32> {
  input
    .iter()
    .map(|l| (&l[0..7], &l[7..]))
    .map(|(row, col)| {
      (
        row.replace("F", "0").replace("B", "1"),
        col.replace("R", "1").replace("L", "0"),
      )
    })
    .map(|(row, col)| {
      (
        i32::from_str_radix(&row, 2).unwrap(),
        i32::from_str_radix(&col, 2).unwrap(),
      )
    })
    .map(|(row, col)| row * 8 + col)
    .collect()
}

fn part1(input: &Input) {
  let max = to_seat_id(input)
    .iter()
    .fold(std::i32::MIN, |a, b| a.max(*b));
  println!("Max: {}", max);
}

fn part2(input: &Input) {
  let mut ids = to_seat_id(input);
  let mut missing = -1;
  ids.sort();
  let mut last = ids[0] - 1;
  ids.iter().for_each(|i| {
    if last + 1 != *i {
      missing = last + 1;
      println!("Missing: {}", missing);
    }
    last = *i;
  });
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
