function getActiveTimers() {
  return require("./getActiveTimers/index.js");
}
function getCurrentWordle() {
  return require("./getCurrentWordle/index.js");
}
function getBotBanned() {
  return require("./getBotBanned/index.js");
}
module.exports = {
  getBotBanned,
  getCurrentWordle,
  getActiveTimers,
};
