const commandInfo = {
  primaryName: "dbinfo", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["dbinfo"], // These are all commands that will trigger this command.
  help: "Get information of a user from the database.", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <userid>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "developer",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require(RM.path.resolve(global.dirName, "config.js")).cmdDbinfo) {
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

  if (
    !message.member.permissions.has(RM.Discord.Permissions.FLAGS.ADMINISTRATOR)
  ) {
    return m.edit({
      embeds: [
        new RM.Discord.MessageEmbed()
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
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const connect = RM.DBClient;
  await connect.create("currency");
  await connect.create("cooldown");
  await connect.create("inventory");
  await connect.create("timer");
  await connect.create("player_stats");
  var SqlString = require("sqlstring");
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:869354366803509299> *Working on it...*"
        ),
      ],
    })
    .then(async (m) => {
      if (!args[0]) {
        connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setDescription("You need to specify an user id to get info on.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return;
      }
      if (isNaN(parseInt(args[0]))) {
        connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setDescription("Incorrect argument")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return;
      }
      const res = await connect.query(
        "SELECT * FROM currency WHERE userid=" + SqlString.escape(args[0])
      );
      if (res.rows.length < 1) {
        connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setDescription("Could not find a user with that id.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return;
      }
      const resjson = JSON.parse(JSON.stringify(res.rows[0]));
      let user = await message.guild.members.fetch(resjson.userid);
      if (user.user) {
        user = user.user;
      }
      const tag = user.tag;
      const iconURL = user.avatarURL();
      let embed = new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setThumbnail(iconURL)
        .setTitle("DB Data")
        .addFields({
          name: "ID",
          value: String(resjson.id),
        })
        .addFields({
          name: "Name",
          value: "**" + tag + "**",
        })
        .addFields({
          name: "User ID",
          value: String(resjson.userid),
        })
        .addFields({
          name: "Wallet",
          value: "$" + numberWithCommas(resjson.amountw),
        })
        .addFields({
          name: "Bank",
          value: "$" + numberWithCommas(resjson.amountb),
        })
        .addFields({
          name: "Bank Capacity",
          value: "$" + numberWithCommas(resjson.maxbank),
        })
        .addFields({
          name: "Level",
          value: String(resjson.level),
        });
      const res2 = await connect.query(
        "SELECT * FROM inventory WHERE userid=" + resjson.userid
      );
      const res3 = await connect.query(
        "SELECT * FROM cooldown WHERE userid=" + resjson.userid
      );
      if (res2.rows.length < 1) {
      } else {
        const res2json = JSON.parse(JSON.stringify(res2.rows[0]));
        embed.addFields({
          name: "Inventory",
          value: JSON.stringify(res2json.items),
        });
      }
      if (res3.rows.length < 1) {
      } else {
        const res3json = JSON.parse(JSON.stringify(res3.rows[0]));
        if (res3.rows[0].workcool !== null) {
          embed.addFields({
            name: "Work Cooldown",
            value: new Date(res3json.workcool * 1000).toLocaleString(),
          });
        } else {
          embed.addFields({
            name: "Work Cooldown",
            value: "No cooldown.",
          });
        }
        if (res3.rows[0].robcool !== null) {
          embed.addFields({
            name: "Rob Cooldown",
            value: new Date(res3json.robcool * 1000).toLocaleString(),
          });
        } else {
          embed.addFields({
            name: "Rob Cooldown",
            value: "No cooldown.",
          });
        }
        if (res3.rows[0].slotscool !== null) {
          embed.addFields({
            name: "Slots Cooldown",
            value: new Date(res3json.slotscool * 1000).toLocaleString(),
          });
        } else {
          embed.addFields({
            name: "Slots Cooldown",
            value: "No cooldown.",
          });
        }
        if (res3.rows[0].roulcool !== null) {
          embed.addFields({
            name: "Roulette Cooldown",
            value: new Date(res3json.roulcool * 1000).toLocaleString(),
          });
        } else {
          embed.addFields({
            name: "Roulette Cooldown",
            value: "No cooldown.",
          });
        }
        if (res3.rows[0].dailycool !== null) {
          embed.addFields({
            name: "Daily Cooldown",
            value: new Date(res3json.dailycool * 1000).toLocaleString(),
          });
        } else {
          embed.addFields({
            name: "Daily Cooldown",
            value: "No cooldown.",
          });
        }
        if (res3.rows[0].weeklycool !== null) {
          embed.addFields({
            name: "Weekly Cooldown",
            value: new Date(res3json.weeklycool * 1000).toLocaleString(),
          });
        } else {
          embed.addFields({
            name: "Weekly Cooldown",
            value: "No cooldown.",
          });
        }
        if (res3.rows[0].monthlycool !== null) {
          embed.addFields({
            name: "Monthly Cooldown",
            value: new Date(res3json.monthlycool * 1000).toLocaleString(),
          });
        } else {
          embed.addFields({
            name: "Monthly Cooldown",
            value: "No cooldown.",
          });
        }
      }
      m.edit({ embeds: [embed] });
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
