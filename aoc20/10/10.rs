use std::collections::VecDeque;

type Input = Vec<i32>;

fn read_input() -> Input {
  std::fs::read_to_string("./10/10.txt")
    .unwrap()
    .lines()
    .filter(|f| !f.is_empty())
    .map(|f| f.parse::<i32>().unwrap())
    .collect()
}

fn part1(input: &Input) {
  let mut sorted = vec![0];
  sorted.extend(input.to_vec());
  sorted.sort();
  sorted.push(sorted.last().unwrap() + 3);

  let mut diffs: [i32; 3] = [0, 0, 0];
  for window in sorted.windows(2) {
    diffs[(window[1] - window[0]) as usize - 1] += 1;
  }
  println!("{} x {} = {}", diffs[0], diffs[2], diffs[0] * diffs[2]);
}

fn count_variations(left_over: &VecDeque<i32>, into: i32) -> i64 {
  let mut count: i64 = 0;
  if left_over.len() == 0 {
    return 1;
  }
  let mut my: VecDeque<i32> = VecDeque::new();
  my.extend(left_over);
  while !my.is_empty() {
    let elem: i32 = my.pop_front().unwrap();
    if elem - into > 3 {
      continue;
    }
    count += count_variations(&my, elem);
  }
  count
}

fn part2(input: &Input) {
  let mut sorted = input.to_vec();
  sorted.sort();
  let deq: VecDeque<i32> = VecDeque::from(sorted);
  let mut broken: Vec<i32> = Vec::new();
  let mut chuncked: Vec<VecDeque<i32>> = Vec::new();

  let mut last: i32 = 0;
  deq.iter().for_each(|x| {
    if *x - last > 2 {
      chuncked.push(VecDeque::from(broken.to_vec()));
      broken.clear();
    }
    last = *x;
    broken.push(last);
  });
  chuncked.push(VecDeque::from(broken));
  let mut last: i32 = 0;

  let res = chuncked
    .iter()
    .map(|c| {
      let res = count_variations(c, last);
      last = c[c.len() - 1];
      res
    })
    .fold(1, |p, c| p * c);
  println!("{:?} Variants", res);
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
