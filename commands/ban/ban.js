const commandInfo = {
    "possibleTriggers": ["ban"],
    "help": "`.ban`: well you know the rest"
}

async function runCommand(message, args, RM) {
    const {
        MessageEmbed
    } = RM.Discord;
    const db = RM.db;

    try {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("**You Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**");
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("**I Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**");
        if (!args[0]) return message.channel.send("**Please Provide A User To Ban!**")

        let banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!banMember) return message.channel.send("**User Is Not In The Guild**");
        if (banMember === message.member) return message.channel.send("**You Cannot Ban Yourself**")

        var reason = args.slice(1).join(" ");

        if (!banMember.bannable) return message.channel.send("**Cant Ban That User**")
        try {
            banMember.send(`**Hello, You Have Been Banned From ${message.guild.name} for - ${reason || "No Reason"}**`).then(() =>
                message.guild.members.ban(banMember, {
                    days: 7,
                    reason: reason
                })).catch(() => null)
        } catch {
            message.guild.members.ban(banMember, {
                days: 7,
                reason: reason
            })
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
            .addField("**Moderation**", "ban")
            .addField("**Banned**", banMember.user.username)
            .addField("**ID**", `${banMember.id}`)
            .addField("**Banned By**", message.author.username)
            .addField("**Reason**", `${reason || "**No Reason**"}`)
            .addField("**Date**", message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send(embed)
    } catch (e) {
        return message.channel.send(`**${e.message}**`)
    }

}

function commandAlias() {
    return commandInfo.possibleTriggers;
}

function commandHelp() {
    return commandInfo.help;
}
module.exports = {
    runCommand,
    commandAlias,
    commandHelp
}

console.log("[I] BAN initialized [I]")
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
"cmd<cmdname>.commandAlias()"

To call the command, from index.js call
"cmd<cmdname>.runCommand(message, arguments, requiredModules);"

To check if possible triggers has the command call
"cmd<cmdname>.commandAlias().includes(command)"

------------------[Instruction]------------------
*/
/* */
/* */
/* */
/* */ /* */ /* */ /* */ /* */