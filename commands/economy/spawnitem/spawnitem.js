const commandInfo = {
  primaryName: "spawnitem", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["spawnitem", "si"], // These are all commands that will trigger this command.
  help: "Spawn an item in your inventory.", // This is the general description of the command.
  aliases: ["si"], // These are command aliases that help.js will use
  usage: "[COMMAND] <itemid> [amount]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "developer",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdSpawnitem) {
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
    await connect.end(true);
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
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:869354366803509299> *Working on it...*"
        ),
      ],
    })
    .then(async (m) => {
      const { connect } = require("../../../databasec");
      await connect();
      await connect.create("inventory");
      if ((await connect.fetch("inventory", message.author.id)) === null) {
        await connect.add("inventory", message.author.id);
      }
      const data = await connect.fetch("inventory", message.author.id);
      let inventory = data.items;
      if (!args[0]) {
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You need to specify an item to summon.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      let amount = 1;
      if (args[1]) amount = parseInt(args[1]);
      if (args[0] === "banknote") {
        if (inventory.banknote === undefined) {
          inventory.banknote = amount;
        } else {
          inventory.banknote += amount;
        }
        await connect.updateInv("inventory", message.author.id, inventory);
        await connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You have summoned a banknote! You now have **" +
                  inventory.banknote +
                  "** banknote(s)"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Banknote(s) summoned"),
          ],
        });
      } else if (args[0] === "padlock") {
        if (inventory.padlock === undefined) {
          inventory.padlock = amount;
        } else {
          inventory.padlock += amount;
        }
        await connect.updateInv("inventory", message.author.id, inventory);
        await connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You have summoned a padlock! You now have **" +
                  inventory.padlock +
                  "** padlock(s)"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Padlock(s) summoned"),
          ],
        });
      } else if (args[0] === "landmine") {
        if (inventory.landmine === undefined) {
          inventory.landmine = amount;
        } else {
          inventory.landmine += amount;
        }
        await connect.updateInv("inventory", message.author.id, inventory);
        await connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You have summoned a landmine! You now have **" +
                  inventory.landmine +
                  "** landmine(s)"
              ),
          ],
        });
      } else if (args[0] === "lockpick") {
        if (inventory.lockpick === undefined) {
          inventory.lockpick = amount;
        } else {
          inventory.lockpick += amount;
        }
        await connect.updateInv("inventory", message.author.id, inventory);
        await connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You have summoned a lockpick! You now have **" +
                  inventory.lockpick +
                  "** lockpick(s)"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Lockpick(s) summoned"),
          ],
        });
      } else {
        connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("There is no item with that id")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
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
