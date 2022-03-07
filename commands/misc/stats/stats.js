const commandInfo = {
  primaryName: "stats", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["stats", "statistics"], // These are all commands that will trigger this command.
  help: "Get bot statistics and information", // This is the general description of the command.
  aliases: ["statistics"], // These are command aliases that help.js will use
  usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
};

async function runCommand(message, args, RM) {
  if (!require("../../../config.js").cmdStats) {
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

  let connect = RM.DBClient;

  await connect.create("player_stats");
  let user;
  if (args[1]) {
    try {
      user =
        message.mentions.members.first() ||
        (await message.guild.members.fetch(args[1])) ||
        (await message.guild.members.fetch(
          (r) =>
            r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
        )) ||
        (await message.guild.members.fetch(
          (r) =>
            r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
        )) ||
        (await message.guild.members.fetch(args[1])) ||
        null;
    } catch (e) {
      banMember = null;
    }
  } else {
    user = message.author;
  }
  if (!user) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("That is not a valid user.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid User"),
      ],
    });
  }
  if (user.user) user = user.user;
  let playerStats = await connect.query(
    "SELECT * FROM player_stats WHERE userid = " + user.id
  );
  if (playerStats.rows.length < 1) {
    await connect.add("player_stats", user.id);
  }
  playerStats = playerStats.rows[0].stats;
  if (Object.keys(playerStats).length < 1) {
    let restofMSG = "";
    if (args[1])
      restofMSG =
        "**" + user.username + "** needs to play some games to get stats.";
    else restofMSG = "You need to play some games to get stats.";
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("No stats are available. " + restofMSG)
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Games Played"),
      ],
    });
  }
  if (!args[0]) {
    let string2 = "";
    for (let i in Object.keys(playerStats)) {
      string2 += "- **" + Object.keys(playerStats)[i].toUpperCase() + "**\n";
    }
    message.channel
      .send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(string2)
            .setThumbnail(message.guild.iconURL())
            .setTitle("Stats")
            .setFooter({
              text: "Please type in the game you want stats on",
            }),
        ],
      })
      .then((m) => {
        var filter = (m) => [message.author.id].includes(m.author.id);
        const collector = message.channel.createMessageCollector({ filter });
        collector.on("collect", async (messageNext) => {
          let msg = messageNext.content.toLowerCase();
          if (msg.toLowerCase() === "w" || msg.toLowerCase() === "wordle")
            msg = "wordle";
          else if (
            msg.toLowerCase() === "wp" ||
            msg.toLowerCase() === "wordlepractice"
          )
            msg = "wordlepractice";
          if (Object.keys(playerStats).includes(msg)) {
            m.edit({
              content: getText(msg),
              reply: { messageReference: message.id },
              embeds: [],
            });
          } else {
            message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("That is not a valid stat.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Invalid Stat"),
              ],
            });
          }
          collector.stop();
        });
      });
  } else {
    let word = null;
    if (args[0].toLowerCase() === "w" || args[0].toLowerCase() === "wordle")
      word = "wordle";
    else if (
      args[0].toLowerCase() === "wp" ||
      args[0].toLowerCase() === "wordlepractice"
    )
      word = "wordlepractice";
    if (Object.keys(playerStats).includes(word)) {
      message.channel.send({
        content: getText(word, user),
        reply: { messageReference: message.id },
      });
    } else {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              "This stat does not exist or the user has not played this game."
            )
            .setThumbnail(message.guild.iconURL())
            .setTitle("Invalid Stat"),
        ],
      });
    }
  }
  function getText(game, user) {
    if (game === "wordle")
      return (
        "**" +
        user.username +
        "'s Wordle Stats\n**" +
        "Games Played: **" +
        playerStats.wordle.gamesPlayed +
        "**\n" +
        "Games Won: **" +
        playerStats.wordle.gamesWon +
        "**\n" +
        "Games Lost: **" +
        playerStats.wordle.gamesLost +
        "**\n" +
        "Current Streak: **" +
        playerStats.wordle.streak +
        "**\n" +
        "Longest Streak: **" +
        playerStats.wordle.longestStreak +
        "**\n" +
        "Average Guesses/game: **" +
        playerStats.wordle.avgGuesses +
        "**\n" +
        "Win Rate: **" +
        playerStats.wordle.winRate +
        "%**"
      );
    else if (game === "wordlepractice")
      return (
        "**" +
        user.username +
        "'s Wordle (PRACTICE) Stats\n**" +
        "Games Played: **" +
        playerStats.wordlepractice.gamesPlayed +
        "**\n" +
        "Games Won: **" +
        playerStats.wordlepractice.gamesWon +
        "**\n" +
        "Games Lost: **" +
        playerStats.wordlepractice.gamesLost +
        "**\n" +
        "Current Streak: **" +
        playerStats.wordlepractice.streak +
        "**\n" +
        "Longest Streak: **" +
        playerStats.wordlepractice.longestStreak +
        "**\n" +
        "Average Guesses/game: **" +
        playerStats.wordlepractice.avgGuesses +
        "**\n" +
        "Win Rate: **" +
        playerStats.wordlepractice.winRate +
        "%**"
      );
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
