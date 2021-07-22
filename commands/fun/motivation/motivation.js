const commandInfo = {
    "primaryName": "motivate",
    "possibleTriggers": ["motivation", "motivate"],
    "help": "Sends an inspirational quote.",
    "aliases": ["motivation"],
    "usage": "[COMMAND] [user]", // [COMMAND] gets replaced with the command and correct prefix later
    "category": "fun"
}

async function runCommand(message, args, RM) {

    if (!require("../../../config.js").cmdMotivation) {
        return message.channel.send(new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setDescription(
                "Command disabled by Administrators."
            )
            .setThumbnail(message.guild.iconURL())
            .setTitle("Command Disabled")
        )
    }

    const Discord = RM.Discord;
    const client = RM.client;
    const jsonQuotes = require('../../../resources/motivational.json')

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

    const randomQuote = jsonQuotes.quotes[Math.floor((Math.random() * jsonQuotes.quotes.length))];
    if (!args[0]) {
        const quoteEmbed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setTitle(randomQuote.author)
            .setDescription(randomQuote.text)
            .setColor('GREEN')
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setTimestamp()
        return message.channel.send(quoteEmbed);
    } else if (args[0]) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor("GREEN")
            .setTitle(`${randomQuote.author} -`)
            .setDescription(`**${randomQuote.text}** \n\nBy ${message.member.displayName} to ${member.displayName}`)
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setTimestamp()
        message.channel.send(embed)
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

