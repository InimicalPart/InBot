const commandInfo = {
	"primaryName": "removemoney", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["removemoney", "rm",], // These are all commands that will trigger this command.
	"help": "removes a certain amount of money from a user", // This is the general description pf the command.
	"aliases": ["rm",], // These are command aliases that help.js will use
	"usage": "[COMMAND] <user> <amount>", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdRemovemoney) {
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

	const Discord = RM.Discord
	message.channel.send(new RM.Discord.MessageEmbed().setDescription("<a:loading:869354366803509299> *Working on it...*")).then(async (m) => {
		const { connect } = require("../../../databasec")
		await connect()
		await connect.create("currency")

		if (!message.member.hasPermission("ADMINISTRATOR", "MANAGE _GUILD")) {
			await connect.end()
			return m.edit(
				new Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"You do not have permission to use this command."
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Permission Denied")
			)
		}

		if (!args[0]) {
			await connect.end()
			return m.edit(
				new Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"Please specify a user."
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Invalid Arguments")
			)
		}
		let user = undefined
		if (Number.isInteger(parseInt(args[0]))) {
			message.guild.members.cache.forEach((member) => { if (member.id == args[0]) user = member.user; })
		} else {
			user = message.mentions.members.first() || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
		}

		if (!user) {
			await connect.end()
			return m.edit(
				new Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"Please specify a user."
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Invalid Arguments")
			)
		}
		if (!args[1]) {
			await connect.end()
			return m.edit(
				new Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"Please specify a value."
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Invalid Arguments")
			)
		}
		if (isNaN(args[1])) {
			await connect.end()
			return m.edit(
				new Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"Please specify a value."
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Invalid Arguments")
			)
		}
		if (await connect.fetch("currency", user.id) === null) {
			await connect.add("currency", user.id, 0, 0)
		} // ANCHOR no it doesnt work for me
		const info = await connect.fetch("currency", user.id)
		let bal = parseInt(info.amountw)
		if (args[0] > bal) {
			await connect.end();
			return m.edit(
				new Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						"you cannot take more than they have :/"
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Invalid Arguments")
			)
		}

		await connect.update("currency", user.id, ((bal - 0) - (args[1] - 0)))
		const info2 = await connect.fetch("currency", user.id)
		let bal2 = info2.amountw
		let moneyEmbed = new Discord.MessageEmbed()
			.setColor("GREEN")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
				`You took ${args[1]} from ${user.user.username}. New bal = $${bal2}`
			)
			.setThumbnail(message.guild.iconURL())
			.setTitle("Money Removed")

		m.edit(moneyEmbed)
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