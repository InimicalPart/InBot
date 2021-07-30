const commandInfo = {
	"primaryName": "deposit", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["deposit", "dep"], // These are all commands that will trigger this command.
	"help": "Desposit your money to the bank!", // This is the general description of the command.
	"aliases": ["dep"], // These are command aliases that help.js will use
	"usage": "[COMMAND] <amount/all>", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdDeposit) {
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
				.setDescription("Please enter an amount to deposit!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}

		if (await connect.fetch("currency", message.author.id) === null) {
			await connect.add("currency", message.author.id, 0, 0)
		}
		const balance = await connect.fetch("currency", message.author.id)
		const bank = balance.amountb
		const wallet = balance.amountw
		const maxbank = balance.maxbank
		let amount;
		if (args[0] === "all") {
			amount = parseInt(wallet) // ph wait maybe this was the problem? idk mk lets see lemme add the old code back
		} else {
			amount = parseInt(args[0])
		}

		//if args 0 is not a number tell them its not a fuckign number
		if (isNaN(parseInt(amount))) {
			await connect.end(true)
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("we both know thats not a number")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}

		if (amount > balance.amountw) {
			await connect.end(true)
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You don't have enough money!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (amount < 0) {
			await connect.end(true)
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You can't deposit negative money!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (amount === 0) {
			await connect.end(true)
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You can't deposit nothing!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (amount > maxbank && bank !== maxbank) {
			const newAmount = maxbank - bank;
			await connect.update("currency", message.author.id, wallet - newAmount, bank + newAmount)
			const newBal = await connect.fetch("currency", message.author.id)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription("Deposited **\`$" + amount + `\`** to the bank! Your balance is now:\n\nWallet: **\`$${parseInt(newBal.amountw)}\`**\nBank: **\`$${parseInt(newBal.amountb)}\`**`)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Deposited")
			)
			return await connect.end(true)
		}

		if (bank + amount > maxbank) {
			await connect.end(true)
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You don't have enough bank space!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)

		}

		if (bank === maxbank) {
			await connect.end(true)
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("Your bank is full")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle(":/")
			)

		}
		if (maxbank < amount) { // quick question prolly cuz im blind um but where is the normal uhm code for if you do -dep 1 etc cuz that works but wher in this code is it
			await connect.end(true)
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You don't have enough space in your bank!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)

		}

		await connect.update("currency", message.author.id, wallet - amount, bank + amount)
		const newBal = await connect.fetch("currency", message.author.id)
		m.edit(new RM.Discord.MessageEmbed()
			.setDescription("Deposited **\`$" + amount + `\`** to the bank! Your balance is now:\n\nWallet: **\`$${parseInt(newBal.amountw)}\`**\nBank: **\`$${parseInt(newBal.amountb)}\`**`)
			.setColor("GREEN")
			.setThumbnail(message.guild.iconURL())
			.setTitle("Success")
		)

		return await connect.end(true)
	})
	// console.log(bank, wallet, amount, maxbank)
	// console.log("bank", "wallet", "amount", "maxbank")
}

/*
https://github.com/InimicalPart/TheIIIProject/blob/9783c3ada3a4b596583f52de0968252bbc9feace/commands/economy/deposit/deposit.js
	
		if (amount > maxbank && bank !== maxbank) {
			let newAmount = parseInt(maxbank) - parseInt(bank);
	
			await connect.update("currency", message.author.id, parseInt(balance.amountw - newAmount), parseInt(balance.amountb + newAmount))
			m.edit(new RM.Discord.MessageEmbed()
				.setDescription("Deposited $" + newAmount + ` to the bank! You have now $${parseInt(balance.amountw - newAmount)} in your wallet!`)
				.setColor("GREEN")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Success")
			)
			return await connect.end(true)
		} else if (amount < maxbank && bank !== maxbank) {
	
			await connect.update("currency", message.author.id, parseInt(balance.amountw - amount), parseInt(balance.amountb + amount))
			m.edit(new RM.Discord.MessageEmbed()
				.setDescription("Deposited $" + amount + ` to the bank! You have now $${parseInt(balance.amountw - amount)} in your wallet!`)
				.setColor("GREEN")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Success")
			)
			return await connect.end(true)
		}
*/

// <-------------here------------->
//it passes all of the checks so it just stands on "working on it"
// it failed with values:
//  0     13444   13444   13444
// bank, wallet, amount, maxbank

//snack timeit works tho?
//incase of it passing all checks, print values 

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