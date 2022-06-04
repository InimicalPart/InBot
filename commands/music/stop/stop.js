const commandInfo = {
  primaryName: "stop", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["stop"], // These are all commands that will trigger this command.
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

async function runCommand(message, args, RM, data) {
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
    if (data)
      return message.reply({
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
        ephemeral: true,
      });
    else
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
  if (data)
    message.reply({ content: "." }).then((m) => {
      message.deleteReply();
    });
  if (!guildQueue) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("No music is playing in this server.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Music"),
      ],
    });
  }
  try {
    guildQueue.stop();
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
        name: "| Cleared the queue and left the voice channel.",
        iconURL: message.author.avatarURL(),
      }),
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
