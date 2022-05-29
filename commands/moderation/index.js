let moment = require("moment");
let chalk = require("chalk");
function ban() {
  return require("./ban/ban.js");
}
function unban() {
  return require("./unban/unban.js");
}

function botban() {
  return require("./botban/botban.js");
}

module.exports = {
  botban,
  ban,
  unban,
};
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MODULE] ") +
    "[I] Category MODERATION loaded"
);
