let moment = require("moment");
let chalk = require("chalk");
function lyrics() {
  return require("./lyrics/lyrics.js");
}

module.exports = {
  lyrics,
};
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MODULE] ") +
    "[I] Category MUSIC loaded"
);
