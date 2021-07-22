const { json } = require("mathjs");

const commandInfo = {
  primaryName: "remove", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["remove", "delete"], // These are all commands that will trigger this command.
  help: "Allows you to remove a song from a queue", // This is the general description pf the command.
  aliases: ["delete"], // These are command aliases that help.js will use
  usage: "[COMMAND] <number>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
};

async function runCommand(message, args, RM) {
  const queue2 = global.queue2;
  const queue3 = global.queue3;
  const queue = global.queue;
  const games = global.games;

  let ops = {
    queue2: queue2,
    queue: queue,
    queue3: queue3,
    games: games,
  };
  const serverQueue = ops.queue.get(message.guild.id);

  const Discord = RM.Discord;

  const { channel } = message.member.voice;
  if (!channel)
    return message.channel.send(
      "You need to be in a voice channel to remove something from the queue!"
    );
  if (message.guild.me.voice.channel !== message.member.voice.channel) {
    return message.channel.send(
      "You need to be in the same voice channel as me!"
    );
  }
  if (!serverQueue || serverQueue.length < 1) {
    return message.channel.send(":x: | The queue is empty!");
  } else {
    let index = 0;
    serverQueue.songs.forEach(async function (a, b) {
      const thing = JSON.parse(JSON.stringify(a));
      message.channel.send(thing.title + ", " + b);
    });
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
  commandCategory,
}; /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */

/* */
/* */
/* */
/*
------------------[Instruction]------------------

1. Make a directory in commands/ with your command name
2. Inside that directory, make a "<command name>.js" file
3. Copy the contents of TEMPLATE.js and paste it in the <command name>.js file and modify it to your needs.
4. In index.js add to the top:
"const cmd<cmdNameHere> = require('./commands/<command name>/<command name>.js');" at the top.

-------------------------------------------------

To get all possible triggers, from index.js call
"cmd<cmdname>.commandTriggers()"

To call the command, from index.js call
"cmd<cmdname>.runCommand(message, arguments, requiredModules);"

To check if possible triggers has the command call
"cmd<cmdname>.commandTriggers().includes(command)"

------------------[Instruction]------------------
*/
/* */
/* */
