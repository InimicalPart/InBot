const commandInfo = {
  primaryName: "use", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["use"], // These are all commands that will trigger this command.
  help: "Use an item!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <item id> [amount]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdUse) {
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
  await connect.create("inventory");
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
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You need to specify an item to use.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("No Item Specified"),
          ],
        });
      }
      if ((await connect.fetch("currency", message.author.id)) === null) {
        await connect.add("currency", message.author.id, 0, 0, 1000, 0);
      }
      if ((await connect.fetch("inventory", message.author.id)) === null) {
        await connect.add("inventory", message.author.id);
      }
      let amount = 1;
      if (args[1]) amount = parseInt(args[1]);

      if (args[0] === "banknote") {
        //check if user has a banknote in the inventory database
        const data = await connect.fetch("inventory", message.author.id);
        const inventory = JSON.parse(JSON.stringify(data.items));
        if (
          inventory.banknote == undefined ||
          inventory.banknote < parseInt(amount)
        ) {
          connect.end(true);
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription(
                  "You don't have enough banknotes in your inventory."
                )
                .setThumbnail(message.guild.iconURL())
                .setTitle("No Banknote"),
            ],
          });
        }
        //remove banknote
        inventory.banknote = parseInt(inventory.banknote) - amount;
        if (inventory.banknote === 0) {
          delete inventory.banknote;
        }
        await connect.updateInv("inventory", message.author.id, inventory);
        const res = await connect.fetch("currency", message.author.id);
        const maxBank = parseInt(res.maxbank);
        await connect.update(
          "currency",
          message.author.id,
          undefined,
          undefined,
          maxBank + 1000 * parseInt(amount)
        );

        connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You have successfully added $" +
                  1000 * parseInt(amount) +
                  " to your maximum bank capacity. You max bank capacity is now: `$" +
                  (maxBank + 1000 * parseInt(amount)) +
                  "`"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Banknote(s) Added"),
          ],
        });
      } else if (args[0] === "raybrain") {
        //check if user has a raybrain in the inventory database
        const data = await connect.fetch("inventory", message.author.id);
        const inventory = JSON.parse(JSON.stringify(data.items));
        if (
          inventory.raybrain == undefined ||
          inventory.raybrain < parseInt(amount)
        ) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription(
                  "You don't have enough raybrains in your inventory."
                )
                .setThumbnail(message.guild.iconURL())
                .setTitle("No Raybrain"),
            ],
          });
        }
        //remove raybrain
        inventory.raybrain = parseInt(inventory.raybrain) - amount;
        if (inventory.raybrain === 0) {
          delete inventory.raybrain;
        }
        await connect.updateInv("inventory", message.author.id, inventory);
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You just ate **" +
                  amount +
                  "** Ray's brain(s), you feel dumber"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Raybrain(s) used"),
          ],
        });
      } else if (args[0] === "padlock") {
        //check if user has a padlock in the inventory database
        const data = await connect.fetch("inventory", message.author.id);
        const inventory = JSON.parse(JSON.stringify(data.items));
        if (inventory.padlock == undefined) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have a padlock in your inventory.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("No Padlock"),
            ],
          });
        }
        //remove padlock
        inventory.padlock -= 1;
        if (inventory.padlock === 0) {
          delete inventory.padlock;
        }
        inventory.active.padlock = new Date().setTime(
          new Date().getTime() + 600 * 60 * 1000
        );
        await connect.updateInv("inventory", message.author.id, inventory);

        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You have used a padlock, it will expire in **10 hours**"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Padlock used"),
          ],
        });
        return await connect.end(true);
      } else if (args[0] === "landmine") {
        //check if user has a landmine in the inventory database
        const data = await connect.fetch("inventory", message.author.id);
        const inventory = JSON.parse(JSON.stringify(data.items));
        if (inventory.landmine == undefined) {
          await connect.end(true);
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You don't have a landmine in your inventory.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("No Landmine"),
            ],
          });
        }
        //remove landmine
        inventory.landmine -= 1;
        if (inventory.landmine === 0) {
          delete inventory.landmine;
        }
        inventory.active.landmine = new Date().setTime(
          new Date().getTime() + 24 * 60 * 60 * 1000
        );
        await connect.updateInv("inventory", message.author.id, inventory);
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You have used a landmine, it will expire in **24 hours**"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Landmine used"),
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
module.exports = {
  runCommand,
  commandTriggers,
  commandHelp,
  commandAliases,
  commandPrim,
  commandUsage,
  commandCategory,
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
