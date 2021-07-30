const commandInfo = {
	"primaryName": "buy", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["buy", "alias2", "alias3"], // These are all commands that will trigger this command.
	"help": "eats your cake!", // This is the general description of the command.
	"aliases": ["alias2", "alias3"], // These are command aliases that help.js will use
	"usage": "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdBuy) {
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
		await connect.create("inventory")
		await connect.create("currency")

		if (!args[0]) {
			await connect.end(true)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"I can't read minds, you need to tell me what you're buying."
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("No Item")
			)
		}
		if (await connect.fetch("inventory", message.author.id) === null) {
			await connect.add("inventory", message.author.id)
		}
		if (await connect.fetch("currency", message.author.id) === null) {
			await connect.add("currency", message.author.id)
		}
		const validItems = [
			"banknote",
			"raybrain"
		]
		if (validItems.includes(args[0])) {
			if (args[0] == "banknote") {
				const data = await connect.fetch("currency", message.author.id)
				const invData = await connect.fetch("inventory", message.author.id)
				if (data.amountw < 80000) {
					await connect.end(true)
					return m.edit(new RM.Discord.MessageEmbed()
						.setColor("RED")
						.setAuthor(message.author.tag, message.author.avatarURL())
						.setDescription(
							"You don't have enough money to buy this."
						)
						.setThumbnail(message.guild.iconURL())
						.setTitle("Not enough money")
					)
				}
				await connect.update("currency", message.author.id, data.amountw - 80000)
				const items = invData.items
				if (items.banknote === undefined) {
					items.banknote = 1
				} else {
					items.banknote += 1
				}
				await connect.updateInv("inventory", message.author.id, items)
				await connect.end(true)
				m.edit(new RM.Discord.MessageEmbed()
					.setColor("GREEN")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"You have successfully bought a banknote for $80,000."
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Success")
				)
			} else if (args[0] == "raybrain") {
				const data = await connect.fetch("currency", message.author.id)
				const invData = await connect.fetch("inventory", message.author.id)
				if (data.amountw < 20000) {
					await connect.end(true)
					return m.edit(new RM.Discord.MessageEmbed()
						.setColor("RED")
						.setAuthor(message.author.tag, message.author.avatarURL())
						.setDescription(
							"You don't have enough money to buy this."
						)
						.setThumbnail(message.guild.iconURL())
						.setTitle("Not enough money")
					)
				}
				await connect.update("currency", message.author.id, data.amountw - 20000)
				const items = invData.items
				if (items.raybrain === undefined) {
					items.raybrain = 1
				} else {
					items.raybrain += 1
				}
				await connect.updateInv("inventory", message.author.id, items)
				await connect.end(true)
				m.edit(new RM.Discord.MessageEmbed()
					.setColor("GREEN")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"You have successfully bought a raybrain for $20,000."
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Success")
				)
			}
		} else {
			await connect.end(true)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"I don't know what you're trying to buy."
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Invalid Item")
			)
		}
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