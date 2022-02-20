function onAIMsg() {
  return require("./onAIMsg/index.js");
}
function timer() {
  return require("./timer/index.js");
}
module.exports = {
  onAIMsg,
  timer,
};
