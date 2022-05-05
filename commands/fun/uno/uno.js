const commandInfo = {
  primaryName: "uno", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["uno"], // These are all commands that will trigger this command.
  help: "Creates a game of UNO!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
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
  class Player {
    constructor() {
      this.hand = [];
      this.uno = false;
      this.id = null;
    }
  }
  class Card {
    constructor(name) {
      this.name = name;
      this.replacement = "";
      this.img_path = "";
      if (name) {
        this.replacement = cards[name].replacement;
        this.img_path = cards[name].img_path;
      }
    }
  }
  const cards = {
    blue: {},
    green: {},
    red: {},
    /* prettier-ignore */
    special:{"DRAW_FOUR":{"replacement":"DR4","img_path":"./assets/uno/draw4.png"},"RED_DRAW_FOUR":{"replacement":"DR4R","img_path":"./assets/uno/red_draw4.png"},"BLUE_DRAW_FOUR":{"replacement":"DR4B","img_path":"./assets/uno/blue_draw4.png"},"YELLOW_DRAW_FOUR":{"replacement":"DR4Y","img_path":"./assets/uno/yellow_draw4.png"},"GREEN_DRAW_FOUR":{"replacement":"DR4G","img_path":"./assets/uno/green_draw4.png"},"WILD":{"replacement":"W","img_path":"./assets/uno/wild.png"},"RED_WILD":{"replacement":"WR","img_path":"./assets/uno/red_wild.png"},"BLUE_WILD":{"replacement":"WB","img_path":"./assets/uno/blue_wild.png"},"YELLOW_WILD":{"replacement":"WY","img_path":"./assets/uno/yellow_wild.png"},"GREEN_WILD":{"replacement":"WG","img_path":"./assets/uno/green_wild.png"}},
    yellow: {},
  };
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
