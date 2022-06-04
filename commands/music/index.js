let moment = require("moment");
let chalk = require("chalk");
function lyrics() {
  return require("./lyrics/lyrics.js");
}

function play() {
  return require("./play/play.js");
}

function nowplaying() {
  return require("./nowplaying/nowplaying.js");
}

function queue() {
  return require("./queue/queue.js");
}

function skip() {
  return require("./skip/skip.js");
}

function resume() {
  return require("./resume/resume.js");
}

function pause() {
  return require("./pause/pause.js");
}

function stop() {
  return require("./stop/stop.js");
}

function seek() {
  return require("./seek/seek.js");
}

function shuffle() {
  return require("./shuffle/shuffle.js");
}

function remove() {
  return require("./remove/remove.js");
}

function clear() {
  return require("./clear/clear.js");
}

function loop() {
  return require("./loop/loop.js");
}

function swap() {
  return require("./swap/swap.js");
}

function exportqueue() {
	return require("./exportqueue/exportqueue.js")
}

function importqueue() {
	return require("./importqueue/importqueue.js")
}

function volume() {
	return require("./volume/volume.js")
}

module.exports = {
	volume,
	importqueue,
	exportqueue,
  swap,
  loop,
  clear,
  remove,
  shuffle,
  seek,
  stop,
  pause,
  resume,
  skip,
  queue,
  nowplaying,
  play,
  lyrics,
};
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MODULE] ") +
    "[I] Category MUSIC loaded"
);
