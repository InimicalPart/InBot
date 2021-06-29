const commandInfo = {
    "possibleTriggers": ["calc", "math", "calculate"],
    "help": "`.calculate: will calculate a math equation that you input eg. `.calc 2+2`\nAliases: .calc, .math"
}

async function runCommand(message, args, RM) {
    const Discord = RM.Discord;
    const client = RM.client;
    const math = require("mathjs");
    require("discord-reply")

    if (!args[0]) return message.lineReply("**Enter Something To Calculate**");

    let result;
    try {
        result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
    } catch (e) {
        return message.lineReply("**Enter Valid Calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**");
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
    console.log("calc used")

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

console.log("[I] CALCULATE initialized [I]")