const commandInfo = {
  primaryName: "deposit", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["deposit", "dep"], // These are all commands that will trigger this command.
  help: "Desposit your money to the bank!", // This is the general description of the command.
  aliases: ["dep"], // These are command aliases that help.js will use
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
              .setDescription("Please enter an amount to deposit!")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }

      if ((await connect.fetch("currency", message.author.id)) === null) {
        await connect.add("currency", message.author.id, 0, 0);
      }
      const balance = await connect.fetch("currency", message.author.id);
      const bank = balance.amountb;
      const wallet = balance.amountw;
      const maxbank = balance.maxbank;
      let amount;
      if (args[0] === "all") {
        amount = parseInt(wallet); // ph wait maybe this was the problem? idk mk lets see lemme add the old code back
      } else {
        amount = parseInt(args[0]);
      }

      //if args 0 is not a number tell them its not a fuckign number
      if (isNaN(parseInt(amount))) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription("we both know thats not a number")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }

      if (amount > balance.amountw) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription("You don't have enough money!")
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
              .setDescription("You can't deposit negative money!")
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
              .setDescription("You can't deposit nothing!")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      if (amount > maxbank && bank !== maxbank) {
        const newAmount = maxbank - bank;
        await connect.update(
          "currency",
          message.author.id,
          wallet - newAmount,
          bank + newAmount
        );
        const newBal = await connect.fetch("currency", message.author.id);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "Deposited **`$" +
                  numberWithCommas(newAmount) +
                  `\`** to the bank! Your balance is now:\n\nWallet: **\`$${numberWithCommas(
                    newBal.amountw
                  )}\`**\nBank: **\`$${numberWithCommas(newBal.amountb)}\`**`
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Deposited"),
          ],
        });
        return await connect.end(true);
      }

      if (bank + amount > maxbank) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription("You don't have enough bank space!")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }

      if (bank === maxbank) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription("Your bank is full")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle(":/"),
          ],
        });
      }
      if (maxbank < amount) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setDescription("You don't have enough space in your bank!")
              .setColor("RED")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }

      await connect.update(
        "currency",
        message.author.id,
        wallet - amount,
        bank + amount
      );
      const newBal = await connect.fetch("currency", message.author.id);
      m.edit({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setDescription(
              "Deposited **`$" +
                numberWithCommas(amount) +
                `\`** to the bank! Your balance is now:\n\nWallet: **\`$${numberWithCommas(
                  newBal.amountw
                )}\`**\nBank: **\`$${numberWithCommas(newBal.amountb)}\`**`
            )
            .setColor("GREEN")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Success"),
        ],
      });

      return await connect.end(true);
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
