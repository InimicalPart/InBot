const commandInfo = {
	"primaryName": "config",
	"possibleTriggers": ["config", "c"],
	"help": "Allows admins to change the server config.",
	"aliases": ["c"],
	"usage": "[COMMAND] <config name> [new value]" // [COMMAND] gets replaced with the command and correct prefix later
}

async function runCommand(message, args, RM) {
	const botOwners = RM.botOwners;
	if (!botOwners.includes(message.author.id)) return;
	let config
	try {
		config = require("../../../config")
	} catch (e) {
		var gline = null
		try {
			var caller_line = e.stack.split("\n")[1].toString().match(/:[0-9]+:/).toString().replace(/:/g, "");
		} catch (e) {
			var fs = require('fs')
			const path = require("path")
			const data = fs.readFileSync(path.join(__dirname, 'config.js.TEMPLATE'), { encoding: 'utf8', flag: 'r' });
			const newData = data
			fs.writeFileSync(path.join(__dirname, '../../config.js'), newData);
			return message.channel.send("config.js required a full restore.")
		}
		message.channel.send("There was an error in config.js, the line number is: " + caller_line + ". It contains:")
		count = 0
		const wantedPath = require("path").join(__dirname, "../../config.js")
		require('fs').createReadStream(wantedPath).on('data', function (chunk) {
			for (i = 0; i < chunk.length; ++i)
				if (chunk[i] == 10) count++;
		}).on('end', async function () {
			const data = require('fs').readFileSync(wantedPath, 'UTF-8');

			// split the contents by new line
			const lines = data.split(/\r?\n/);

			// print all lines
			let curLine = 0
			lines.forEach((line) => {
				curLine++;
				if (curLine == caller_line) { message.channel.send(line); message.channel.send("Do you want to restore the line? (yes/no)"); gline = line }
			});
		});
		var filter2 = m => m.author.id === message.author.id
		message.channel.awaitMessages(filter2, {
			max: 1,
			time: 30000,
			errors: ['time']
		}).then(messageNext => {
			messageNext = messageNext.first()
			if (messageNext.content.toLowerCase() == "no") {
				return message.channel.send("Ok.")
			} else if (messageNext.content.toLowerCase() == "yes") {
				var start = gline.split(" ")[0]
				const data = require('fs').readFileSync(require("path").join(__dirname, '../../config.js'), { encoding: 'utf8', flag: 'r' });
				var newData = data.replace(gline, start + " = 'RESTORED';")
				require('fs').writeFileSync(require("path").join(__dirname, '../../config.js'), newData);
				require('fs').createReadStream(wantedPath).on('data', function (chunk) {
					for (i = 0; i < chunk.length; ++i)
						if (chunk[i] == 10) count++;
				}).on('end', async function () {
					const data = require('fs').readFileSync(wantedPath, 'UTF-8');

					// split the contents by new line
					const lines = data.split(/\r?\n/);

					// print all lines
					let curLine = 0
					lines.forEach((line) => {
						curLine++;
						if (curLine == caller_line) { message.channel.send(line); gline = line }
					});
				});
				message.channel.send("Alright. The line is now:\n" + gline)
			} else {
				return message.channel.send("Sorry, I didn't catch that. Cancelling.")
			}
		}).catch((e) => {
			console.log(e)
			return message.channel.send("Time limit reached. Canceling.")
		});;
		return
	}
	if (!args[0]) {
		return message.channel.send("Please provide the config name to change/see")
	} else if (!args[1]) {
		const configName = args[0]
		if (configName === "su") {
			return message.channel.send("`showUsers` current value: `" + config.showUsers + "`")
		}
	}
	const configName = args[0]
	const configValue = args.slice(1)
	if (configName === "su") {
		let cline = config.showUsers
		if (cline == "") cline = "EMPTY"
		message.channel.send(`showUsers is selected.\nCurrent value: ${cline}`)
		let oldVal = config.showUsers
		if (typeof oldVal == "string") {
			oldVal = "\"" + oldVal + "\""
		}
		config.showUsers = configValue
		var fs = require('fs')
		const path = require("path")
		const data = fs.readFileSync(path.join(__dirname, '../../config.js'), { encoding: 'utf8', flag: 'r' });
		const newData = data.replace(`showUsers = ${oldVal}`, `showUsers = ${configValue}`);
		fs.writeFileSync(path.join(__dirname, '../../config.js'), newData);
		const verifyData = fs.readFileSync(path.join(__dirname, '../../config.js'), { encoding: 'utf8', flag: 'r' });
		if (verifyData.includes("showUsers = " + oldVal)) {
			if (typeof oldVal == "string") {
				oldVal = "'" + oldVal + "'"
				const data = fs.readFileSync(path.join(__dirname, '../../config.js'), { encoding: 'utf8', flag: 'r' });
				const newData = data.replace(`showUsers = ${oldVal}`, `showUsers = ${configValue}`);
				fs.writeFileSync(path.join(__dirname, '../../config.js'), newData);
			}
		}
		message.channel.send(`showUsers was changed. New value: ${config.showUsers}`)

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
module.exports = {
	runCommand,
	commandTriggers,
	commandHelp,
	commandAliases,
	commandPrim,
	commandUsage
}



/* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /*
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
*/ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */