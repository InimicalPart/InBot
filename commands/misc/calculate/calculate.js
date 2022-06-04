const commandInfo = {
  primaryName: "calculate",
  possibleTriggers: ["calc", "math", "calculate"],
  help: "Calculate a math equation that you input.",
  aliases: ["math", "calc"],
  usage: "[COMMAND] <math equation>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
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
  const client = RM.client;
  const math = RM.math;

  if (!args[0])
    return message.channel.send({
      content: "**Please provide an equation**",
      reply: { messageReference: message.id },
    });

  let result;
  try {
    result = math.evaluate(
      args
        .join(" ")
        .replace(/[x]/gi, "*")
        .replace(/[,]/g, ".")
        .replace(/[÷]/gi, "/")
    );
  } catch (e) {
    return message.channel.send({
      content:
        "**Invalid Calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**",
      reply: { messageReference: message.id },
    });
  }

  let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor({
      name: `${client.user.username} Calculator`,
      iconURL: message.author.displayAvatarURL({
        dynamic: true,
      }),
    })
    .addField(
      "**Operation**",
      `\`\`\`Js\n${args
        .join("")
        .replace(/[x]/gi, "*")
        .replace(/[,]/g, ".")
        .replace(/[÷]/gi, "/")}\`\`\``
    )
    .addField("**Result**", `\`\`\`Js\n${result}\`\`\``)
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });
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
