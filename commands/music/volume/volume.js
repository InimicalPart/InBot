const commandInfo = {
  primaryName: "volume", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["volume", "vol"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["vol"], // These are command aliases that help.js will use
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
          .setDescription("There is no music playing."),
      ],
    });
  }

  if (!args[0]) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "The volume is set to: **" + guildQueue.options.volume + "%**"
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Volume"),
      ],
    });
  }
  let newVolume = 0;
  if (args[0] === "reset") newVolume = 100;
  else if (args[0] === "up")
    newVolume =
      guildQueue.options.volume + RM.config.settings.music.volumeStep || 25;
  else if (args[0] === "down")
    newVolume =
      guildQueue.options.volume - RM.config.settings.music.volumeStep || 25;
  else newVolume = parseInt(args[0]);
  if (newVolume < 1)
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Volume must be at least 1%.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Volume Error"),
      ],
    });

  if (isNaN(newVolume)) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Invalid volume.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid Volume"),
      ],
    });
  }
  if (
    RM.config.settings.music.maxVolume &&
    newVolume > RM.config.settings.music.maxVolume
  )
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "Volume must be less than **" +
              RM.config.settings.music.maxVolume +
              "%**."
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Volume Error"),
      ],
    });

  try {
    guildQueue.setVolume(newVolume);
  } catch (e) {
    console.log(e);
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Error setting volume.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Volume Error"),
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
        .setDescription("Volume set to: **" + newVolume + "%**")
        .setThumbnail(message.guild.iconURL())
        .setTitle("Volume"),
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
