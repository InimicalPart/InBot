const commandInfo = {
  primaryName: "monthly", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["monthly"], // These are all commands that will trigger this command.
  help: "Claim your monthly gift!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require(RM.path.resolve(global.dirName, "config.js")).cmdMonthly) {
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

  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:980471497057501205> *Working on it...*"
        ),
      ],
    })
    .then(async (m) => {
      const { connect } = require("../../../databasec");
      await connect();
      await connect.create("currency");
      await connect.create("cooldown");

      if ((await connect.fetch("currency", message.author.id)) == null) {
        await connect.add("currency", message.author.id);
      }

      if ((await connect.fetch("cooldown", message.author.id)) == null) {
        await connect.add("cooldown", message.author.id);
      }
      let data = await connect.fetch("cooldown", message.author.id);
      const monthlyCool = data.monthlycool;
      if (monthlyCool !== null) {
        const cooldown = new Date(monthlyCool * 1000);
        const now = new Date();
        var DITC = cooldown.getTime() - now.getTime();
        const timeLeft = RM.pretty_ms;
        if (DITC.toString().includes("-")) {
        } else {
          m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription(
                  "**Error:** You are on cooldown! Time left:\n`" +
                    timeLeft(DITC) +
                    "`"
                )
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
          return await connect.end(true);
        }
      }
      await connect.updateCooldown(
        "cooldown",
        message.author.id,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        new Date(
          new Date().setTime(new Date().getTime() + 720 * 60 * 60 * 1000)
        )
      );
      let data2 = await connect.fetch("currency", message.author.id);
      const authorBal = data2.amountw;
      await connect.update("currency", message.author.id, authorBal + 100000);
      m.edit({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("**Success:** You have been given $100,000!")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Success"),
        ],
      });
      await connect.end(true);
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
