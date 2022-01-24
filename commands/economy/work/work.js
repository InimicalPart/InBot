const commandInfo = {
  primaryName: "work", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["work", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
};
function between(lower, upper) {
  var scale = upper - lower + 1;
  return Math.floor(lower + Math.random() * scale);
}
async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdWork) {
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
      await connect.create("cooldown");
      function between(lower, upper) {
        var scale = upper - lower + 1;
        return Math.floor(lower + Math.random() * scale);
      }
      function WordJumble(fun) {
        var letter = fun;

        var jumbledWord = "";

        for (var i = 0; i < fun.length; i++) {
          var Chindex = Math.floor(Math.random() * letter.length);
          jumbledWord = jumbledWord + letter.charAt(Chindex);
          letter = letter.substr(0, Chindex) + letter.substr(Chindex + 1);
        }

        return jumbledWord;
      }
      const words = ["youtube", "games", "rayispog", "loveini", "bananaman"];
      const missingWordsStart = [
        "We no speak [WORD]",
        "The III [WORD]",
        "Listen here you little [WORD]",
        "[WORD] and dogs",
        "Never gonna [WORD] you up",
        "I am once again [WORD] for your financial support",
      ];
      const missingWordsEnd = [
        "americano",
        "project",
        "shit",
        "cats",
        "give",
        "asking",
      ];
      if ((await connect.fetch("cooldown", message.author.id)) === null) {
        await connect.add("cooldown", message.author.id);
      }
      const type = between(1, 3);
      const word = words[Math.floor(Math.random() * words.length)];
      const userCooldown = await connect.fetch("cooldown", message.author.id);
      if (userCooldown.workcool !== null) {
        const cooldown = new Date(userCooldown.workcool * 1000);
        const now = new Date();
        var DITC = cooldown.getTime() - now.getTime();
        const timeLeft = RM.pretty_ms;
        if (DITC.toString().includes("-")) {
        } else {
          m.edit({
            content: new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "**Error:** You are on cooldown! Time left:\n`" +
                  timeLeft(DITC) +
                  "`"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          });
          return await connect.end(true);
        }
      }
      await connect.updateCooldown(
        "cooldown",
        message.author.id,
        undefined,
        new Date(new Date().setTime(new Date().getTime() + 1 * 60 * 1000))
      );
      if (type === 1) {
        m.edit({
          content:
            "Quick! Type `" + word + "` as fast as you can! You have 5 seconds",
        });
        var filter2 = (m) => m.author.id === message.author.id;
        message.channel
          .awaitMessages(filter2, {
            max: 1,
            time: 50000,
            errors: ["time"],
          })
          .then(async (messageNext) => {
            messageNext = messageNext.first();
            const response = messageNext.content.toLowerCase();
            if (response.toLowerCase() === word.toLowerCase()) {
              const money = between(50, 100);
              const bal = await connect.fetch("currency", message.author.id);
              connect.update(
                "currency",
                message.author.id,
                parseInt(bal.amountw) + parseInt(money)
              );
              message.channel.send({
                content: "You got it! You win `$" + money + "`!",
              });
              return await connect.end(true);
            }
            message.channel.send({ content: "Ah! You failed." });
            await connect.end(true);
          })
          .catch(async () => {
            message.channel.send({ content: "Ah! You failed." });
            await connect.end(true);
          });
      } else if (type === 2) {
        const jumbledWord = WordJumble(word);
        m.edit({
          content:
            "Quick! Unscramble `" +
            jumbledWord +
            "` as fast as you can! You have 30 seconds",
        });
        var filter2 = (m) => m.author.id === message.author.id;
        message.channel
          .awaitMessages(filter2, {
            max: 1,
            time: 30000,
            errors: ["time"],
          })
          .then(async (messageNext) => {
            messageNext = messageNext.first();
            const response = messageNext.content.toLowerCase();
            if (response.toLowerCase() === word.toLowerCase()) {
              const money = between(50, 100);
              const bal = await connect.fetch("currency", message.author.id);
              connect.update(
                "currency",
                message.author.id,
                parseInt(bal.amountw) + parseInt(money)
              );
              message.channel.send({
                content: "You got it! You win `$" + money + "`!",
              });
              return await connect.end(true);
            }
            message.channel.send({ content: "Ah! You failed." });
            await connect.end(true);
          })
          .catch(async () => {
            message.channel.send({ content: "Ah! You failed." });
            await connect.end(true);
          });
      } else if (type === 3) {
        const num = Math.floor(Math.random() * missingWordsStart.length);
        const sentence = missingWordsStart[num];
        const missingWord = missingWordsEnd[num];

        m.edit({
          content:
            "Finish this sentence\n\n`" +
            sentence.replace("[WORD]", "___________") +
            "`\n\n15 seconds to solve",
        });
        var filter2 = (m) => m.author.id === message.author.id;
        message.channel
          .awaitMessages(filter2, {
            max: 1,
            time: 15000,
            errors: ["time"],
          })
          .then(async (messageNext) => {
            messageNext = messageNext.first();
            const response = messageNext.content.toLowerCase();
            if (response.toLowerCase() === missingWord.toLowerCase()) {
              const money = between(50, 100);
              const bal = await connect.fetch("currency", message.author.id);
              connect.update(
                "currency",
                message.author.id,
                parseInt(bal.amountw) + parseInt(money)
              );
              message.channel.send({
                content: "You got it! You win `$" + money + "`!",
              });
              return await connect.end(true);
            }
            message.channel.send({ content: "Ah! You failed." });
            await connect.end(true);
          })
          .catch(async () => {
            message.channel.send({ content: "Ah! You failed." });
            await connect.end(true);
          });
      }
    })
    .catch(async (e) => {
      console.log(e);
      message.channel.send({ content: "Error: " + e });
      await connect.end(true);
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
