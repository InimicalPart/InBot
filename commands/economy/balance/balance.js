const commandInfo = {
  primaryName: "balance", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["balance", "wallet", "bal"], // These are all commands that will trigger this command.
  help: "Shows Your or a User's Current Balance ", // This is the general description of the command.
  aliases: ["bal", "wallet"], // These are command aliases that help.js will use
  usage: "[COMMAND] [username | nickname | mention | ID]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
};
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdBalance) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.username,
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
          "<a:loading:869354366803509299> *Working on it...*"
        ),
      ],
    })
    .then(async (m) => {
      const { connect } = require("../../../databasec");
      await connect();
      await connect.create("currency");
      console.log("Connected to database & created currency table");
      let user;
      if (args[0]) {
        user =
          message.mentions.members.first() ||
          a ||
          message.guild.members.cache.find(
            (r) =>
              r.user.username.toLowerCase() ===
              args.join(" ").toLocaleLowerCase()
          ) ||
          message.guild.members.cache.find(
            (r) =>
              r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
          ) ||
          b ||
          message.member;
      } else {
        user = message.member;
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
              .setDescription(`${args[0]} is not a valid user.`)
              .setThumbnail(message.guild.iconURL())
              .setTitle("User Not Found"),
          ],
        });
      }
      if (user.user) {
        user = user.user;
      }
      console.log(message.member);
      const username = user.username;
      if ((await connect.fetch("currency", user.id)) === null) {
        await connect.add("currency", user.id, 0, 0, 1000, 0);
      }
      const info = await connect.fetch("currency", user.id);
      const bal = parseInt(info.amountw);
      const bank = parseInt(info.amountb);
      if (user) {
        let embed = new Discord.MessageEmbed()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.avatarURL(),
          })
          .setThumbnail(message.guild.iconURL())
          .setTitle(`${username}'s Balance`)
          .setTimestamp();
        if (info.userid !== message.author.id) {
          embed.setDescription(
            `**Wallet**: $${numberWithCommas(
              bal
            )}\n**Bank**: $${numberWithCommas(bank)}`
          );
        } else {
          let bankPercent = ((bank / info.maxbank) * 100).toFixed(2);
          embed.setDescription(
            `**Wallet**: $${numberWithCommas(
              bal
            )}\n**Bank**: $${numberWithCommas(bank)}/${numberWithCommas(
              info.maxbank
            )} (\`${bankPercent}%\`)`
          );
        }
        await connect.end(true);
        return m.edit({ embeds: [embed] });
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
                "Could not find user. Please make sure you are using a mention, nickname, or ID."
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error")
              .setTimestamp(),
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
