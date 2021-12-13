use regex::Regex;
use std::collections::HashMap;
use std::collections::HashSet;
use std::collections::VecDeque;

type Input = HashMap<String, Vec<(i32, String)>>;

fn read_input() -> Input {
  let mut input: Input = HashMap::new();
  let parent = Regex::new(r"^([a-z]+ [a-z]+) bags?").unwrap();
  let children = Regex::new(r"(\d+) ([a-z]+ [a-z]+) bags?").unwrap();

  std::fs::read_to_string("./07/07.txt")
    .unwrap()
    .lines()
    .map(|line| line.to_string())
    .collect::<Vec<String>>()
    .iter()
    .for_each(|line| {
      let parent = parent.captures(line).unwrap()[1].to_string();

      let children = children.captures_iter(line);

      children.for_each(|m| {
        let amount = m[1].to_string().parse::<i32>().unwrap();
        let current = m[2].to_string();
        input.entry(parent.clone()).or_insert(vec![]);
        input
          .get_mut(&parent)
          .unwrap()
          .push((amount, current.clone()));
      });
    });
  return input;
}

fn part1(input: &Input) {
  let mut visited: HashSet<String> = HashSet::new();
  let mut top_level_bags: VecDeque<String> = VecDeque::new();
  top_level_bags.push_back("shiny gold".to_string());
  let mut count = 0;
  while !top_level_bags.is_empty() {
    let bag = top_level_bags.pop_front().unwrap();
    if visited.contains(&bag) {
      continue;
    }
    visited.insert(bag.clone());
    count += 1;

    let new: Vec<(i32, String)> = vec![];
    input
      .get(&bag)
      .or_else(|| Some(&new))
      .unwrap()
      .iter()
      .for_each(|(_, s)| top_level_bags.push_back(s.clone()));
  }
  println!("Count: {}", count - 1);
}

fn part2(input: &Input) {
  let mut cnt = -1;
  let mut bags_inside: VecDeque<(i32, String)> = VecDeque::new();
  bags_inside.push_back((1, "shiny gold".to_string()));
  while !bags_inside.is_empty() {
    let (amount, bag) = bags_inside.pop_front().unwrap();
    cnt += amount;

    let v = &input.get(&bag);
    if v.is_none() {
      continue;
    }
    v.unwrap()
      .iter()
      .for_each(|(n, bag)| bags_inside.push_back((n * amount, bag.clone())));
  }
  println!("Total bags: {}", cnt);
}

fn main() {
  let input = read_input();
  println!("{:?}", input);
  part1(&input);
  part2(&input);
}
