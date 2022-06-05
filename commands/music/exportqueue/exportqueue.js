const commandInfo = {
  primaryName: "exportqueue", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["exportqueue"], // These are all commands that will trigger this command.
  help: "Export the queue", // This is the general description of the command.
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
          .setDescription("There is no music playing."),
      ],
    });
  }
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Exporting queue...")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Exporting queue..."),
      ],
    })
    .then(async (m) => {
      let exported = [];
      for (let i = 0; i < guildQueue.songs.length; i++) {
        exported.push({
          url: guildQueue.songs[i].url,
          data: guildQueue.songs[i].data || null,
        });
      }
      exported.push({
        loop: guildQueue.repeatMode,
      });
      let attachment = new RM.Discord.MessageAttachment(
        Buffer.from(JSON.stringify(exported, null, 2), "utf-8"),
        "queue.json"
      );
      return m.edit({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("Queue exported"),
        ],
        files: [attachment],
      });
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
