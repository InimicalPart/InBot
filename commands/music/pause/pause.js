const commandInfo = {
  "primaryName": "pause",
  "possibleTriggers": ["pause"],
  "help": "Allows you to pause or resume (not really working) the music.",
  "aliases": [],
  "usage": "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
  "category": "music"
}

async function runCommand(message, args, RM) {
  const queue2 = global.queue2;
  const queue3 = global.queue3;
  const queue = global.queue;
  const games = global.games

  let ops = {
    queue2: queue2,
    queue: queue,
    queue3: queue3,
    games: games
  }

  const serverQueue = ops.queue.get(message.guild.id);
  const { channel } = message.member.voice;

  try {

    if (!channel) return message.channel.send('You need to be in a voice channel.');
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send("You need to be in the same voice channel as me!");
    };
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true);
      return message.channel.send('Paused ⏸');
    } else if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return message.channel.send("Resumed ▶")
    }
    return message.channel.send(':x: | There is Nothing Playing!');
  } catch {
    serverQueue.connection.dispatcher.end();
    await channel.leave();
  }

}



function commandTriggers() {
  return commandInfo.possibleTriggers;
}
function commandPrim() {
  return commandInfo.primaryName;
}
function commandAliases() {
  return commandInfo.aliases;
}
function commandHelp() {
  return commandInfo.help;
}
function commandUsage() {
  return commandInfo.usage;
}
function commandCategory() {
  return commandInfo.category;
}
module.exports = {
  runCommand,
  commandTriggers,
  commandHelp,
  commandAliases,
  commandPrim,
  commandUsage,
  commandCategory
}

