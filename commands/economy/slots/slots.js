const commandInfo = {
  primaryName: "slots", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["slots"], // These are all commands that will trigger this command.
  help: "Play slots and maybe win some money!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <money>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdSlots) {
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
  function getNew() {
    //random nr 1-9 3 times
    let emojis = [];
    for (let i = 0; i < 3; i++) {
      let random = Math.floor(Math.random() * 9) + 1;
      if (random == 1) {
        emojis.push("💎");
      } else if (random == 2) {
        emojis.push("🍋");
      } else if (random == 3) {
        emojis.push("🍉");
      } else if (random == 4) {
        emojis.push("❤️");
      } else if (random == 5) {
        emojis.push("7️⃣");
      } else if (random == 6) {
        emojis.push("🔔");
      } else if (random == 7) {
        emojis.push("🧲");
      } else if (random == 8) {
        emojis.push("🍒");
      } else if (random == 9) {
        emojis.push("💯");
      }
    }
    return emojis;
  }
  message.channel
    .send({ content: "rollin down in the deep" })
    .then(async (m) => {
      let a = setInterval(async () => {
        let emojis = getNew();
        m.edit(`. ${emojis[0]} ${emojis[1]} ${emojis[2]}`);
      }, 600);
      setTimeout(() => {
        clearInterval(a);
        let emojis = getNew();
        m.edit(`You rolled: ${emojis[0]} ${emojis[1]} ${emojis[2]}`);
      }, 4000);
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