function onAIMsg() {
  return require("./onAIMsg/index.js");
}
function timer() {
  return require("./timer/index.js");
}
function wordle() {
  return require("./wordle/index.js");
}
function getBanned() {
  return require("./getBanned/index.js");
}
module.exports = {
  getBanned,
  wordle,
  onAIMsg,
  timer,
};
