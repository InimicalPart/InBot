const commandInfo = {
  primaryName: "ping",
  possibleTriggers: ["ping"],
  help: "Checks the latency of the bot and the Discord API and the bot uptime.",
  aliases: [],
  usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
  slashCommand: new global.SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "Checks the latency of the bot and the Discord API and the bot uptime."
    ),
};
async function runCommand(message, args, RM) {
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

  //assign Discord from RM
  const Discord = RM.Discord;
  let a;
  const client = RM.client;
  const prettyMilliseconds = RM.pretty_ms;
  const pinging = new RM.Discord.MessageEmbed().setDescription(
    "Pinging...  :ping_pong:"
  );
  message.channel
    .send({ embeds: [pinging] })
    .then((m) => {
      console.log(m);
      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(
          `<:lipbite:980261548427706410> | Latency is \`${
            m.createdTimestamp - message.createdTimestamp
          }ms\` and API Latency is \`${Math.round(
            client.ws.ping
          )}ms\`, Bot has been up for: \`${prettyMilliseconds(client.uptime)}\``
        );
      m.delete();

      message.reply({ embeds: [embed] });
    })
    .catch(async (err) => {
      console.log(err);
      message.channel.send({ content: "Error: " + err });
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
