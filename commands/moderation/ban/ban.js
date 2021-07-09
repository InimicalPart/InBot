const commandInfo = {
    "primaryName": "ban",
    "possibleTriggers": ["ban"],
    "help": "Allows an admin to ban a member.",
    "aliases": [],
    "usage": "[COMMAND] <user/user id> [reason]", // [COMMAND] gets replaced with the command and correct prefix later
    "category": "mod"
}

async function runCommand(message, args, RM) {
    const {
        MessageEmbed
    } = RM.Discord;
    const db = RM.db;
    try {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You need permission [BAN_MEMBERS] to be able to ban users.");
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("I need permission [BAN_MEMBERS] to be able to ban users.");
        if (!args[0]) return message.channel.send("Provide a user that you want to ban.")

        const banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!banMember) return message.channel.send("That user is not in the server");
        if (banMember === message.member) return message.channel.send("You can't ban yourself.")

        var reason = args.slice(1).join(" ");

        if (!banMember.bannable) return message.channel.send("I cannot ban that user")
        try {

            message.guild.members.ban(banMember, {
                days: 7,
                reason: reason
            })
            banMember.send(`You have been banned from **${message.guild.name}** for '${reason || "No Reason"}'`).catch(() => null) // user probably has dms closed
        } catch {
            message.guild.members.ban(banMember, {
                days: 7,
                reason: reason
            }).catch(() => null)
        }
        if (reason) {
            var sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`**${banMember.user.username}** has been banned for ${reason}`)
            message.channel.send(sembed)
        } else {
            var sembed2 = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`**${banMember.user.username}** has been banned`)
            message.channel.send(sembed2)
        }
        let channel = db.fetch(`modlog_${message.guild.id}`)
        if (channel == null) return;

        if (!channel) return;

        const embed = new MessageEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .setColor("GREEN")
            .setThumbnail(banMember.user.displayAvatarURL({
                dynamic: true
            }))
            .setFooter(message.guild.name, message.guild.iconURL())
            .addField("**Action**", "ban")
            .addField("**Banned User**", banMember.user.username)
            .addField("**ID**", `${banMember.id}`)
            .addField("**Banned By**", message.author.username)
            .addField("**Reason**", `${reason || "**No Reason**"}`)
            .addField("**Date**", message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)
    } catch (e) {
        console.log(e)
        return message.channel.send(`**${e.message}**`)
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
    commandCategory
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