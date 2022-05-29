const commandInfo = {
  primaryName: "flipacoin", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["flipacoin", "flip", "fc"], // These are all commands that will trigger this command.
  help: "Flip a coin!", // This is the general description of the command.
  aliases: ["flip", "fc"], // These are command aliases that help.js will use
  usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdFlipacoin) {
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

  const Discord = RM.Discord;
  //make a coinflip command and send an embed with the result
  let result = Math.floor(Math.random() * 2);
  let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.avatarURL(),
    })
    .setDescription(
      `You flipped a coin and got ${result === 0 ? "heads" : "tails"}!`
    )
    .setThumbnail(message.guild.iconURL())
    .setTitle("Coinflip");
  message.channel.send({
    embeds: [embed],
    reply: { messageReference: message.id },
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
};
