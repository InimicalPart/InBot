const commandInfo = {
  primaryName: "setbankcap", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["setbankcap", "sbc"], // These are all commands that will trigger this command.
  help: "Set a users maximum bank capacity.", // This is the general description of the command.
  aliases: ["sbc"], // These are command aliases that help.js will use
  usage: "[COMMAND] <user> <amount/reset>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "developer",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdSetbankcap) {
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
              .setDescription(
                "You need to specify a user to set the bank capacity for."
              )
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }

      let user;
      try {
        user =
          message.mentions.members.first() ||
          message.guild.members.cache.get(args[0]) ||
          message.guild.members.cache.find(
            (r) =>
              r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
          ) ||
          message.guild.members.cache.find(
            (r) =>
              r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
          ) ||
          (await message.guild.members.fetch(args[0])) ||
          null;
      } catch (e) {
        user = null;
      }
      if (user.user) {
        user = user.user;
      }
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      if ((await connect.fetch("currency", user.id)) === null) {
        await connect.add("currency", user.id);
      }
      const data = await connect.fetch("currency", message.author.id);
      if (!args[1]) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                user.username +
                  "'s bank capacity is at: `$" +
                  numberWithCommas(data.maxbank) +
                  "`"
              )
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      }
      if (args[1] === "reset") {
        await connect.update("currency", user.id, undefined, undefined, 1000);
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                user.username + "'s bank capacity has been set to: `$1,000`"
              )
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      } else if (!isNaN(parseInt(args[1]))) {
        await connect.update(
          "currency",
          user.id,
          undefined,
          undefined,
          parseInt(args[1])
        );
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                user.username +
                  "'s bank capacity has been set to: `$" +
                  numberWithCommas(parseInt(args[1])) +
                  "`"
              )
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
      } else {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You need to specify a valid number for the bank capacity."
              )
              .setTimestamp()
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
