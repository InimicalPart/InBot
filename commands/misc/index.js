function calculate() {
  return require("./calculate/calculate.js");
}
function embed() {
  return require("./embed/embed.js");
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

module.exports = {
  todo,
  v13,
  run,
  convert,
  dbinfo,
  rayblackjack,
  flipacoin,
  stats,
  calculate,
  embed,
  help,
  random,
  test,
};
console.log("[I] Category MISC loaded");
