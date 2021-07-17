const commandInfo = {
	"primaryName": "roast",
	"possibleTriggers": ["roast", "attack", "diss"],
	"help": "Roast your friends.\n⚠ +18 ⚠",
	"aliases": ["attack", "diss"],
	"usage": "[COMMAND] <user>", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "fun"
}

function between(lower, upper) {
	var scale = upper - lower + 1;
	return Math.floor(lower + Math.random() * scale);
}
async function runCommand(message, args, RM) {
	console.log(process.cwd())
	if (!require("../../../config.js").cmdRoast) {
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
	const time = new Date();
	var i;
	var count = 1;
	const cantRoastSelfMsgs = [
		"You cannot roast yourself",
		"Why are you roasting yourself?",
		"Roast someone, not yourself!",
		"We know you have enemies, roast them!",
		"Roasting yourself is not an option to decrease your insecurity. Quite the opposite in fact.",
		"I won't roast you. You are my good friend :)"
	]
	var linesInRoasts;
	if (!args[0]) {
		const a = new RM.Discord.MessageEmbed()
			.setAuthor(message.guild.name, message.guild.iconURL())
			.setColor("RANDOM")
			.setDescription("**" + cantRoastSelfMsgs[Math.floor(Math.random() * cantRoastSelfMsgs.length)] + "**")
			.setTimestamp()
			.setFooter(message.author.username, message.author.avatarURL())
		message.channel.send(a)
	} else {
		const roastedUser = args.join(" ")
		if (roastedUser.includes(RM.client.user.id) || roastedUser.toLowerCase().includes(RM.client.user.username.toLowerCase())) return message.channel.send("ay ay ay. Roast someone that's not ME")
		if (roastedUser.includes(message.author.id) || roastedUser.toLowerCase().includes(message.author.username.toLowerCase().replace(/[^\u0000-\u007F]/g, "").trimEnd())) {
			const a = new RM.Discord.MessageEmbed()
				.setAuthor(message.guild.name, message.guild.iconURL())
				.setColor("RANDOM")
				.setDescription("**" + cantRoastSelfMsgs[Math.floor(Math.random() * cantRoastSelfMsgs.length)] + "**")
				.setTimestamp()
				.setFooter(message.author.username, message.author.avatarURL())
			return message.channel.send(a)
		}

		try {
			// read contents of the file
			require('fs').createReadStream("./resources/roasts.txt").on('data', function (chunk) {
				for (i = 0; i < chunk.length; ++i)
					if (chunk[i] == 10) count++;
			}).on('end', async function () {
				const wantedLine = between(1, count)
				const data = require('fs').readFileSync('./resources/roasts.txt', 'UTF-8');

				// split the contents by new line
				const lines = data.split(/\r?\n/);

				// print all lines
				let curLine = 0
				lines.forEach((line) => {
					curLine++;
					if (curLine == wantedLine) message.channel.send(roastedUser + ", " + line);
				});
			});

		} catch (err) {
			message.channel.send("Error! " + err.message)
		}
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