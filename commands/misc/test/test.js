const commandInfo = {
	"primaryName": "ping",
	"possibleTriggers": ["ping", "test"],
	"help": "Checks the latency of the bot and the discord API and the bot uptime.",
	"aliases": ["test"],
	"usage": "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "misc"
}
async function runCommand(message, args, RM) {
	if (!require("../../../config.js").cmdTest) {
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

	//assign Discord from RM
	const Discord = RM.Discord;
	let a
	const client = RM.client;
	const prettyMilliseconds = RM.pretty_ms;
	const pinging = new RM.Discord.MessageEmbed()
		.setDescription("Pinging...  :ping_pong:")
	message.channel.send(pinging).then((m) => {
		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription(`<:bitelip:857350270513971221> | Latency is \`${m.createdTimestamp - message.createdTimestamp}ms\` and API Latency is \`${Math.round(client.ws.ping)}ms\`, Bot has been up for: \`${prettyMilliseconds(client.uptime)}\``)
		m.edit(embed);
	}).catch(async (err) => {
		console.log(err)
		message.channel.send("Error: " + err)
	})
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