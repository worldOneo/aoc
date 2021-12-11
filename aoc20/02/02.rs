use regex::Regex;
use std::string::String;

struct Required {
  from: i32,
  to: i32,
  c: char,
}

type Input = Vec<(Required, String)>;

fn read_input() -> Input {
  let re = Regex::new(r"(\d+)-(\d+)\s+(.):\s+(\w+)").unwrap();
  return std::fs::read_to_string("./02/02.txt")
    .expect("Failed to read file 02.txt")
    .lines()
    .map(|line| re.captures(line).unwrap())
    .map(|line| {
      (
        Required {
          from: line[1].parse::<i32>().unwrap(),
          to: line[2].parse::<i32>().unwrap(),
          c: line[3].chars().next().unwrap(),
        },
        line[4].to_string(),
      )
    })
    .collect();
}

fn part1(input: &Input) {
  let count = input
    .iter()
    .filter(|password| {
      let search = password.0.c;
      let count = password.1.chars().filter(move |c| *c == search).count() as i32;
      count >= password.0.from && count <= password.0.to
    })
    .count();
  println!("{} valid passwords", count)
}

fn part2(input: &Input) {
  let count = input
    .iter()
    .filter(|password| {
      let search = password.0.c;
      let from = password.0.from;
      let to = password.0.to;
      let first = password.1.chars().nth(from as usize - 1).unwrap();
      let second = password.1.chars().nth(to as usize - 1).unwrap();
      (first == search || second == search) && first != second
    })
    .count();
  println!("{} valid passwords", count)
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
