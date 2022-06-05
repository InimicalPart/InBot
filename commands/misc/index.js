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
function ping() {
  return require("./ping/ping.js");
}
function stats() {
  return require("./stats/stats.js");
}

function flipacoin() {
  return require("./flipacoin/flipacoin.js");
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

function timer() {
  return require("./timer/timer.js");
}

function urban() {
  return require("./urban/urban.js");
}

function dictionary() {
  return require("./dictionary/dictionary.js");
}

function reload() {
	return require("./reload/reload.js")
}

module.exports = {
	reload,
  dictionary,
  urban,
  timer,
  run,
  convert,
  dbinfo,
  flipacoin,
  stats,
  calculate,
  info,
  help,
  ping,
};
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MODULE] ") +
    "[I] Category MISC loaded"
);
