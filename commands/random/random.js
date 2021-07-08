const commandInfo = {
	"primaryName": "random",
	"possibleTriggers": ["random", "r"],
	"help": "Gets a random III image",
	"aliases": ["r"],
	"usage": "[COMMAND]" // [COMMAND] gets replaced with the command and correct prefix later
}

async function runCommand(message, args, RM) {
	const Discord = RM.Discord;
	const setImageLinks = RM.setImageLinks
	const randomLink = setImageLinks[Math.floor(Math.random() * setImageLinks.length)]
	const embed = new Discord.MessageEmbed()
		.setTitle("Random III Image")
		.setColor("RANDOM")
		.setImage(randomLink)
		.setTimestamp(new Date())
		.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
	message.channel.send(embed);

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

console.log("[I] RANDOM initialized [I]")
/* */
/* */
/* */ /* */ /* */ /* */ /* */ /* */
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
/* */ /* */ /* */ /* */ /* */ /* */ /* */