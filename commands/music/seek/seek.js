const commandInfo = {
  primaryName: "seek", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["seek"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
  reqPermissions: [],
  slashCommand: null,
  /*
  new global.SlashCommandBuilder()
    .setName("echo")
    .setDescription("Replies with your input!")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input to echo back")
        .setRequired(true)
    ),
  */
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (
    require("json5")
      .parse(
        require("fs").readFileSync(
          RM.path.resolve(global.dirName, "config.jsonc"),
          "utf-8"
        )
      )
      .disabledCommands.includes(commandInfo.primaryName.toLowerCase())
  ) {
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
  if (!args[0]) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Please provide a time to seek to. Example: (2m15s)")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Command Usage"),
      ],
    });
  }
  let time = getTimeInMS(args[0]);
  if (time === null) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "Please provide a valid time to seek to. Example: (2m15s)"
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Command Usage"),
      ],
    });
  }
  let guildQueue = RM.client.player.getQueue(message.guild.id);
  if (!guildQueue) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("There is no music playing in this server.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Music Playing"),
      ],
    });
  }
  let lengthOfSong = guildQueue.nowPlaying.duration;
  let durationMs = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  if (lengthOfSong.split(":").length == 3) {
    hours = lengthOfSong.split(":")[0];
    minutes = lengthOfSong.split(":")[1];
    seconds = lengthOfSong.split(":")[2];
  } else {
    minutes = lengthOfSong.split(":")[0];
    seconds = lengthOfSong.split(":")[1];
  }
  durationMs +=
    (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) *
    1000;

  if (time > durationMs) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "You cannot seek to a time greater than the length of the song."
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Command Usage"),
      ],
    });
  }
  try {
    guildQueue.seek(time);
  } catch (e) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("There is no music playing in this server.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Music Playing"),
      ],
    });
  }
  return message.channel.send({
    embeds: [
      new RM.Discord.MessageEmbed().setColor("GREEN").setAuthor({
        name: "| Seeking...",
        iconURL: message.author.avatarURL(),
      }),
    ],
  });
  function niceify(time) {
    let time2 = time
      .replace(/([0-9]+)/g, " $1 ")
      .trim()
      .split(" ");
    //join [0] with [1], [2] with [3] etc
    let time3 = [];
    for (let i = 0; i < time2.length; i += 2) {
      time3.push(time2[i] + time2[i + 1].toLowerCase());
    }
    return time3.join(" ");
  }
  function getTimeInMS(timeStr) {
    try {
      let CU = require("convert-units");
      let valid = ["ns", "mu", "ms", "s", "m", "h", "d", "w", "mth", "y"];
      if (
        ["list", "delete", "edit", "info"].includes(timeStr.toLowerCase()) ||
        typeof timeStr !== "string" ||
        !timeStr.match(/([a-zA-Z])/g)
      ) {
        //   console.log("i dont like this, returning");
        return null;
      }
      // console.log("check passed in gTIMS", timeStr);
      let time2 = timeStr
        .replace(/([0-9]+)/g, " $1 ")
        .trim()
        .split(" ");
      let time = 0;
      for (let i = 0; i < time2.length; i += 2) {
        if (valid.includes(time2[i + 1].toLowerCase())) {
          time += CU(time2[i])
            .from(convertToCU(time2[i + 1].toLowerCase()))
            .to("ms");
        } else {
          return null;
        }
      }
      return time;
      function convertToCU(time) {
        switch (time) {
          case "m":
            return "min";
          case "w":
            return "week";
          case "mth":
            return "month";
          case "y":
            return "year";
          default:
            return time;
        }
      }
    } catch (e) {
      return null;
    }
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
function getSlashCommand() {
  return commandInfo.slashCommand;
}
function commandPermissions() {
  return commandInfo.reqPermissions || null;
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
  commandPermissions,
  getSlashCommandJSON,
};
