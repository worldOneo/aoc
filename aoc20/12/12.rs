use regex::Regex;
use std::ops::Neg;

const NORTH: i32 = 0;
const EAST: i32 = 90;
const SOUTH: i32 = 180;
const WEST: i32 = 270;
const DIR_SHFT: i32 = 15;
const DIR_MASK_A: i32 = (0b1 << DIR_SHFT) - 1;
const DIR_MASK_B: i32 = DIR_MASK_A << DIR_SHFT;

#[derive(PartialEq, Clone, Copy, Debug)]
enum Instruction {
  DIR,
  ROTATE,
  MOVE,
}

type Input = Vec<(Instruction, i32)>;

fn read_input() -> Input {
  let re = Regex::new(r"(\w)(\d+)").unwrap();
  let mut inp: Input = vec![];
  std::fs::read_to_string("./12/12.txt")
    .unwrap()
    .lines()
    .map(|line| re.captures(line).unwrap())
    .for_each(|c| {
      let inst = c.get(1).unwrap().as_str();
      let n = c.get(2).unwrap().as_str().parse::<i32>().unwrap();
      match inst {
        "R" => inp.push((Instruction::ROTATE, n)),
        "L" => inp.push((Instruction::ROTATE, 360 - n)),
        "F" => inp.push((Instruction::MOVE, n)),
        "B" => inp.push((Instruction::MOVE, -n)),
        "E" => inp.push((Instruction::DIR, (n << DIR_SHFT) + EAST)),
        "N" => inp.push((Instruction::DIR, (n << DIR_SHFT) + NORTH)),
        "S" => inp.push((Instruction::DIR, (n << DIR_SHFT) + SOUTH)),
        "W" => inp.push((Instruction::DIR, (n << DIR_SHFT) + WEST)),
        _ => panic!("Invalid instruction"),
      }
    });
  inp
}

type Converter<T> = fn(i32) -> T;
fn get_dx<T>(r: T, n: T, f: Converter<T>) -> T
where
  T: Neg<Output = T> + PartialEq,
{
  if r == f(EAST) {
    return n;
  } else if r == f(WEST) {
    return -n;
  }
  f(0)
}

fn get_dy<T>(r: T, n: T, f: Converter<T>) -> T
where
  T: Neg<Output = T> + PartialEq,
{
  if r == f(SOUTH) {
    return -n;
  } else if r == f(NORTH) {
    return n;
  }
  f(0)
}

fn part1(input: &Input) {
  let mut x = 0;
  let mut y = 0;
  let mut r = EAST;
  for (inst, arg) in input {
    let arg = *arg;
    match *inst {
      Instruction::DIR => {
        let m = (arg & DIR_MASK_B) >> DIR_SHFT;
        let t = arg & DIR_MASK_A;
        x += get_dx(t, m, |f| f);
        y += get_dy(t, m, |f| f);
      }
      Instruction::MOVE => {
        x += get_dx(r, arg, |f| f);
        y += get_dy(r, arg, |f| f);
      }
      Instruction::ROTATE => {
        r += arg;
      }
    }
    if r < 0 {
      r += 360;
    }
    r %= 360;
  }
  println!("Part1: X: {}, Y: {}, Dist: {}", x, y, x.abs() + y.abs());
}

fn part2(input: &Input) {
  let mut sx = 0.0;
  let mut sy = 0.0;
  let mut x = 10.0;
  let mut y = 1.0;
  let mut r = EAST;
  for (inst, arg) in input {
    let arg = *arg;
    match *inst {
      Instruction::DIR => {
        let m = f64::from((arg & DIR_MASK_B) >> DIR_SHFT);
        let t = f64::from(arg & DIR_MASK_A);
        x += get_dx(t, m, f64::from);
        y += get_dy(t, m, f64::from);
      }
      Instruction::MOVE => {
        sx += f64::from(arg) * x;
        sy += f64::from(arg) * y;
      }
      Instruction::ROTATE => {
        let a = f64::from(arg).to_radians();
        let s = a.sin();
        let c = a.cos();
        let tx = x;
        x = (x * c + y * s).round();
        y = (-tx * s + y * c).round();
        r += arg;
      }
    }
    if r < 0 {
      r += 360;
    }
    r %= 360;
  }
  println!("Part2: X: {}, Y: {}, Dist: {}", sx, sy, sx.abs() + sy.abs());
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
