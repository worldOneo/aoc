import { readFileSync } from "fs";
const input = readFileSync("./04.txt").toString();
const lines = input.split(/[\r\n]+/g);

const drawn = lines[0].split(",").map(n => parseInt(n));

const boardLines = lines.splice(1);
const boardHeight = 5;

class Board {
  private boardIdxs: { [key: number]: number | undefined };
  private rowDrawn: Array<number>;
  private colDrawn: Array<number>;
  constructor(board: Array<number>) {
    this.boardIdxs = {};
    board.forEach((f, i) => this.boardIdxs[f] = i);
    this.rowDrawn = new Array(boardHeight).fill(boardHeight);
    this.colDrawn = new Array(boardHeight).fill(boardHeight);
  }

  public draw(n: number): number {
    const idx = this.boardIdxs[n];
    if (typeof idx === "undefined")
      return -1;
    delete this.boardIdxs[n];
    let col = idx % boardHeight;
    let row = (idx / boardHeight) | 0;
    this.colDrawn[col]--;
    this.rowDrawn[row]--;
    if (this.colDrawn[col] == 0 || this.rowDrawn[row] == 0) {
      let sum = Object.keys(this.boardIdxs)
        .map(n => parseInt(n))
        .reduce((p, r) => p + r, 0);
      return sum;
    }
    return -1;
  }
}

let boards = new Array<Board>();


for (let i = 0; i < boardLines.length; i += boardHeight) {
  let board = new Array<number>(boardHeight * boardHeight);
  for (let boardY = 0; boardY < boardHeight; boardY++) {
    let numbers = boardLines[i + boardY].split(/\s+/gi)
      .map(n => parseInt(n))
      .filter(n => !isNaN(n));
    for (let boardX = 0; boardX < boardHeight; boardX++) {
      board[boardX + boardY * boardHeight] = numbers[boardX];
    }
  }
  boards.push(new Board(board));
}

let done = false;
let won: [Board, number, number] = [boards[0], 0, 0];
for (let n of drawn) {
  for (let b of boards) {
    let res = b.draw(n);
    if (res != -1) {
      won = [b, res, n];
      boards = boards.filter(ob => ob != b);
    }
    if (res != -1 && !done) {
      console.log("R", res, "N", n, "M", res * n, "b", b, "d", drawn);
      done = true;
    }
  }
}

console.log("Last: ", won[0], won[1], won[2], "M", won[1] * won[2]);