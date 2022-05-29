const commandInfo = {
  primaryName: "inventory", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["inventory", "inv"], // These are all commands that will trigger this command.
  help: "Check your inventory!", // This is the general description of the command.
  aliases: ["inv"], // These are command aliases that help.js will use
  usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require(RM.path.resolve(global.dirName, "config.js")).cmdInventory) {
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
  const { connect } = require("../../../databasec");
  await connect();
  await connect.create("inventory");
  if ((await connect.fetch("inventory", message.author.id)) === null) {
    await connect.add("inventory", message.author.id);
  }
  const inventory = await connect.fetch("inventory", message.author.id);
  connect.end(true);
  const embed = new RM.Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.avatarURL(),
    })
    .setDescription("Inventory:\n" + JSON.stringify(inventory.items))
    .setThumbnail(message.guild.iconURL())
    .setTitle("Inventory");
  return message.channel.send({ embeds: [embed] });
  // cmd stuff here
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
