const commandInfo = {
	"possibleTriggers": ["ping", "test"],
	"help": "`.ping`: Checks the latency of the bot and the discord API and the bot uptime\nAliases: `.test`"
}

async function runCommand(message, args, RM) {

	const Discord = RM.Discord;
	const client = RM.client;
	const prettyMilliseconds = RM.pretty_ms;
	message.channel.send("Pinging...  :ping_pong:").then((m) => {
		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription(`<:bitelip:857350270513971221> | Latency is \`${m.createdTimestamp - message.createdTimestamp}ms\` and API Latency is \`${Math.round(client.ws.ping)}ms\`, Bot has been up for: \`${prettyMilliseconds(client.uptime)}\``)
		m.edit(embed);
	})
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

console.log("[I] TEST initialized [I]")
/* */
/* */ /* */ /* */ /* */ /* */ /* */ /* */
/*
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
*/
/* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */