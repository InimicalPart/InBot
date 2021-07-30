const commandInfo = {
	"primaryName": "rob", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["rob", "steal"], // These are all commands that will trigger this command.
	"help": "Rob another users wallet!", // This is the general description of the command.
	"aliases": ["steal"], // These are command aliases that help.js will use
	"usage": "[COMMAND] <user>", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}
function calcPercent(percent, number) {
	return parseInt((percent / 100) * number);
}
function between(lower, upper) {
	var scale = upper - lower + 1;
	return Math.floor(lower + Math.random() * scale);
}
async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdRob) {
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

		let user =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) ||
			message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase()) ||
			null
		if (!args[0]) {
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"You need to specify a user to rob!"
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return await connect.end(true)
		}
		if (user == null) {
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"**Error:** User not found!"
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return await connect.end(true)
		}
		const userCooldown = await connect.fetch("cooldown", message.author.id)
		if (userCooldown.robcool !== null) {
			const cooldown = new Date(userCooldown.robcool * 1000)
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


		if (await connect.fetch("currency", user.id) == null) {
			await connect.add("currency", user.id)
		}


		/*if (connect.fetch("inventory", user.id) == null) {
			connect.add("inventory", user.id)
		}
		
		Check if user has a lockpick or a landmine
		*/

		let userCurrency = await connect.fetch("currency", user.id)
		let authorCurrency = await connect.fetch("currency", message.author.id)
		let userWal = userCurrency.amountw
		let authorWal = authorCurrency.amountw

		if (authorWal < 500) {
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"**Error:** You need at least 500 coins to rob someone!"
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return await connect.end(true)
		}
		if (userWal < 500) {
			await connect.end(true)
			return m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"**" + user.user.username + "** needs to have more than 500 coins, otherwise it's just not worth it."
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		await connect.updateCooldown("cooldown", message.author.id, new Date(new Date().setTime(new Date().getTime() + (45 * 60 * 1000))))
		const failOdds = between(0, 100)
		if (failOdds > 75) {
			const fortyOfBal = calcPercent(50, authorWal)
			const amountToRemove = between(200, fortyOfBal)
			await connect.update("currency", user.id, (parseInt(userWal) + parseInt(amountToRemove)))

			await connect.update("currency", message.author.id, (parseInt(authorWal) - parseInt(amountToRemove)))


			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"You got caught while trying to rob **" + user.user.username + "** You lost: **`$" + amountToRemove + "`**!"
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Fail")
			)
			return await connect.end(true)
		}
		const fiftyOfBal = calcPercent(75, userWal)
		const amountToRemove = parseInt(between(300, fiftyOfBal))

		await connect.update("currency", user.id, (parseInt(userWal) - parseInt(amountToRemove)))

		await connect.update("currency", message.author.id, (parseInt(authorWal) + parseInt(amountToRemove)))

		m.edit(new RM.Discord.MessageEmbed()
			.setColor("GREEN")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
				"You successfully robbed **" + user.user.username + "** You got: **`$" + amountToRemove + "`**!"
			)
			.setThumbnail(message.guild.iconURL())
			.setTitle("Success")
		)
		user.user.send("**" + message.author.tag + "** just robbed you out of **`$" + amountToRemove + "`**!")
		return await connect.end(true)

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