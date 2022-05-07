const commandInfo = {
  primaryName: "testing", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["testing"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "developer",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdTesting) {
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
  //   let user = await message.guild.members.fetch(message.author.id);
  let users = await message.guild.members.fetch();
  let wantedId = args[0] || message.author.id;
  //find the users id in users
  let user = users.find((u) => u.id === wantedId);
  if (user.presence) {
    let attachment = new RM.Discord.MessageAttachment(
      Buffer.from(JSON.stringify(user.presence, null, 2)),
      "presence-" + wantedId + ".json"
    );
    return message.channel.send({
      content:
        "**" +
        user.user.username +
        "#" +
        user.user.discriminator +
        "** has a presence and is currently **" +
        user.presence.status +
        "**",
      files: [attachment],
    });
  } else {
    let attachment = new RM.Discord.MessageAttachment(
      Buffer.from(JSON.stringify(user, null, 2)),
      "user-" + wantedId + ".json"
    );
    return message.channel.send({
      content:
        "**" +
        user.user.username +
        "#" +
        user.user.discriminator +
        "** has no presence",
      files: [attachment],
    });
  }
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
