const commandInfo = {
  primaryName: "convert", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["convert", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
};
function getOrdinalNum(n) {
  return (
    n +
    (n > 0
      ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : "")
  );
}
const DateFormatter = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  formatDate: function (e, t) {
    var r = this;
    return (
      (t = r.getProperDigits(t, /d+/gi, e.getUTCDate())),
      (t = (t = r.getProperDigits(t, /M+/g, e.getUTCMonth() + 1)).replace(
        /y+/gi,
        function (t) {
          var r = t.length,
            g = e.getUTCFullYear();
          return 2 == r ? (g + "").slice(-2) : 4 == r ? g : t;
        }
      )),
      (t = r.getProperDigits(t, /H+/g, e.getUTCHours())),
      (t = r.getProperDigits(t, /h+/g, r.getHours12(e.getUTCHours()))),
      (t = r.getProperDigits(t, /m+/g, e.getUTCMinutes())),
      (t = (t = r.getProperDigits(t, /s+/gi, e.getUTCSeconds())).replace(
        /a/gi,
        function (t) {
          var g = r.getAmPm(e.getUTCHours());
          return "A" === t ? g.toUpperCase() : g;
        }
      )),
      (t = r.getFullOr3Letters(t, /d+/gi, r.dayNames, e.getUTCDay())),
      (t = r.getFullOr3Letters(t, /M+/g, r.monthNames, e.getUTCMonth()))
    );
  },
  getProperDigits: function (e, t, r) {
    return e.replace(t, function (e) {
      var t = e.length;
      return 1 == t ? r : 2 == t ? ("0" + r).slice(-2) : e;
    });
  },
  getHours12: function (e) {
    return (e + 24) % 12 || 12;
  },
  getAmPm: function (e) {
    return e >= 12 ? "pm" : "am";
  },
  getFullOr3Letters: function (e, t, r, g) {
    return e.replace(t, function (e) {
      var t = e.length;
      return 3 == t ? r[g].substr(0, 3) : 4 == t ? r[g] : e;
    });
  },
};
async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdConvert) {
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
  if (!args[0]) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("You need to specify the type to convert.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Command Specified"),
      ],
    });
  }
  if (!args[1]) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("You need to specify the value to convert.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Value Specified"),
      ],
    });
  }
  var value = parseInt(args[1]);
  var result = "";
  switch (args[0].toLowerCase()) {
    case "epocht":
      result = DateFormatter.formatDate(new Date(value), "HH:mm:ss UTC");
      break;
    case "epochd":
      result = DateFormatter.formatDate(new Date(value), `MMMM ????, YYYY UTC`);
      result = result.replace("????", getOrdinalNum(new Date(value).getDate()));
      break;
    case "epoch":
      result = DateFormatter.formatDate(
        new Date(value),
        `MMMM ????, YYYY HH:mm:ss A UTC`
      );
      result = result.replace(
        "????",
        getOrdinalNum(new Date(value).getUTCDate())
      );
      break;
    default:
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("Unknown type.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Unknown Type"),
        ],
      });
  }
  return message.channel.send({
    embeds: [
      new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setDescription("```" + result + "```")
        .setThumbnail(message.guild.iconURL())
        .setTitle("Converted"),
    ],
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
