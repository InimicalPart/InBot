const commandInfo = {
  primaryName: "withdraw", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["withdraw", "with"], // These are all commands that will trigger this command.
  help: "Withdraw your money from the bank!", // This is the general description of the command.
  aliases: ["with"], // These are command aliases that help.js will use
  usage: "[COMMAND] <amount/all>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
  slashCommand: null,
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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
  const { connect } = require("../../../databasec");
  await connect();
  await connect.create("currency");
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:980471497057501205> *Working on it...*"
        ),
      ],
    })
    .then(async (m) => {
      if (!args[0]) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription("Please enter an amount to withdraw!")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      if ((await connect.fetch("currency", message.author.id)) === null) {
        await connect.add("currency", message.author.id, 0, 0, 1000, 0);
      }
      const balance = await connect.fetch("currency", message.author.id);
      let amount;
      if (args[0] === "all") {
        amount = parseInt(balance.amountb);
      } else {
        amount = parseInt(args[0]);
      }
      if (amount > balance.amountb) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription(
                `You don't have $${numberWithCommas(amount)} in the bank!`
              )
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      if (amount < 0) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription("You can't withdraw a negative amount!")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      if (amount === 0) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription("You can't withdraw anything!")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      await connect.update(
        "currency",
        message.author.id,
        parseInt(balance.amountw) + parseInt(amount),
        parseInt(balance.amountb) - parseInt(amount)
      );
      const newBal = await connect.fetch("currency", message.author.id);
      m.edit({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setDescription(
              `Withdrew **\`$` +
                numberWithCommas(amount) +
                `\`** from the bank! Your balance is now:\n\nWallet: **\`$${numberWithCommas(
                  newBal.amountw
                )}\`**\nBank: **\`$${numberWithCommas(newBal.amountb)}\`**`
            )
            .setColor("GREEN")
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
