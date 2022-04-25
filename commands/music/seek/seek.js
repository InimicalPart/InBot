const commandInfo = {
  primaryName: "seek", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["seek"], // These are all commands that will trigger this command.
  help: "Changes position in the song", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <xx:xx/ms>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  if (!require("../../../config.js").cmdSeek) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Command disabled by Administrators.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Command Disabled"),
      ],
    });
  }

  const queue2 = global.sQueue2;
  const queue3 = global.sQueue3;
  const queue = global.sQueue;
  const games = global.games;

  let ops = {
    queue2: queue2,
    queue: queue,
    queue3: queue3,
    games: games,
  };
  const serverQueue = ops.queue.get(message.guild.id);

  if (!args[0])
    return message.channel.send({ content: "Please provide a number!" });
  if (args[0].includes(":")) {
    const queuee = serverQueue.songs[0];
    const ms = hmsToSecondsOnly(args[0]);
    if (ms > queuee.time)
      return message.channel.send({
        content: "You seek argument is longer than the song!",
      });
    global.seekMS = ms * 1000;
    serverQueue.connection.play(
      require("ytdl-core")(queuee.url, {
        highWaterMark: 1 << 20,
        quality: "highestaudio",
      }),
      { seek: ms }
    );
    const hms = msToTime(Number(ms));
    message.channel.send({ content: "Song seeked to: `" + hms + "`" });
  } else {
    const queuee = serverQueue.songs[0];
    const ms = args[0];
    if (ms > queuee.time)
      return message.channel.send({
        content: "You seek argument is longer than the song!",
      });
    global.seekMS = ms;
    serverQueue.connection.play(
      require("ytdl-core")(queuee.url, {
        highWaterMark: 1 << 20,
        quality: "highestaudio",
      }),
      { seek: ms }
    );
    const hms = msToTime(Number(ms));
    message.channel.send({ content: "Song seeked to: `" + hms + "`" });
  }
  //
}
function hmsToSecondsOnly(str) {
  var p = str.split(":"),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  return s;
}
function msToTime(s) {
  s = s * 1000;
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ("00" + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
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
function getSlashCommand() {
  return commandInfo.slashCommand;
}
function getSlashCommandJSON() {
  if (commandInfo.slashCommand.length !== null)
    return commandInfo.slashCommand.toJSON();
  else return null;
}
module.exports = {
  runCommand,
  commandTriggers,
  commandHelp,
  commandAliases,
  commandPrim,
  commandUsage,
  commandCategory,
  getSlashCommand,
  getSlashCommandJSON,
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
