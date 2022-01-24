const commandInfo = {
  primaryName: "remove",
  possibleTriggers: ["remove", "delete"],
  help: "Allows admins to remove an approved image submission.",
  aliases: ["delete"],
  usage: "[COMMAND] <MSG ID>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "iiisub",
};

async function runCommand(message, args, RM) {
  if (!require("../../../config.js").cmdRemove) {
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

  const client = RM.client;
  const submissionChannelID = RM.submissionChannelID;
  const botOwners = RM.botOwners;
  if (!botOwners.includes(message.author.id)) return;

  if (!args[0]) {
    return message.channel.send({
      content: "Please provide the message to remove",
    });
  }
  const submissionChannel = client.channels.cache.get(submissionChannelID);
  const messageID = args[0];
  let m = await submissionChannel.messages.fetch(messageID).catch((err) => {
    return message.channel.send({ content: "Invalid Message ID." });
  });
  if (m == undefined) {
    return message.channel.send({ content: "Invalid Message ID." });
  }

  m.delete()
    .then(() =>
      message.channel.send({ content: "Successfully deleted " + messageID })
    )
    .catch((err) => message.channel.send({ content: "ERROR: " + err }));
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
