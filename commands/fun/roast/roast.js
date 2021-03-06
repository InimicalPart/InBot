const commandInfo = {
  primaryName: "roast",
  possibleTriggers: ["roast", "attack", "diss"],
  help: "Roast your friends.\n⚠ +18 ⚠",
  aliases: ["attack", "diss"],
  usage: "[COMMAND] <user>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
  slashCommand: null,
};

function between(lower, upper) {
  var scale = upper - lower + 1;
  return Math.floor(lower + Math.random() * scale);
}
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
  var i;
  var count = 1;
  const cantRoastSelfMsgs = [
    "You cannot roast yourself",
    "Why are you roasting yourself?",
    "Roast someone, not yourself!",
    "Roasting yourself is not an option to decrease your insecurity. Quite the opposite in fact.",
    "These roasts are for the weak.",
    "You are not a person to be roasted.",
    "These roasts are too strong, you cannot roast yourself or you will suffer some inrepairable emotional damage.",
  ];
  if (!args[0]) {
    const a = new RM.Discord.MessageEmbed()
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
      .setColor("RANDOM")
      .setDescription(
        "**" +
          cantRoastSelfMsgs[
            Math.floor(Math.random() * cantRoastSelfMsgs.length)
          ] +
          "**"
      )
      .setTimestamp()
      .setFooter({
        text: message.author.username,
        iconURL: message.author.avatarURL(),
      });
    message;
  } else {
    const roastedUser = args.join(" ");
    if (
      roastedUser.includes(RM.client.user.id) ||
      roastedUser.toLowerCase().includes(RM.client.user.username.toLowerCase())
    )
      return message.channel.send({
        content: "I'm unroastable.",
      });
    if (
      roastedUser.includes(message.author.id) ||
      roastedUser.toLowerCase().includes(
        message.author.username
          .toLowerCase()
          .replace(/[^\u0000-\u007F]/g, "")
          .trimEnd()
      )
    ) {
      const a = new RM.Discord.MessageEmbed()
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL(),
        })
        .setColor("RANDOM")
        .setDescription(
          "**" +
            cantRoastSelfMsgs[
              Math.floor(Math.random() * cantRoastSelfMsgs.length)
            ] +
            "**"
        )
        .setTimestamp()
        .setFooter({
          text: message.author.username,
          iconURL: message.author.avatarURL(),
        });
      return message.channel.send({ embeds: [a] });
    }

    try {
      // read contents of the file
      require("fs")
        .createReadStream("./assets/roasts.txt")
        .on("data", function (chunk) {
          for (i = 0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
        })
        .on("end", async function () {
          const wantedLine = between(1, count);
          const data = require("fs").readFileSync(
            "./assets/roasts.txt",
            "UTF-8"
          );

          // split the contents by new line
          const lines = data.split(/\r?\n/);

          // print all lines
          let curLine = 0;
          lines.forEach((line) => {
            curLine++;
            if (curLine == wantedLine)
              message.channel.send({ content: roastedUser + ", " + line });
          });
        });
    } catch (err) {
      message.channel.send({ content: "Error! " + err.message });
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
