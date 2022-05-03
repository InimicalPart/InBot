const commandInfo = {
  type: "onMessage",
};

async function runEvent(RM, event) {
  //Event checks
  if (event.guild === null) {
    //If not in a guild, return
    return;
  }
  if (event.author.bot) {
    //If the author is a bot, return
    return;
  }
}
function eventType() {
  return commandInfo.type;
}
module.exports = {
  runEvent,
  eventType,
};
