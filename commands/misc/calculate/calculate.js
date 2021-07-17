const commandInfo = {
    "primaryName": "calculate",
    "possibleTriggers": ["calc", "math", "calculate"],
    "help": "Calculate a math equation that you input.",
    "aliases": ["math", "calc"],
    "usage": "[COMMAND] <math equation>", // [COMMAND] gets replaced with the command and correct prefix later
    "category": "misc"
}

async function runCommand(message, args, RM) {
    if (!require("../../../config.js").cmdCalculate) {
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
    const math = RM.math


    if (!args[0]) return message.lineReply("**Please provide an equation**");

    let result;
    try {
        result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
    } catch (e) {
        return message.lineReply("**Invalid Calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**");
    }

    let embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`${client.user.username} Calculator`, message.author.displayAvatarURL({
            dynamic: true
        }))
        .addField("**Operation**", `\`\`\`Js\n${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/")}\`\`\``)
        .addField("**Result**", `\`\`\`Js\n${result}\`\`\``)
        .setFooter(message.guild.name, message.guild.iconURL());
    message.lineReply(embed);

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

