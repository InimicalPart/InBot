let moment = require("moment");
let chalk = require("chalk");
function calculate() {
  return require("./calculate/calculate.js");
}
function info() {
  return require("./info/info.js");
}
function help() {
  return require("./help/help.js");
}
function random() {
  return require("./random/random.js");
}
function test() {
  return require("./test/test.js");
}
function stats() {
  return require("./stats/stats.js");
}

function flipacoin() {
  return require("./flipacoin/flipacoin.js");
}

function rayblackjack() {
  return require("./rayblackjack/rayblackjack.js");
}

function dbinfo() {
  return require("./dbinfo/dbinfo.js");
}

function convert() {
  return require("./convert/convert.js");
}

function run() {
  return require("./run/run.js");
}

function v13() {
  return require("./v13/v13.js");
}

function todo() {
  return require("./todo/todo.js");
}

function timer() {
  return require("./timer/timer.js");
}

function codeify() {
  return require("./codeify/codeify.js");
}

function urban() {
  return require("./urban/urban.js");
}

function dictionary() {
  return require("./dictionary/dictionary.js");
}

module.exports = {
  dictionary,
  urban,
  codeify,
  timer,
  todo,
  v13,
  run,
  convert,
  dbinfo,
  rayblackjack,
  flipacoin,
  stats,
  calculate,
  info,
  help,
  random,
  test,
};
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MODULE] ") +
    "[I] Category MISC loaded"
);
