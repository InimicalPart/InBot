const commandInfo = {
  primaryName: "addmoney", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["addmoney", "am"], // These are all commands that will trigger this command.
  help: "Allows admins to add money to a user", // This is the general description of the command.
  aliases: ["am"], // These are command aliases that help.js will use
  usage: "[COMMAND] <user> <money>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdAddmoney) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
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
          "<a:loading:869354366803509299> *Working on it...*"
        ),
      ],
    })
    .then(async (m) => {
      const { connect } = require("../../../databasec");
      await connect();
      await connect.create("currency");

      if (
<<<<<<< HEAD
        !message.member.permissions.has(RM.Discord.Permission.FLAGS.ADMINISTRATOR)
=======
        !message.member.hasPermission(RM.Discord.Permission.FLAGS.ADMINISTRATOR)
>>>>>>> 82fbc2ea8c9c1ab43c06c7c72143bfbab5fcfbb4
      ) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.username, message.author.avatarURL())
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
              .setAuthor(message.author.username, message.author.avatarURL())
              .setDescription("You need to specify a user to add money to.")
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("No User Specified"),
          ],
        });
      }

      let user =
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

      if (user == null) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag, message.author.avatarURL())
              .setDescription(`${args[0]} is not a valid user.`)
              .setThumbnail(message.guild.iconURL())
              .setTitle("User Not Found"),
          ],
        });
      }
      if (user.user) {
        user = user.user;
<<<<<<< HEAD
      }
=======
      } else user = user;
>>>>>>> 82fbc2ea8c9c1ab43c06c7c72143bfbab5fcfbb4
      const username = user.username;
      if (!args[1]) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag, message.author.avatarURL())
              .setDescription(`You need to specify a value to add.`)
              .setTimestamp()
              .setThumbnail(message.guild.iconURL())
              .setTitle("No Value Specified"),
          ],
        });
      }
      if (Number.isNaN(args[1]) || args[1] < 0) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag, message.author.avatarURL())
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
              .setAuthor(message.author.tag, message.author.avatarURL())
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
                .setAuthor(message.author.tag, message.author.avatarURL())
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
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription(
            `**${username}**'s bank has been increased by  **\`$${numberWithCommas(
              args[1]
            )}\`**. Their bank balance is now **\`$${numberWithCommas(
              bank + args[1]
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
            .setAuthor(message.author.tag, message.author.avatarURL())
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
