const commandInfo = {
	"primaryName": "deposit", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["deposit", "dep"], // These are all commands that will trigger this command.
	"help": "Desposit your money to the bank!", // This is the general description pf the command.
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
	message.channel.send(new RM.Discord.MessageEmbed().setDescription("<a:loading:869354366803509299> *Working on it...*")).then(async (m) => {
		
		const client = RM.client
		if (!args[0]) return m.edit(new RM.Discord.MessageEmbed()
			.setDescription("Please enter an amount to deposit!")
			.setColor("RED")
			.setThumbnail(message.guild.iconURL())
			.setTitle("Error")
		)

		//if (await connect.fetch("currency", message.author.id) === null) {
		//	await connect.add("currency", message.author.id, 0, 0)
		//}
//user = author of the message
		let user = message.author
		
	const newProfile = {
  	userID: user.id,
  	username: message.author.tag,
	};
	const profile = await client.getProfile(user).catch((err) => {
 	 console.log("^^");
	});

	if (!profile) {
 	 await client.createProfile(newProfile);
 	 m.edit(
  	  new Discord.MessageEmbed()
   	   .setColor("GREEN")
   	   .setAuthor(message.author.tag, message.author.avatarURL())
   	   .setDescription(
    	    `Welcome to The III Project's Economy System!\n\nYou have been added to the database, please re-use the command`
    	  )
    	  .setThumbnail(message.guild.iconURL())
    	  .setTitle("WELCOME")
  	);
	}

	const bal = parseInt(profile.coins);	
	const bank = parseInt(profile.bank); 
	const bankSpace = parseInt(profile.bankSpace);

		let amount = args[0];
		if (args[0] === "all") {
			amount = parseInt(bal)
		} else {
			amount = parseInt(args[0])
		}
		if (amount > bal) {
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You don't have enough money!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (amount < 0) {
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You can't deposit negative money!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		if (amount === 0) {
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("YoU dePosItEd 0 CoInS :sparkles:**GrEaT JoB**:sparkles:")
				.setColor("GREEN")
				.setThumbnail(message.guild.iconURL())
				.setTitle("vErY uSeFul DePOsiT")
			)
		}

		if (amount > bankSpace && bank !== bankSpace) {
			let newAmount = bankSpace - bank;
			await client.updateProfile(user, {
				bank: bank + newAmount,
				coins: bal - newAmount,
			});
			return m.edit(new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`I have deposited ${newAmount} coins as that is the max you can transfer to your bank`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Deposited")
			)
		}


		if (bank + amount > bankSpace) {
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You don't have enough bank space!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		

			if (bank === bankSpace ) {
				return m.edit(new RM.Discord.MessageEmbed()
					.setDescription("Your bank is full")
					.setColor("RED")
					.setThumbnail(message.guild.iconURL())
					.setTitle(":/")
				)
			}

		if (bankSpace < amount) {
			return m.edit(new RM.Discord.MessageEmbed()
				.setDescription("You don't have enough space in your bank!")
				.setColor("RED")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
		}
		

		await client.updateProfile(user, { coins: bal - amount});
		await client.updateProfile(user, { bank: bank + amount}); 
		m.edit(new RM.Discord.MessageEmbed()
			.setDescription("Deposited $" + amount + ` to the bank! You have now $${parseInt(bal - amount)} in your wallet!`)
			.setColor("GREEN")
			.setThumbnail(message.guild.iconURL())
			.setTitle("Success")
		)
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