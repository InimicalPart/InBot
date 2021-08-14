const commandInfo = {
  primaryName: "testingenv", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["testingenv", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "mod",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdTestingenv) {
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
  let result;
  if (global.chessList.length === 0) {
    result = "chess: list empty\n";
  } else result = "chess: " + global.chessList.join(", ") + "\n";
  if (global.sudokuList.length === 0) {
    result += "sudoku: list empty\n";
  } else result += "sudoku: " + global.sudokuList.join(", ") + "\n";
  if (global.mineSweeperList.length === 0) {
    result += "ms: list empty\n";
  } else result += "ms: " + global.mineSweeperList.join(", ") + "\n";
  message.channel.send({
    content: result,
    reply: { messageReference: message.id },
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
