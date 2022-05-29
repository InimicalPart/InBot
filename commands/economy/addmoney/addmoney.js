const commandInfo = {
  primaryName: "addmoney", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["addmoney", "am"], // These are all commands that will trigger this command.
  help: "Add money to a users wallet/bank", // This is the general description of the command.
  aliases: ["am"], // These are command aliases that help.js will use
  usage: "[COMMAND] <user> <money> (-b for bank)", // [COMMAND] gets replaced with the command and correct prefix later
  category: "developer",
  slashCommand: null,
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require(RM.path.resolve(global.dirName, "config.js")).cmdAddmoney) {
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
          RM.Discord.Permissions.FLAGS.ADMINISTRATOR
        )
      ) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You do not have permission to use this command.")
              .setTimestamp()
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
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You need to specify a user to add money to.")
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("No User Specified"),
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

      if (user == null) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(`${args[0]} is not a valid user.`)
              .setThumbnail(message.guild.iconURL())
              .setTitle("User Not Found"),
          ],
        });
      }
      if (user.user) {
        user = user.user;
      }
      const username = user.username;
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
              .setDescription(`You need to specify a value to add.`)
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("No Value Specified"),
          ],
        });
      }
      if (isNaN(args[1]) || args[1] < 0) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(`The value you specified is not a number.`)
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Value"),
          ],
        });
      }
      if (args[1] > 1000000) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(`The value you specified is too high.`)
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Value"),
          ],
        });
      }

      if ((await connect.fetch("currency", user.id)) === null) {
        await connect.add("currency", user.id, 0, 0, 1000, 0);
      }
      const info = await connect.fetch("currency", user.id);
      const bank = parseInt(info.amountb);
      if (args[2] == "-b") {
        if (info.maxbank - bank < args[1]) {
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
                  `You can't add more money to their bank than their max bank cap! They have **\`$${numberWithCommas(
                    info.maxbank - bank
                  )}\`** of free space in their bank`
                )
                .setTimestamp()
                .setThumbnail(message.guild.iconURL())
                .setTitle("Invalid Amount"),
            ],
          });
        }
        await connect.update(
          "currency",
          user.id,
          undefined,
          bank - 0 + (args[1] - 0)
        );
        let moneyEmbed = new Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            `**${username}**'s bank has been increased by **\`$${numberWithCommas(
              args[1]
            )}\`**`
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Money Added");

        m.edit({ embeds: [moneyEmbed] });
        return await connect.end(true);
      }
      const res = await connect.fetch("currency", user.id);

      await connect.update(
        "currency",
        user.id,
        res.amountw - 0 + (args[1] - 0)
      );
      m.edit({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              `**${username}**'s balance has been increased by **\`$${numberWithCommas(
                args[1]
              )}\`**!`
            )
            .setTimestamp()
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
