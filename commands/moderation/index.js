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

function mute() {
	return require("./mute/mute.js")
}

function unmute() {
	return require("./unmute/unmute.js")
}

function warn() {
	return require("./warn/warn.js")
}

module.exports = {
	warn,
	unmute,
	mute,
  botban,
  ban,
  unban,
};
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MODULE] ") +
    "[I] Category MODERATION loaded"
);
