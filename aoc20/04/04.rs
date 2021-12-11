use regex::Regex;
use std::collections::HashMap;

type Input = Vec<HashMap<String, String>>;

fn read_input() -> Input {
  return std::fs::read_to_string("./04/04.txt")
    .expect("Failed to read file 04.txt")
    .split("\r\n\r\n") // CRLF required
    .map(|passport| passport.lines().collect::<Vec<&str>>().join(" "))
    .map(|passport| {
      let mut map = HashMap::<String, String>::new();
      passport
        .split(" ")
        .map(|pair| pair.split(":").collect::<Vec<&str>>())
        .for_each(|v| {
          map.insert(v[0].to_string(), v[1].to_string());
        });
      map
    })
    .collect();
}

fn part1(input: &Input) {
  let required_fields = [
    "byr".to_string(),
    "iyr".to_string(),
    "eyr".to_string(),
    "hgt".to_string(),
    "hcl".to_string(),
    "ecl".to_string(),
    "pid".to_string(),
  ]
  .into_iter();
  let count = input
    .iter()
    .filter(move |passport| {
      required_fields
        .to_owned()
        .into_iter()
        .map(|c| passport.contains_key(&c))
        .filter(|c| !*c)
        .count()
        == 0
    })
    .count();
  println!("Valid passports: {}", count)
}
type Validator = fn(&String) -> bool;

fn part2(input: &Input) {
  let required_fields: [(String, Validator); 7] = [
    ("byr".to_string(), |v: &String| {
      (1920..2003).contains(&v.parse::<i32>().unwrap())
    }),
    ("iyr".to_string(), |v: &String| {
      (2010..2021).contains(&v.parse::<i32>().unwrap())
    }),
    ("eyr".to_string(), |v: &String| {
      (2020..2031).contains(&v.parse::<i32>().unwrap())
    }),
    ("ecl".to_string(), |v: &String| {
      ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].contains(&v.as_str())
    }),
    ("hgt".to_string(), |x: &String| {
      let regex = Regex::new(r"^(\d+)(cm|in)$").unwrap();
      match regex.captures(x) {
        None => false,
        Some(result) => {
          let num: i32 = result[1].parse().unwrap();
          match &result[2] {
            "cm" => (150..194).contains(&num),
            "in" => (59..77).contains(&num),
            _ => false,
          }
        }
      }
    }),
    ("hcl".to_string(), |x: &String| {
      let regex = Regex::new(r"^#[0-9a-f]{6}$").unwrap();
      regex.captures(x).is_some()
    }),
    ("pid".to_string(), |x: &String| {
      let regex = Regex::new(r"^\d{9}$").unwrap();
      regex.captures(x).is_some()
    }),
  ];
  let count = input
    .iter()
    .filter(move |passport| {
      required_fields
        .to_owned()
        .into_iter()
        .map(|(k, v)| passport.contains_key(&k) && v(&passport[&k]))
        .filter(|c| !*c)
        .count()
        == 0
    })
    .count();
  println!("Valid passports: {}", count)
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
