const commandInfo = {
	"primaryName": "daily", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["daily"], // These are all commands that will trigger this command.
	"help": "Claim your daily gift!", // This is the general description of the command.
	"aliases": [], // These are command aliases that help.js will use
	"usage": "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdDaily) {
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
	message.channel.send(new RM.Discord.MessageEmbed().setDescription("<a:loading:869354366803509299> *Working on it...*")).then(async (m) => {
		const { connect } = require("../../../databasec")
		await connect()
		await connect.create("currency")
		await connect.create("cooldown")

		if (await connect.fetch("currency", message.author.id) == null) {
			await connect.add("currency", message.author.id)
		}

		if (await connect.fetch("cooldown", message.author.id) == null) {
			await connect.add("cooldown", message.author.id)
		}
		let data = await connect.fetch("cooldown", message.author.id)
		const dailyCool = data.dailycool
		if (dailyCool !== null) {
			const cooldown = new Date(dailyCool * 1000)
			const now = new Date()
			var DITC = cooldown.getTime() - now.getTime();
			const timeLeft = RM.pretty_ms;
			if (DITC.toString().includes("-")) { } else {
				m.edit(new RM.Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"**Error:** You are on cooldown! Time left:\n`" + timeLeft(DITC) + "`"
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Error")
				)
				return await connect.end(true)
			}
		}
		await connect.updateCooldown("cooldown", message.author.id, undefined, undefined, undefined, undefined, new Date(new Date().setTime(new Date().getTime() + (24 * 60 * 60 * 1000))))
		let data2 = await connect.fetch("currency", message.author.id)
		const authorBal = data2.amountw
		await connect.update("currency", message.author.id, authorBal + 5000)
		m.edit(new RM.Discord.MessageEmbed()
			.setColor("GREEN")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
				"**Success:** You have been given 5000 coins!"
			)
			.setThumbnail(message.guild.iconURL())
			.setTitle("Success")
		)
		await connect.end(true)
	}).catch(async (err) => {
		console.log(err)
		message.channel.send("Error: " + err)
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