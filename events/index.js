function onAIMsg() {
  return require("./onAIMsg/index.js");
}
function timer() {
  return require("./timer/index.js");
}
function wordle() {
  return require("./wordle/index.js");
}
module.exports = {
  wordle,
  onAIMsg,
  timer,
};
