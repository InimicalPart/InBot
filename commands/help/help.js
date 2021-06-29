const commandInfo = {
	"possibleTriggers": ["help", "h", "?"],
	"help": "`.help`: uhhh... help helps you get the needed help. Aliases: `.h`, `.?`"
}

async function runCommand(message, args, RM) {
	console.log(args[0])
	for (let i in RM) {
		if (i.startsWith("cmd")) {
			let k = RM[i]
			if (k.commandAlias().includes(args[0])) {
				message.channel.send(k.commandHelp())
			}
		}
	}
}
function commandAlias() {
	return commandInfo.possibleTriggers;
}
function commandHelp() {
	return commandInfo.help;
}
module.exports = { runCommand, commandAlias, commandHelp }

console.log("[I] HELP initialized [I]")

/* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /*
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
*/ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */