const commandInfo = {
	"primaryName": "withdraw", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["withdraw", "with"], // These are all commands that will trigger this command.
	"help": "Withdraw your money from the bank!", // This is the general description pf the command.
	"aliases": ["with"], // These are command aliases that help.js will use
	"usage": "[COMMAND] <amount/all>", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdWithdraw) {
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
		if (!args[0]) {
			await connect.end()
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("Please enter an amount to withdraw!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (await connect.fetch("currency", message.author.id) === null) {
			await connect.add("currency", message.author.id, 0, 0)
		}
		const balance = await connect.fetch("currency", message.author.id)
		let amount;
		if (args[0] === "all") {
			amount = parseInt(balance.amountb)
		} else {
			amount = parseInt(args[0])
		}
		if (amount > balance.amountb) {
			await connect.end()
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription(`You don't have $${amount} in the bank!`)
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (amount < 0) {
			await connect.end()
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You can't withdraw a negative amount!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (amount === 0) {
			await connect.end()
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You can't withdraw anything!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		await connect.update("currency", message.author.id, parseInt(balance.amountw) + parseInt(amount), parseInt(balance.amountb) - parseInt(amount)).then()
		m.edit(new RM.Discord.MessageEmbed()
			.setDescription(`Withdrew $${amount} from the bank! You have $${parseInt(balance.amountb - amount)} left in the bank!`)
			.setColor("GREEN")
			.setThumbnail(message.guild.iconURL())
			.setTitle("Success")
		)

		await connect.end(true)
	})
	// cmd stuff here
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