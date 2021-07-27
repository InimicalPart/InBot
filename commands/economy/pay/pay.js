const commandInfo = {
	"primaryName": "pay", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["pay", "transfer"], // These are all commands that will trigger this command.
	"help": "Give some money to a user!", // This is the general description pf the command.
	"aliases": ["transfer"], // These are command aliases that help.js will use
	"usage": "[COMMAND] <player> <amount>", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdPay) {
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
	const { connect } = require("../../../databasec")
	await connect()
	await connect.create("currency")
	message.channel.send(new RM.Discord.MessageEmbed().setDescription("<a:loading:869354366803509299> *Working on it...*")).then(async (m) => {
		let user =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) ||
			message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase()) ||
			null
		if (user == null) {
			await connect.end()
			return m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"**ERROR:** Could not find user."
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (await connect.fetch("currency", user.id) === null) {
			await connect.add("currency", user.id, 0, 0)
		}
		if (await connect.fetch("currency", message.author.id) === null) {
			await connect.add("currency", message.author.id, 0, 0)
		}
		let amount = parseInt(args[1])
		if (isNaN(amount)) {
			await connect.end()
			return m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"**ERROR:** Invalid amount."
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (amount < 1) {
			await connect.end()
			return m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"**ERROR:** Invalid amount."
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		let authorBal = await connect.fetch("currency", message.author.id)
		let userBal = await connect.fetch("currency", user.id)
		if (amount > authorBal.amountw) {
			await connect.end()
			return m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"You don't have $" + amount
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)

		}
		await connect.update("currency", message.author.id, parseInt(authorBal.amountw) - parseInt(amount))
		await connect.update("currency", user.id, parseInt(userBal.amountw) + parseInt(amount))
		m.edit(new RM.Discord.MessageEmbed()
			.setColor("GREEN")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
				"You have transfered $" + amount + " to **" + user.user.username + "**."
			)
			.setThumbnail(message.guild.iconURL())
			.setTitle("Success")
		)
		// cmd stuff here
		await connect.end(true)
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