const commandInfo = {
  primaryName: "remove", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["remove"], // These are all commands that will trigger this command.
  help: "Remove a song from the queue!", // This is the general description of the command.
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
          .setDescription("There is no music playing.")
          .setTitle("No Music Playing"),
      ],
    });
  }

  if (
    !args[0] ||
    isNaN(parseInt(args[0])) ||
    args[0] > guildQueue.length ||
    args[0] < 1
  ) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed().setColor("RED").setAuthor({
          name: "|  Provide a queue number of the track you would like to remove.",
          iconURL: message.author.avatarURL(),
        }),
      ],
    });
  }

  let songToRemove = guildQueue.songs[parseInt(args[0])];
  if (!songToRemove) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed().setColor("RED").setAuthor({
          name: "|  Provide a queue number of the track you would like to remove.",
          iconURL: message.author.avatarURL(),
        }),
      ],
    });
  }
  try {
    guildQueue.remove(parseInt(args[0]));
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
      new RM.Discord.MessageEmbed()
        .setColor("YELLOW")
        .setAuthor({
          name: "| Track Removed",
          iconURL: message.author.avatarURL(),
        })
        .setDescription(`Removed 1 track from the queue.`)
        .setTitle("Removed Song"),
    ],
  });
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
