const commandInfo = {
  primaryName: "loop", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["loop"], // These are all commands that will trigger this command.
  help: "Change the loop mode", // This is the general description of the command.
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
  let RepeatMode = {
    DISABLED: 0,
    SONG: 1,
    QUEUE: 2,
    0: "Disabled",
    1: "Song",
    2: "Queue",
    "0_icon": "",
    "1_icon": "🔂",
    "2_icon": "🔁",
  };
  if (!guildQueue) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("There is no music playing."),
      ],
    });
  }
  if (!args[0]) {
    try {
      if (guildQueue.repeatMode === RepeatMode.DISABLED) {
        guildQueue.repeatMode = RepeatMode.SONG;
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("🔂 Repeat mode set to: SONG")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Repeat Mode Set"),
          ],
        });
      } else if (guildQueue.repeatMode === RepeatMode.SONG) {
        guildQueue.repeatMode = RepeatMode.QUEUE;
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("🔁 Repeat mode set to: QUEUE")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Repeat Mode Set"),
          ],
        });
      } else if (guildQueue.repeatMode === RepeatMode.QUEUE) {
        guildQueue.repeatMode = RepeatMode.DISABLED;
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Repeat mode set to: DISABLED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Repeat Mode Set"),
          ],
        });
      }
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
  } else if (
    args[0] === "off" ||
    args[0] === "disabled" ||
    parseInt(args[0]) === 0
  ) {
    try {
      guildQueue.repeatMode = RepeatMode.DISABLED;
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
  } else if (args[0] === "song" || parseInt(args[0]) === 1) {
    try {
      guildQueue.repeatMode = RepeatMode.SONG;
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
  } else if (args[0] === "queue" || parseInt(args[0]) === 2) {
    try {
      guildQueue.repeatMode = RepeatMode.QUEUE;
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
  } else {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Invalid argument.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid Argument"),
      ],
    });
  }
  return message.channel.send({
    embeds: [
      new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setDescription(
          (guildQueue.repeatMode !== 0
            ? RepeatMode[guildQueue.repeatMode + "_icon"] + " "
            : "") +
            "Repeat mode set to: " +
            RepeatMode[guildQueue.repeatMode]
        )
        .setThumbnail(message.guild.iconURL())
        .setTitle("Repeat Mode Set"),
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
