const commandInfo = {
  primaryName: "uno", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["uno", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdUno) {
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
  let UNOEngine = require("uno-engine-plus");
  let joinedUsers = [];
  let UNOFriendlyUsernames = [];
  message.channel
    .send({
      content:
        "**" +
        message.author.username +
        "#" +
        message.author.discriminator +
        "** is starting a game of uno! React with '🚪' to join the game.",
    })
    .then(async (m) => {
      await m.react("🚪");
      let dc = require("discord.js");
      let reactionCollector = new dc.ReactionCollector(m, {
        filter: (reaction, user) =>
          reaction.emoji.name === "🚪" &&
          user.id !== message.author.id &&
          !user.bot,
        idle: 15000,
        time: 15000,
        maxUsers: 10,
        dispose: true,
      });
      reactionCollector.on("collect", (reaction, user) => {
        message.channel.send({
          content:
            "**" +
            user.username +
            "#" +
            user.discriminator +
            "** joined the game!",
        });
      });
      reactionCollector.on("end", (collected) => {
        joinedUsers.push(message.author);
        collected = collected.map((reaction) => {
          reaction.users.cache.filter(
            (user) =>
              user.id !== message.author.id && user.id !== RM.client.user.id
          );
          console.log(typeof reaction.users.cache);
          //use reaction.users.cache.values() to get the user objects into joinedUsers
          reaction.users.cache.forEach((user) => {
            if (user.id !== RM.client.user.id) {
              joinedUsers.push(user);
            }
          });
        });
        console.log(joinedUsers);
        if (joinedUsers.length < 2) {
          return message.channel.send({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("Not enough players to start game.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Not Enough Players"),
            ],
          });
        }
        startGame();
      });
      reactionCollector.on("remove", (reaction, user) => {
        message.channel.send({
          content:
            "**" +
            user.username +
            "#" +
            user.discriminator +
            "** left the game!",
        });
      });
    });
  async function startGame() {
    message.channel.send({
      content: "Staring game with **" + joinedUsers.length + "** players",
    });
    console.log("Fixing valid names for UNO");
    for (let i = 0; i < joinedUsers.length; i++) {
      UNOFriendlyUsernames.push(
        joinedUsers[i].username + "#" + joinedUsers[i].discriminator
      );
    }
    console.log("Setting up UNO game");

    await giveEveryoneCards(parseInt(args[0] || 7));
  }
  async function giveEveryoneCards(numCards) {
    for (let i = 0; i < joinedUsers.length; i++) {
      await giveUserCards(joinedUsers[i], numCards);
    }
  }
  async function giveUserCards(user, numCards) {}
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
