const commandInfo = {
  primaryName: "buy", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["buy", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
  slashCommand: null,
};

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
      await connect.create("inventory");
      await connect.create("currency");

      if (!args[0]) {
        await connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "I can't read minds, you need to tell me what you're buying."
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("No Item"),
          ],
        });
      }
      if ((await connect.fetch("inventory", message.author.id)) === null) {
        await connect.add("inventory", message.author.id);
      }
      if ((await connect.fetch("currency", message.author.id)) === null) {
        await connect.add("currency", message.author.id);
      }
      const validItems = ["banknote", "raybrain"];
      if (validItems.includes(args[0])) {
        if (args[0] == "banknote") {
          const data = await connect.fetch("currency", message.author.id);
          const invData = await connect.fetch("inventory", message.author.id);
          if (data.amountw < 10000) {
            await connect.end(true);
            return m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("You don't have enough money to buy this.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Not enough money"),
              ],
            });
          }
          await connect.update(
            "currency",
            message.author.id,
            data.amountw - 80000
          );
          const items = invData.items;
          if (items.banknote === undefined) {
            items.banknote = 1;
          } else {
            items.banknote += 1;
          }
          await connect.updateInv("inventory", message.author.id, items);
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
                  "You have successfully bought a banknote for $80,000."
                )
                .setThumbnail(message.guild.iconURL())
                .setTitle("Success"),
            ],
          });
        } else if (args[0] == "raybrain") {
          const data = await connect.fetch("currency", message.author.id);
          const invData = await connect.fetch("inventory", message.author.id);
          if (data.amountw < 20000) {
            await connect.end(true);
            return m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("You don't have enough money to buy this.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Not enough money"),
              ],
            });
          }
          await connect.update(
            "currency",
            message.author.id,
            data.amountw - 20000
          );
          const items = invData.items;
          if (items.raybrain === undefined) {
            items.raybrain = 1;
          } else {
            items.raybrain += 1;
          }
          await connect.updateInv("inventory", message.author.id, items);
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
                  "You have successfully bought a raybrain for $20,000."
                )
                .setThumbnail(message.guild.iconURL())
                .setTitle("Success"),
            ],
          });
        }
      } else if (args[0] == "padlock") {
        const data = await connect.fetch("currency", message.author.id);
        const invData = await connect.fetch("inventory", message.author.id);
        if (data.amountw < 5000) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have enough money to buy this.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Not enough money"),
            ],
          });
        }
        await connect.update(
          "currency",
          message.author.id,
          data.amountw - 5000
        );
        const items = invData.items;
        if (items.padlock === undefined) {
          items.padlock = 1;
        } else {
          items.padlock += 1;
        }
        await connect.updateInv("inventory", message.author.id, items);
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
                "You have successfully bought a padlock for $5,000."
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      } else if (args[0] == "landmine") {
        const data = await connect.fetch("currency", message.author.id);
        const invData = await connect.fetch("inventory", message.author.id);
        if (data.amountw < 10000) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have enough money to buy this.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Not enough money"),
            ],
          });
        }
        await connect.update(
          "currency",
          message.author.id,
          data.amountw - 10000
        );
        const items = invData.items;
        if (items.landmine === undefined) {
          items.landmine = 1;
        } else {
          items.landmine += 1;
        }
        await connect.updateInv("inventory", message.author.id, items);
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
                "You have successfully bought a landmine for $10,000."
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      } else if (args[0] == "lockpick") {
        const data = await connect.fetch("currency", message.author.id);
        const invData = await connect.fetch("inventory", message.author.id);
        if (data.amountw < 7000) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have enough money to buy this.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Not enough money"),
            ],
          });
        }
        await connect.update(
          "currency",
          message.author.id,
          data.amountw - 7000
        );
        const items = invData.items;
        if (items.lockpick === undefined) {
          items.lockpick = 1;
        } else {
          items.lockpick += 1;
        }
        await connect.updateInv("inventory", message.author.id, items);
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
                "You have successfully bought a lockpick for $7,000." //here? um what was i supposed to do again i forgot
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      } else {
        await connect.end(true);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("I don't know what you're trying to buy.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Item"),
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
