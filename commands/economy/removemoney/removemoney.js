const commandInfo = {
  primaryName: "removemoney", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["removemoney", "rm"], // These are all commands that will trigger this command.
  help: "Remove some money from a users wallet/bank", // This is the general description of the command.
  aliases: ["rm"], // These are command aliases that help.js will use
  usage: "[COMMAND] <user> <amount> (-b for bank)", // [COMMAND] gets replaced with the command and correct prefix later
  category: "developer",
  slashCommand: null,
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require(RM.path.resolve(global.dirName, "config.js")).cmdRemovemoney) {
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

      if (
        !message.member.permissions.has(
          RM.Discord.Permissions.FLAGS.ADMINISTRATOR,
          RM.Discord.Permissions.FLAGS.MANAGE_GUILD
        )
      ) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You do not have permission to use this command.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Permission Denied"),
          ],
        });
      }

      if (!args[0]) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a user.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Arguments"),
          ],
        });
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
      if (user.user) {
        user = user.user;
      }
      if (!user) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a user.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Arguments"),
          ],
        });
      }
      if (!args[1]) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a value.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Arguments"),
          ],
        });
      }

      if ((await connect.fetch("currency", user.id)) === null) {
        await connect.add("currency", user.id, 0, 0, 1000, 0);
      } // ANCHOR no it doesnt work for me
      const info = await connect.fetch("currency", user.id);
      let bal = parseInt(info.amountw);
      let bank = parseInt(info.amountb);
      if (args[2] == "-b") {
        if (args[1] == "clear") {
          await connect.update("currency", user.id, undefined, 0);
          await connect.end(true);
          return m.edit({
            embeds: [
              new Discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription(`${user.username}'s bank was cleared.`)
                .setThumbnail(message.guild.iconURL())
                .setTitle("Success"),
            ],
          });
        }
        if (isNaN(parseInt(args[1]))) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("Please specify a valid bank value.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Invalid Arguments"),
            ],
          });
        }
        if (args[1] > bank) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("you cannot take more than they have :/")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Invalid Arguments"),
            ],
          });
        }
        await connect.update(
          "currency",
          user.id,
          undefined,
          bank - 0 - (args[1] - 0)
        );
        let moneyEmbed = new Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            `You took **\`$${numberWithCommas(args[1])}\`** from **${
              user.username
            }**'s bank. Their bank balance is now **\`$${numberWithCommas(
              bank - args[1]
            )}\`**`
          ) // done
          .setThumbnail(message.guild.iconURL())
          .setTitle("Money Removed");

        m.edit({ embeds: [moneyEmbed] });
        return await connect.end(true);
      }
      if (args[1] == "clear") {
        await connect.update("currency", user.id, 0);
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(`${user.username}'s wallet was cleared.`)
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      }
      if (isNaN(parseInt(args[1]))) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a valid bank value.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Arguments"),
          ],
        });
      }
      if (args[1] > bal) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "User does not have **`$" + numberWithCommas(args[1]) + "`**"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Arguments"),
          ],
        });
      }

      await connect.update("currency", user.id, bal - 0 - (args[1] - 0));
      const info2 = await connect.fetch("currency", user.id);
      let bal2 = info2.amountw;
      let moneyEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setDescription(
          `You took **\`$${numberWithCommas(args[1])}\`** from **${
            user.username
          }**'s wallet. Their new balance is: **\`$${numberWithCommas(
            bal - parseInt(args[1])
          )}\`**`
        )
        .setThumbnail(message.guild.iconURL())
        .setTitle("Money Removed");

      m.edit({ embeds: [moneyEmbed] });
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
