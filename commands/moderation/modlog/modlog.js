const commandInfo = {
    "primaryName": "setm",
    "possibleTriggers": ['setm', 'sm', 'smc'],
    "help": "Allows admins to set a channel where the bot can send moderation logs.",
    "aliases": ["sm", "smc"],
    "usage": "[COMMAND] <channel>" // [COMMAND] gets replaced with the command and correct prefix later
}

async function runCommand(message, args, RM) {
    const client = RM.client;
    const db = RM.db;

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")
    if (!args[0]) {
        let b = await db.fetch(`modlog_${message.guild.id}`);
        let channelName = message.guild.channels.cache.get(b);
        if (message.guild.channels.cache.has(b)) {
            return message.channel.send(
                `**Modlog Channel Set In This Server Is \`${channelName.name}\`!**`
            );
        } else
            return message.channel.send(
                "**Please Enter A Channel Name or ID To Set!**"
            );
    }
    let channel = message.mentions.channels.first() || client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

    if (!channel || channel.type !== 'text') return message.channel.send("**Please Enter A Valid Text Channel!**");

    try {
        let a = await db.fetch(`modlog_${message.guild.id}`)

        if (channel.id === a) {
            return message.channel.send("**This Channel is Already Set As Modlog Channel!**")
        } else {
            client.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send("**Modlog Channel Set!**")
            db.set(`modlog_${message.guild.id}`, channel.id)

            message.channel.send(`**Modlog Channel Has Been Set Successfully in \`${channel.name}\`!**`)
        }
    } catch (e) {
        message.channel.send(e.message) // catch {
        // return message.channel.send("**Error - `Missing Permissions Or Channel Is Not A Text Channel!`**");
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
module.exports = {
    runCommand,
    commandTriggers,
    commandHelp,
    commandAliases,
    commandPrim,
    commandUsage
}


/* */
/* */
/* */
/* */
/* */ /* */ /* */ /* */
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
/* */ /* */ /* */ /* */ /* */