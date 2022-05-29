const commandInfo = {
  primaryName: "pay", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["pay", "transfer"], // These are all commands that will trigger this command.
  help: "Give some money to a user!", // This is the general description of the command.
  aliases: ["transfer"], // These are command aliases that help.js will use
  usage: "[COMMAND] <player> <amount>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require(RM.path.resolve(global.dirName, "config.js")).cmdPay) {
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
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setDescription("You need to specify a user to pay!")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return;
      }
      let user;
      try {
        user =
          message.mentions.members.first() ||
          (await message.guild.members.fetch(args[0])) ||
          (await message.guild.members.fetch(
            (r) =>
              r.user.username.toLowerCase() ===
              args.join(" ").toLocaleLowerCase()
          )) ||
          (await message.guild.members.fetch(
            (r) =>
              r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
          )) ||
          (await message.guild.members.fetch(args[0])) ||
          null;
      } catch (e) {
        user = null;
      }
      if (user == null) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("**ERROR:** Could not find user.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      if (user.user) {
        user = user.user;
      }
      if ((await connect.fetch("currency", user.id)) === null) {
        await connect.add("currency", user.id, 0, 0, 1000, 0);
      }
      if ((await connect.fetch("currency", message.author.id)) === null) {
        await connect.add("currency", message.author.id, 0, 0, 1000, 0);
      }
      if (!args[1]) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You can't pay nothing!")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      let amount = null;
      if (args[1].toLowerCase() === "all") {
        let authorBal = await connect.fetch("currency", message.author.id);
        amount = authorBal.amountw;
      } else {
        amount = parseInt(args[1]);
        if (isNaN(amount)) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("**ERROR:** Invalid amount.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
        }
      }
      if (amount < 1) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("**ERROR:** Invalid amount (less than 1).")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      let authorBal = await connect.fetch("currency", message.author.id);
      let userBal = await connect.fetch("currency", user.id);
      if (amount > authorBal.amountw) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You don't have $" + amount)
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      await connect.update(
        "currency",
        message.author.id,
        parseInt(authorBal.amountw) - parseInt(amount)
      );
      await connect.update(
        "currency",
        user.id,
        parseInt(userBal.amountw) + parseInt(amount)
      );
      m.edit({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              "You have transfered **`$" +
                numberWithCommas(amount) +
                "`** to **" +
                user.username +
                "**."
            )
            .setThumbnail(message.guild.iconURL())
            .setTitle("Success"),
        ],
      });
      // cmd stuff here
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
