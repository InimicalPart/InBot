const commandInfo = {
  primaryName: "bombparty", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["bombparty", "bp"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["bp"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdBombparty) {
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
  return;
  message.channel
    .send({ content: "React with 🚪 to join! (0/10)" })
    .then(async (msg) => {
      await msg.react("🚪");
      const filter = (reaction, user) => {
        return (
          reaction.emoji.name === "🚪" &&
          user.id !== message.author.id &&
          user.id !== RM.client.user.id
        );
      };
      let playingUsers = [];
      const collector = msg.createReactionCollector({
        filter,
        time: 15000,
        dispose: true,
      });
      let totalReactions = 0;
      collector.on("collect", (reaction, user) => {
        if (totalReactions >= 10) {
          message.channel.send({
            content:
              "Only 10 people can play BombParty at one time! Join back later!",
          });
        } else {
          totalReactions++;
          msg.edit(`React with 🚪 to join! (${totalReactions}/10)`);
          playingUsers.push(user.id);
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        }
      });
      collector.on("remove", (reaction, user) => {
        totalReactions--;
        msg.edit(`React with 🚪 to join! (${totalReactions}/10)`);
        playingUsers.splice(playingUsers.indexOf(user.id), 1);
        console.log(`${user.tag} removed reaction: ${reaction.emoji.name}`);
      });
      collector.on("end", (collected) => {
        message.channel.send(
          "Reaction collector ended with " +
            collected.size +
            " reactions, playing users are:\n\n" +
            playingUsers.join("\n")
        );
        console.log(`Collected ${collected.size} items`);
      });
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
