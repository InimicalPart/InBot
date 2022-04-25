const commandInfo = {
  primaryName: "approve",
  possibleTriggers: ["approve"],
  help: "Allows admins to approve an image submission.",
  aliases: [],
  usage: "[COMMAND] <MSG ID> [reason]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "iiisub",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  if (!require("../../../config.js").cmdApprove) {
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

  const Discord = RM.Discord;
  const client = RM.client;
  const submissionChannelID = RM.submissionChannelID;
  const submissionQueueID = RM.submissionQueueID;
  const logsID = RM.logsID;
  const botOwners = RM.botOwners;
  if (!botOwners.includes(message.author.id)) return;
  message.delete();
  if (!args[0]) {
    return message.channel.send({
      content: "Please provide the message to approval",
    });
  }
  const submissionQueue = client.channels.cache.get(submissionQueueID);
  const submissionChannel = client.channels.cache.get(submissionChannelID);
  const messageID = args[0];
  let m = await submissionQueue.messages.fetch(messageID).catch((err) => {
    return message.channel.send({ content: "Invalid Message ID." });
  });

  if (!m.editable)
    return message.channel.send({ content: "I cannot edit that message." });
  if (m.embeds.length < 1)
    return message.channel.send({ content: "This isn't an image submission." });
  const url = m.embeds[0].image.url;
  const authorID = m.embeds[0].author.iconURL.match(/[0-9]{18}/gim);
  let title = null;
  for (let field of m.embeds[0].fields) {
    if (field.name == "Title:") {
      title = field.value;
      break;
    }
  }
  if (title == null) {
    return message.channel.send({ content: "This isn't an image submission." });
  }
  const author = await client.users.fetch(String(authorID));

  //console.log(url, authorID, title, author.tag)
  let exists = null;
  for (let field of m.embeds[0].fields) {
    if (field.name == "Information:") {
      exists = field.value;
      break;
    }
  }
  //console.log(exists)
  if (exists != null) {
    return message.channel.send({
      content: "This message has already been denied or approved.",
    });
  }

  const logs = client.channels.cache.get(logsID);
  let newEmbed;
  if (!args[1]) {
    newEmbed = new Discord.MessageEmbed()
      .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
      .setImage(url)
      .setColor("#FFFF00")
      .addField("Title:", "**" + title + "**")
      .addField("Amazing picture by:", "<@" + message.author + ">")
      .addField("\u200b", "\u200b")
      .addField("Information:", ":white_check_mark: | Approved");
  } else {
    const reason = args.slice(1).join(" ");
    newEmbed = new Discord.MessageEmbed()
      .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
      .setImage(url)
      .setColor("#FFFF00")
      .addField("Title:", "**" + title + "**")
      .addField("Amazing picture by:", "<@" + message.author + ">")
      .addField("\u200b", "\u200b")
      .addField(
        "Information:",
        ":white_check_mark: | Approved, reason: " + reason
      );
  }
  m.delete();
  submissionChannel
    .send({ embeds: [newEmbed] })
    .then(function (messagea) {
      messagea.react("👍");
      messagea.react("👎");
    })
    .catch(function (err) {
      console.error("ERROR: " + err.message);
    });
  logs.send({ embeds: [newEmbed] });
  logs.send({ content: "Post handled by: <@" + message.author.id + ">" });
  if (!args[1]) {
    await author
      .send({
        content: "Your image submission was approved! No reason was supplied",
      })
      .catch(() => {
        console.log("error, probably user has dms closed.");
      });
  } else {
    const reason = args.slice(1).join(" ");
    await author
      .send({ content: "Your image submission was approved!: " + reason })
      .catch(() => {
        console.log("error, probably user has dms closed.");
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
