use std::collections::HashMap;
use std::collections::HashSet;

// Group<Person<Yes's>>
type Input = Vec<Vec<Vec<char>>>;

fn read_input() -> Input {
  let mut a: Input = vec![vec![]];
  let mut insert = 0;

  std::fs::read_to_string("./06/06.txt")
    .unwrap()
    .lines()
    .map(|line| line.to_string())
    .collect::<Vec<String>>()
    .iter()
    .for_each(|line| {
      if line.is_empty() {
        insert += 1;
        a.push(vec![]);
        return;
      }
      a[insert].push(line.chars().collect::<Vec<char>>());
    });
  return a;
}

fn part1(input: &Input) {
  let a = input
    .iter()
    .map(|group| {
      let mut set = HashSet::<char>::new();
      group.iter().for_each(|person| {
        person.iter().for_each(|yes| {
          set.insert(*yes);
        })
      });
      set
    })
    .map(|yess| yess.len())
    .reduce(|p, c| p + c)
    .unwrap();
  println!("Yes's: {}", a);
}

fn part2(input: &Input) {
  let a = input
    .iter()
    .map(|group| {
      let mut set = HashMap::<char, i32>::new();
      group.iter().for_each(|person| {
        person.iter().for_each(|yes| {
          set.entry(*yes).or_insert(0);
          set.insert(*yes, set[yes] + 1);
        })
      });
      (set, group.len())
    })
    .map(|(s, l)| {
      s.iter()
        .filter(|e| *e.1 as usize == l)
        .collect::<Vec<(&char, &i32)>>()
        .len()
    })
    .reduce(|p, c| p + c)
    .unwrap();
  println!("Yes's: {}", a);
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
