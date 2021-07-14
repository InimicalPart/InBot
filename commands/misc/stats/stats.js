const commandInfo = {
	"primaryName": "stats", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["stats", "statistics"], // These are all commands that will trigger this command.
	"help": "Get bot statistics and information", // This is the general description pf the command.
	"aliases": ["statistics"], // These are command aliases that help.js will use
	"usage": "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "misc"
}

async function runCommand(message, args, RM) {

	//general stats
	const Discord = RM.Discord;
	const client = RM.client;
	const prettyMilliseconds = RM.pretty_ms;
	let latency = null;
	let apilatency = Math.round(client.ws.ping)
	let botuptime = prettyMilliseconds(client.uptime)
	let GAPI = null;
	let GAPI2 = null;
	let GAPI3 = null;
	let GAPI4 = null;
	let GAPI5 = null;
	let GAPI6 = null;
	let GAPI7 = null;
	let GAPI8 = null;
	let GAPI9 = null;
	let GAPI10 = null;
	let GENIUSAPI = null;

	if (RM.process_env.GAPI !== ("" || null || undefined)) {
		GAPI = "[LOADED]"
	} else {
		GAPI = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI2 !== ("" || null || undefined)) {
		GAPI2 = "[LOADED]"
	} else {
		GAPI2 = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI3 !== ("" || null || undefined)) {
		GAPI3 = "[LOADED]"
	} else {
		GAPI3 = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI4 !== ("" || null || undefined)) {
		GAPI4 = "[LOADED]"
	} else {
		GAPI4 = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI5 !== ("" || null || undefined)) {
		GAPI5 = "[LOADED]"
	} else {
		GAPI5 = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI6 !== ("" || null || undefined)) {
		GAPI6 = "[LOADED]"
	} else {
		GAPI6 = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI7 !== ("" || null || undefined)) {
		GAPI7 = "[LOADED]"
	} else {
		GAPI7 = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI8 !== ("" || null || undefined)) {
		GAPI8 = "[LOADED]"
	} else {
		GAPI8 = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI9 !== ("" || null || undefined)) {
		GAPI9 = "[LOADED]"
	} else {
		GAPI9 = "[NOT LOADED]"
	}
	if (RM.process_env.GAPI10 !== ("" || null || undefined)) {
		GAPI10 = "[LOADED]"
	} else {
		GAPI10 = "[NOT LOADED]"
	}
	if (RM.process_env.GENIUSAPI !== ("" || null || undefined)) {
		GENIUSAPI = "[LOADED]"
	} else {
		GENIUSAPI = "[NOT LOADED]"
	}
	const pinging = new RM.Discord.MessageEmbed()
		.setDescription("Pinging...  :ping_pong:")
	message.channel.send(pinging).then((m) => {
		latency = m.createdTimestamp - message.createdTimestamp
		let embed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL())
			.addFields({
				name: "Basic Info",
				value: `Latency: **${latency}**ms\nAPI Latency: **${apilatency}**ms\nBot Uptime: **${botuptime}**`
			})
			.addFields({
				name: "APIs",
				value: `GOOGLE API 1: **${GAPI}**\nGOOGLE API 2: **${GAPI2}**\nGOOGLE API 3: **${GAPI3}\n**GOOGLE API 4: **${GAPI4}**\nGOOGLE API 5: **${GAPI5}**\nGOOGLE API 6: **${GAPI6}**\nGOOGLE API 7: **${GAPI7}**\nGOOGLE API 8: **${GAPI8}**\nGOOGLE API 9: **${GAPI9}**\nGOOGLE API 10: **${GAPI10}**\nGENIUS API: **${GENIUSAPI}**\n`
			})
			.addFields({
				name: "Miscellaneous",
				value: `Commands Used: **${global.commandsUsed}**`
			})
		m.edit(embed)
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