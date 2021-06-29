const commandInfo = {
    "possibleTriggers": ["diss", "attack", "roast"],
    "help": "`.roast: should end your opponents career\nAliases: .diss, .attack"
}

async function runCommand(message, args, RM) {
    const Discord = RM.Discord;
    const client = RM.client;
    const roasts = require('../../JSON/roast.json');

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());

    let roast = roasts.roast[Math.floor((Math.random() * roasts.roast.length))];

    if(!args[0]) {
        const sembed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor("GREEN")
            .setDescription("**You Can't Roast Yourself**")
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
        message.channel.send(sembed);
    }
    else if (args[0]) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setTitle(`${message.author.username}-`)
            .setColor("GREEN")
            .setDescription(`${roast}`)
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setTimestamp()
        message.channel.send(embed);
    }
    console.log(roasts)
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

console.log("[I] ROAST initialized [I]")