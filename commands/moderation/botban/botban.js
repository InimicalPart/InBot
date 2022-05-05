const { NoticeMessage } = require("pg-protocol/dist/messages");

const commandInfo = {
  primaryName: "botban", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["botban", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "develoepr",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdBotban) {
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
  let action = args[0];
  let bannedId = args[1];
  let botType = args[2] || RM.client.user.id;
  const connect = RM.DBClient;
  await connect.create("bot_settings");
  if (
    (
      await connect.query(
        "SELECT * FROM bot_settings WHERE botid=" + RM.client.user.id
      )
    ).rows.length < 1
  ) {
    await connect.add("bot_settings", RM.client.user.id);
  }
  if (!action) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Please specify an action.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid Action"),
      ],
    });
  }
  if (!bannedId) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Please specify a user ID.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid User ID"),
      ],
    });
  }
  if (bannedId === message.author.id) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("You cannot ban yourself.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid User ID"),
      ],
    });
  }
  if (action === "add") {
    if (botType)
      if (
        !["all", "858108082705006642", "859513472973537311"].includes(botType)
      ) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a bot type.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Bot Type"),
          ],
        });
      }

    if (botType.toLowerCase() === "all") {
      let success = [];
      let alreadyBanned = [];
      let allSettings = await connect.query("SELECT * FROM bot_settings");
      allSettings = allSettings.rows;
      for (let row of allSettings) {
        if (!row.settings.banned_users) row.settings.banned_users = [];
        if (!row.settings.banned_users.includes(bannedId)) {
          row.settings.banned_users.push(bannedId);
          await connect.updateSettings("bot_settings", row.botid, row.settings);
          success.push(row.botid);
          global.bannedUsers.push(bannedId);
        } else {
          alreadyBanned.push(row.botid);
        }
      }
      if (success.length > 0) {
        let embed = new RM.Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            `Successfully banned user ID ${bannedId} on ${success.length} bots.`
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Success");
        if (alreadyBanned.length > 0) {
          embed.setFooter({
            text: `${alreadyBanned.length} bots had user ID '${bannedId}' already banned.`,
          });
        }
        return message.channel.send({
          embeds: [embed],
        });
      } else {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("YELLOW")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("All bots already have this user ID banned.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Already Banned"),
          ],
        });
      }
    } else {
      if (
        (
          await connect.query(
            "SELECT * FROM bot_settings WHERE botid=" + botType
          )
        ).rows.length < 1
      ) {
        await connect.add("bot_settings", botType);
      }
      let botSettingsBot = await connect.query(
        "SELECT * FROM bot_settings WHERE botid=" + botType
      );
      botSettingsBot = botSettingsBot.rows[0].settings;
      if (!botSettingsBot?.banned_users) botSettingsBot.banned_users = [];
      if (!botSettingsBot?.banned_users?.includes(bannedId)) {
        botSettingsBot.banned_users.push(bannedId);
        await connect.updateSettings("bot_settings", botType, botSettingsBot);
        if (botType === RM.client.user.id) {
          global.bannedUsers.push(bannedId);
        }
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                `Successfully banned user ID ${bannedId} on bot ${botType}.`
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      } else {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("YELLOW")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(`Bot ${botType} already has this user ID banned.`)
              .setThumbnail(message.guild.iconURL())
              .setTitle("Already Banned"),
          ],
        });
      }
    }
  } else if (action === "remove") {
    if (botType)
      if (
        !["all", "858108082705006642", "859513472973537311"].includes(botType)
      ) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a bot type.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Bot Type"),
          ],
        });
      }
    if (botType.toLowerCase() === "all") {
      let success = [];
      let notBanned = [];
      let allSettings = await connect.query("SELECT * FROM bot_settings");
      allSettings = allSettings.rows;
      for (let row of allSettings) {
        if (!row.settings.banned_users) row.settings.banned_users = [];
        if (row.settings.banned_users.includes(bannedId)) {
          row.settings.banned_users.splice(
            row.settings.banned_users.indexOf(bannedId),
            1
          );
          await connect.updateSettings("bot_settings", row.botid, row.settings);
          global.bannedUsers.splice(global.bannedUsers.indexOf(bannedId), 1);
          success.push(row.botid);
        } else {
          notBanned.push(row.botid);
        }
      }
      if (success.length > 0) {
        let embed = new RM.Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            `Successfully unbanned user ID ${bannedId} on ${success.length} bots.`
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Success");
        if (notBanned.length > 0) {
          embed.setFooter({
            text: `${notBanned.length} bots had user ID '${bannedId}' not banned.`,
          });
        }
        return message.channel.send({
          embeds: [embed],
        });
      }
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("YELLOW")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("No bots have this user ID banned.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Not Banned"),
        ],
      });
    } else {
      if (
        (
          await connect.query(
            "SELECT * FROM bot_settings WHERE botid=" + botType
          )
        ).rows.length < 1
      ) {
        await connect.add("bot_settings", botType);
      }
      let botSettingsBot = await connect.query(
        "SELECT * FROM bot_settings WHERE botid=" + botType
      );
      botSettingsBot = botSettingsBot.rows[0].settings;
      if (!botSettingsBot?.banned_users) botSettingsBot.banned_users = [];
      if (botSettingsBot?.banned_users?.includes(bannedId)) {
        botSettingsBot.banned_users.splice(
          botSettingsBot.banned_users.indexOf(bannedId),
          1
        );
        if (botType === RM.client.user.id) {
          global.bannedUsers.splice(global.bannedUsers.indexOf(bannedId), 1);
        }
        await connect.updateSettings("bot_settings", botType, botSettingsBot);
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                `Successfully unbanned user ID ${bannedId} on bot ${botType}.`
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      } else {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("YELLOW")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "User ID '" +
                  bannedId +
                  "' is not banned on bot " +
                  botType +
                  "."
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Not Banned"),
          ],
        });
      }
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
}; /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */

/* */
/* */
/* */
/*
------------------[Instruction]------------------

1. Make a directory in commands/ with your command name
2. Inside that directory, make a "<command name>.js" file
3. Copy the contents of TEMPLATE.js and paste it in the <command name>.js file and modify it to your needs.
4. In index.js add to the top:
"const cmd<cmdNameHere> = require('./commands/<command name>/<command name>.js');" at the top.

-------------------------------------------------

To get all possible triggers, from index.js call
"cmd<cmdname>.commandTriggers()"

To call the command, from index.js call
"cmd<cmdname>.runCommand(message, arguments, requiredModules);"

To check if possible triggers has the command call
"cmd<cmdname>.commandTriggers().includes(command)"

------------------[Instruction]------------------
*/
/* */
/* */
