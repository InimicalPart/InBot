const commandInfo = {
  primaryName: "motivate",
  possibleTriggers: ["motivation", "motivate"],
  help: "Sends an inspirational quote.",
  aliases: ["motivation"],
  usage: "[COMMAND] [user]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
  slashCommand: null,
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

  const Discord = RM.Discord;
  const jsonQuotes = require("../../../assets/motivational.json");

  let member;
  try {
    member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0])) ||
      (await message.guild.members.fetch(
        (r) =>
          r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
      )) ||
      (await message.guild.members.fetch(
        (r) =>
          r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
      )) ||
      (await message.guild.members.fetch(args[0])) ||
      message.member;
  } catch (e) {
    member = message.member;
  }

  const randomQuote =
    jsonQuotes.quotes[Math.floor(Math.random() * jsonQuotes.quotes.length)];
  if (!args[0]) {
    const quoteEmbed = new Discord.MessageEmbed()
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
      .setTitle(randomQuote.author || "N/A")
      .setDescription(randomQuote.text)
      .setColor("GREEN")
      .setFooter({
        text: member.displayName,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTimestamp();
    return message.channel.send({ embeds: [quoteEmbed] });
  } else if (args[0]) {
    const embed = new Discord.MessageEmbed()
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
      .setColor("GREEN")
      .setTitle(`${randomQuote.author || "N/A"} -`)
      .setDescription(
        `**${randomQuote.text}** \n\nBy ${message.member.displayName} to ${member.displayName}`
      )
      .setFooter({
        text: member.displayName,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
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
