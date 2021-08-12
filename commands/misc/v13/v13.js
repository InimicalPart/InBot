const commandInfo = {
  primaryName: "v13", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["v13", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdV13) {
    return message.channel.send(
      new RM.Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription("Command disabled by Administrators.")
        .setThumbnail(message.guild.iconURL())
        .setTitle("Command Disabled")
    );
  }
  return message.channel.send(
    "'We at the III Society, will not change the bot to v13 from v12. They changed so much it's so pointless they even release the version. Every bot owner needs to recreate their ENTIRE bot with the new stuff. Have you ever considered big discord.js projects created that have like 20k+ lines of code? Yeah. Sit through that and edit everything. Then every v12 bot owner needs to learn the changes in v13 and how to use them correctly. Quoted from discordjs.guide : `The shortcuts Intents.ALL, Intents.NON_PRIVILEGED, and Intents.PRIVILEGED have all been removed to discourage bad practices of enabling unused intents.` (found at: <https://discordjs.guide/additional-info/changes-in-v13.html#intents>). This literally means that they changed it just because people should stop being lazy and use all intents. Like, whats wrong with using all intents? You don't have to think about adding them when making something new, You don't need to learn which intents to use, etc. Unless v13 won't get better. We're not moving. I rest my case.' - InimicalPart (The III Project developer)"
  );
  // cmd stuff here
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
