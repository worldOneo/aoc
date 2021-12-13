#[derive(Debug, PartialEq)]
enum Command {
  JMP,
  ACC,
  NOP,
}

type Instruction = (Command, i32);
type Input = Vec<Instruction>;

fn read_input() -> Input {
  std::fs::read_to_string("./08/08.txt")
    .unwrap()
    .lines()
    .map(|line| line.split(" ").collect::<Vec<&str>>())
    .map(|parts| {
      (
        if parts[0] == "jmp" {
          Command::JMP
        } else if parts[0] == "acc" {
          Command::ACC
        } else {
          Command::NOP
        },
        parts[1].to_string().parse::<i32>().unwrap(),
      )
    })
    .collect()
}

fn part1(input: &Input) {
  let mut visits: Vec<bool> = Vec::new();
  visits.resize(input.len(), false);
  let mut acc = 0;
  let mut stack_ptr: i32 = 0;
  loop {
    if visits[stack_ptr as usize] {
      break;
    }
    visits[stack_ptr as usize] = true;
    let (cmd, arg) = &input[stack_ptr as usize];

    match cmd {
      &Command::ACC => {
        stack_ptr += 1;
        acc += arg;
      }
      &Command::JMP => {
        stack_ptr += *arg;
      }
      &Command::NOP => {
        stack_ptr += 1;
      }
    }
  }
  println!("Acc: {}", acc);
}

fn flip_nth_inst(n: i32, input: &Input) -> Input {
  let mut a: Input = Vec::new();
  let mut cnt = 0;
  input.iter().for_each(|(cmd, arg)| {
    if *cmd == Command::JMP || *cmd == Command::NOP {
      if cnt == n {
        a.push((
          if *cmd == Command::JMP {
            Command::NOP
          } else {
            Command::JMP
          },
          *arg,
        ));
      } else {
        a.push((
          if *cmd == Command::JMP {
            Command::JMP
          } else {
            Command::NOP
          },
          *arg,
        ));
      }
      cnt += 1;
    } else {
      a.push((Command::ACC, *arg))
    }
  });
  a
}

fn part2(input: &Input) {
  let mut flip = 0;
  loop {
    let programm = flip_nth_inst(flip, input);
    let mut visits: Vec<bool> = Vec::new();
    visits.resize(input.len(), false);
    let mut acc = 0;
    let mut stack_ptr: i32 = 0;
    let mut terminated = false;
    loop {
      if stack_ptr as usize >= programm.len() {
        terminated = true;
        break;
      }
      if visits[stack_ptr as usize] {
        break;
      }
      visits[stack_ptr as usize] = true;
      let (cmd, arg) = &programm[stack_ptr as usize];
      match cmd {
        &Command::ACC => {
          stack_ptr += 1;
          acc += *arg;
        }
        &Command::JMP => {
          stack_ptr += *arg;
        }
        &Command::NOP => {
          stack_ptr += 1;
        }
      }
    }
    if terminated {
      println!("Acc: {}", acc);
      break;
    }
    flip += 1;
  }
}

fn main() {
  let input = read_input();
  part1(&input);
  part2(&input);
}
