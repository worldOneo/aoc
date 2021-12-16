use std::collections::HashMap;

#[derive(PartialEq, Clone, Copy)]
enum Status {
  TAKEN,
  SEAT,
  FLOOR,
}

type Input = Vec<Vec<Status>>;

fn read_input() -> Input {
  std::fs::read_to_string("./11/11.txt")
    .unwrap()
    .lines()
    .map(|line| {
      line
        .chars()
        .map(|c| {
          if c == 'L' {
            Status::SEAT
          } else {
            Status::FLOOR
          }
        })
        .collect::<Vec<Status>>()
    })
    .collect()
}

fn part1(input: &Input) {
  let mut local = input
    .iter()
    .map(|f| f.iter().map(|s| *s).collect::<Vec<Status>>())
    .collect::<Vec<Vec<Status>>>();

  let h = local.len();
  let w = local[0].len();
  loop {
    let mut changed = false;
    let mut occupied_around = HashMap::new();
    for y in 0..h {
      for x in 0..w {
        let mut n = 0;
        for (dx, dy) in [
          (-1, 0),
          (-1, -1),
          (0, -1),
          (1, 0),
          (1, 1),
          (0, 1),
          (-1, 1),
          (1, -1),
        ] {
          let p = x as i32 + dx;
          let q = y as i32 + dy;

          if p < 0 || q < 0 {
            continue;
          }
          let p = p as usize;
          let q = q as usize;
          if p >= w || q >= h {
            continue;
          }

          if local[q][p] == Status::TAKEN {
            n += 1;
          }
        }
        occupied_around.insert((x, y), n);
      }
    }

    for y in 0..h {
      for x in 0..w {
        let occupied = occupied_around[&(x, y)];
        if occupied == 0 {
          if local[y][x] == Status::SEAT {
            local[y][x] = Status::TAKEN;
            changed = true;
          }
        } else if occupied >= 4 {
          if local[y][x] == Status::TAKEN {
            local[y][x] = Status::SEAT;
            changed = true;
          }
        }
      }
    }

    if !changed {
      break;
    }
  }

  println!(
    "Part1: {}",
    local
      .iter()
      .map(|f| f
        .iter()
        .fold(0, |p, c| if c == &Status::TAKEN { p + 1 } else { p }))
      .sum::<i32>()
  );
}

fn create_seat_mapping(input: &Input) -> HashMap<(usize, usize), Vec<(usize, usize)>> {
  let mut map = HashMap::new();
  let h = input.len();
  let w = input[0].len();
  for y in 0..h {
    for x in 0..w {
      if input[y][x] == Status::FLOOR {
        continue;
      }
      map.insert((x, y), vec![]);
      for (dx, dy) in [
        (-1, 0),
        (-1, -1),
        (0, -1),
        (1, 0),
        (1, 1),
        (0, 1),
        (-1, 1),
        (1, -1),
      ] {
        let mut p = x as i32;
        let mut q = y as i32;
        loop {
          p += dx;
          q += dy;
          if p < 0 || q < 0 {
            break;
          }
          let p = p as usize;
          let q = q as usize;
          if p >= w || q >= h {
            break;
          }
          if input[q][p] == Status::SEAT {
            map.get_mut(&(x, y)).unwrap().push((p, q));
            break;
          }
        }
      }
    }
  }
  return map;
}

fn part2(input: &Input) {
  let mapping = create_seat_mapping(input);
  let mut local = input
    .iter()
    .map(|f| f.iter().map(|s| *s).collect::<Vec<Status>>())
    .collect::<Vec<Vec<Status>>>();

  let h = local.len();
  let w = local[0].len();
  loop {
    let mut changed = false;
    let mut occupied_around = HashMap::new();
    for y in 0..h {
      for x in 0..w {
        if input[y][x] == Status::FLOOR {
          continue;
        }
        let mut n = 0;
        for (x, y) in mapping[&(x, y)].iter() {
          if local[*y][*x] == Status::TAKEN {
            n += 1;
          }
        }
        occupied_around.insert((x, y), n);
      }
    }

    for y in 0..h {
      for x in 0..w {
        if input[y][x] == Status::FLOOR {
          continue;
        }
        let occupied = occupied_around[&(x, y)];
        if occupied == 0 {
          if local[y][x] == Status::SEAT {
            local[y][x] = Status::TAKEN;
            changed = true;
          }
        } else if occupied >= 5 {
          if local[y][x] == Status::TAKEN {
            local[y][x] = Status::SEAT;
            changed = true;
          }
        }
      }
    }

    if !changed {
      break;
    }
  }

  println!(
    "Part2: {}",
    local
      .iter()
      .map(|f| f
        .iter()
        .fold(0, |p, c| if c == &Status::TAKEN { p + 1 } else { p }))
      .sum::<i32>()
  );
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
