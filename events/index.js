function getActiveTimers() {
  return require("./getActiveTimers/index.js");
}
function getCurrentWordle() {
  return require("./getCurrentWordle/index.js");
}
function getBotBanned() {
  return require("./getBotBanned/index.js");
}
function logListeners() {
  return require("./logListeners/index.js");
}
function setupDashboard() {
  return require("./setupDashboard/index.js");
}

module.exports = {
  setupDashboard,
  logListeners,
  getBotBanned,
  getCurrentWordle,
  getActiveTimers,
};
