const commandInfo = {
    "primaryName": "dbdc", // This is the command name used by help.js (gets uppercased).
    "possibleTriggers": [
        "dbdc", "enddb", "dbr"
    ], // These are all commands that will trigger this command.
    "help": "disconnects from database", // This is the general description pf the command.
    "aliases": [
        "dbr", "enddb"
    ], // These are command aliases that help.js will use
    "usage": "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
    "category": "music"
}

async function runCommand(message, args, RM) { // Check if command is disabled
    const mongoose = require('mongoose');
    const db = require('mongodb')
    const client = RM.client
    if (!require("../../../config.js").cmdRestart) {
        return message.channel.send(new RM.Discord.MessageEmbed().setColor("RED").setAuthor(message.author.tag, message.author.avatarURL()).setDescription("Command disabled by Administrators.").setThumbnail(message.guild.iconURL()).setTitle("Command Disabled"))
    }

    if (! RM.botOwners) 
        return;
    
    setTimeout(function () {
        mongoose.connection.close()
        message.channel.send(new RM.Discord.MessageEmbed().setColor("GREEN").setAuthor(message.author.tag, message.author.avatarURL()).setDescription("all sessions ended").setThumbnail(message.guild.iconURL()).setTitle("Successfully ended connections"))
    }, 1000)


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
    commandCategory
}


/* */
/* */
/* */
/* */
/* */
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
/* */
/* */
/* */
/* */
/* */
/* */
