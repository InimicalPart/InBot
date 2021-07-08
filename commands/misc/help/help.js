const commandInfo = {
	"primaryName": "help",
	"possibleTriggers": ["help", "h", "?"],
	"help": "Help allows you to get information about a command.",
	"aliases": ["h", "?"],
	"usage": "[COMMAND] [command]" // [COMMAND] gets replaced with the command and correct prefix later
}

async function runCommand(message, args, RM) {
	for (let i in RM) {
		if (i.startsWith("cmd")) {
			let k = RM[i]
			if (k.commandTriggers().includes(args[0])) {
				const prefix = RM.process_env.prefix
				let aliases;
				let description;
				if (k.commandAliases().length < 1) {
					aliases = "No aliases."
				} else {
					aliases = '`' + prefix + k.commandAliases().join("` | `" + prefix) + "`"
				}
				if (k.commandHelp() == "") {
					description = "No description."
				} else {
					description = k.commandHelp()
				}
				const embed = new RM.Discord.MessageEmbed()
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription("Command: **" + k.commandPrim().toUpperCase() + "**")
					.addFields({
						name: "Description",
						value: description
					})
					.addFields({
						name: "Usage",
						value: k.commandUsage().replace("[COMMAND]", prefix + args[0])
					})
					.addFields({
						name: "Aliases",
						value: aliases
					})
					.setTimestamp()
				return message.channel.send(embed)
			}
		}
	}
	message.channel.send(new RM.Discord.MessageEmbed().setDescription("Command was not found."))
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