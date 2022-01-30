let moment = require("moment");
let chalk = require("chalk");
function motivation() {
  return require("./motivation/motivation.js");
}
function roast() {
  return require("./roast/roast.js");
}
function chess() {
  return require("./chess/chess.js");
}

function sudoku() {
  return require("./sudoku/sudoku.js");
}

function minesweeper() {
  return require("./minesweeper/minesweeper.js");
}

function bombparty() {
  return require("./bombparty/bombparty.js");
}

module.exports = {
  bombparty,
  minesweeper,
  sudoku,
  chess,
  motivation,
  roast,
};
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MODULE] ") +
    "[I] Category FUN loaded"
);
