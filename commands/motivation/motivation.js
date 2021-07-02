const commandInfo = {
    "possibleTriggers": ["motivation", "motivate"],
    "help": "`.motivate <@user>`: sends an inspirational quote\nAliases: `.motivation`"
}

async function runCommand(message, args, RM) {
    const Discord = RM.Discord;
    const client = RM.client;
    const jsonQuotes = require('../../resources/motivational.json')

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

console.log("[I] MOTIVATION initialized [I]")