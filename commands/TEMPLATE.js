const commandInfo = {
	"possibleTriggers": ["command1", "alias2", "alias3"]
}

async function runCommand(message, args, RM) {

	// cmd stuff here

}
function commandAlias() {
	return commandInfo.possibleTriggers;
}
module.exports = { runCommand, commandAlias }

console.log("[I] <command name> initialized [I]")
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