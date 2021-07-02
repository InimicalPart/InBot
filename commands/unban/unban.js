const commandInfo = {
    "possibleTriggers": ["unban"],
    "help": "`.unban`: pretty self explanatory"
}

async function runCommand(message, args, RM) {
    const {
        MessageEmbed
    } = RM.Discord;
    const db = RM.db;



    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("**You Dont Have The Permissions To Unban Someone! - [BAN_MEMBERS]**")

    if (!args[0]) return message.channel.send("**Please Enter A Name!**")

    let bannedMemberInfo = await message.guild.fetchBans()

    let bannedMember;
    bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
    if (!bannedMember) return message.channel.send("**Please Provide A Valid Username, Tag Or ID Or The User Is Not Banned!**")

    let reason = args.slice(1).join(" ")

    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("**I Don't Have Permissions To Unban Someone! - [BAN_MEMBERS]**")
    try {
        if (reason) {
            message.guild.members.unban(bannedMember.user.id, reason)
            var sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`**${bannedMember.user.tag} has been unbanned for ${reason}**`)
            message.channel.send(sembed)
        } else {
            message.guild.members.unban(bannedMember.user.id, reason)
            var sembed2 = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`**${bannedMember.user.tag} has been unbanned**`)
            message.channel.send(sembed2)
        }
    } catch {

    }

    let channel = db.fetch(`modlog_${message.guild.id}`)
    if (!channel) return;

    let embed = new MessageEmbed()
        .setColor("#ff0000")
        .setThumbnail(bannedMember.user.displayAvatarURL({
            dynamic: true
        }))
        .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
        .addField("**Moderation**", "unban")
        .addField("**Unbanned**", `${bannedMember.user.username}`)
        .addField("**ID**", `${bannedMember.user.id}`)
        .addField("**Moderator**", message.author.username)
        .addField("**Reason**", `${reason}` || "**No Reason**")
        .addField("**Date**", message.createdAt.toLocaleString())
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

    var sChannel = message.guild.channels.cache.get(channel)
    if (!sChannel) return;
    sChannel.send(embed)

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

console.log("[I] UNBAN initialized [I]")
/* */
/* */
/* */
/* */
/* */
/* */ /* */ /* */
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
/* */
/* */ /* */ /* */ /* */