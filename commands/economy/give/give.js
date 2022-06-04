const commandInfo = {
  primaryName: "give", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["give"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
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
      if ((await connect.fetch("inventory", message.author.id)) === null) {
        await connect.add("inventory", message.author.id);
      }
      if (!args[0]) {
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You need to specify a user to give items to!")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return await connect.end(true);
      }
      let amount;
      if (!args[1]) {
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You need to specify an item id!")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return await connect.end(true);
      }
      if (args[2]) {
        amount = parseInt(args[2]);
      } else {
        amount = 1;
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
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("**Error:** User not found!")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return await connect.end(true);
      }
      if (user.user) {
        user = user.user;
      }
      if ((await connect.fetch("inventory", user.id)) === null) {
        await connect.add("inventory", user.id);
      }
      const data1 = await connect.fetch("inventory", message.author.id);
      let authorInv = data1.items;
      const data2 = await connect.fetch("inventory", user.id);
      let userInv = data2.items;
      if (args[1] === "banknote") {
        if (authorInv.banknote === undefined || authorInv.banknote < amount) {
          m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have enough banknotes!")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
          return await connect.end(true);
        }
        authorInv.banknote -= amount;
        if (authorInv.banknote === 0) delete authorInv.banknote;
        if (userInv.banknote === undefined) {
          userInv.banknote = amount;
        } else {
          userInv.banknote += amount;
        }
        await connect.updateInv("inventory", message.author.id, authorInv);
        await connect.updateInv("inventory", user.id, userInv);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                `You gave **\`${amount}\`** banknotes to **${user.username}**!`
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
        return await connect.end(true);
      } else if (args[1] === "raybrain") {
        if (authorInv.raybrain === undefined || authorInv.raybrain < amount) {
          m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have enough raybrains!")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
          return await connect.end(true);
        }
        authorInv.raybrain -= amount;
        if (authorInv.raybrain === 0) delete authorInv.raybrain;
        if (userInv.raybrain === undefined) {
          userInv.raybrain = amount;
        } else {
          userInv.raybrain += amount;
        }
        await connect.updateInv("inventory", message.author.id, authorInv);
        await connect.updateInv("inventory", user.id, userInv);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                `You gave **\`${amount}\`** raybrains to **${user.username}**!`
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
        return await connect.end(true);
      } else if (args[1] === "padlock") {
        if (authorInv.padlock === undefined || authorInv.padlock < amount) {
          m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have enough padlocks!")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
          return await connect.end(true);
        }
        authorInv.padlock -= amount;
        if (authorInv.padlock === 0) delete authorInv.padlock;
        if (userInv.padlock === undefined) {
          userInv.padlock = amount;
        } else {
          userInv.padlock += amount;
        }
        await connect.updateInv("inventory", message.author.id, authorInv);
        await connect.updateInv("inventory", user.id, userInv);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                `You gave **\`${amount}\`** padlocks to **${user.username}**!`
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
        return await connect.end(true);
      } else if (args[1] === "lockpick") {
        if (authorInv.lockpick === undefined || authorInv.lockpick < amount) {
          m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have enough lockpicks!")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
          return await connect.end(true);
        }
        authorInv.lockpick -= amount;
        if (authorInv.banknote === undefined || authorInv.lockpick === 0)
          delete authorInv.lockpick;
        if (userInv.lockpick === undefined) {
          userInv.lockpick = amount;
        } else {
          userInv.lockpick += amount;
        }
        await connect.updateInv("inventory", message.author.id, authorInv);
        await connect.updateInv("inventory", user.id, userInv);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                `You gave **\`${amount}\`** lockpicks to **${user.username}**!`
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
        return await connect.end(true);
      } else if (args[1] === "landmine") {
        if (authorInv.landmine === undefined || authorInv.landmine < amount) {
          m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have enough landmines!")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
          return await connect.end(true);
        }
        authorInv.landmine -= amount;
        if (authorInv.landmine === 0) delete authorInv.landmine;
        if (userInv.landmine === undefined) {
          userInv.landmine = amount;
        } else {
          userInv.landmine += amount;
        }
        await connect.updateInv("inventory", message.author.id, authorInv);
        await connect.updateInv("inventory", user.id, userInv);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                `You gave **\`${amount}\`** landmines to **${user.username}**!`
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
        return await connect.end(true);
      } else {
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid item!")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return await connect.end(true);
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
