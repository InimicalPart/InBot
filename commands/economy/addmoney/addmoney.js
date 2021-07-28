const commandInfo = {
	"primaryName": "addmoney", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["addmoney", "am"], // These are all commands that will trigger this command.
	"help": "Allows admins to add money to a user", // This is the general description pf the command.
	"aliases": ["am"], // These are command aliases that help.js will use
	"usage": "[COMMAND] <user> <money>", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdAddmoney) {
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
	const client = RM.client
	message.channel.send(new RM.Discord.MessageEmbed().setDescription("<a:loading:869354366803509299> *Working on it...*")).then(async (m) => {

	

		if (!message.member.hasPermission("ADMINISTRATOR")) {
			return m.edit(new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.username, message.author.avatarURL())
				.setDescription(
					"You do not have permission to use this command."
				)
				.setTimestamp()
				.setThumbnail(message.guild.iconURL())
				.setTitle("Permission Denied")
			)
		};
		if (!args[0]) {
			return m.edit(new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.username, message.author.avatarURL())
				.setDescription(
					"You need to specify a user to add money to."
				)
				.setTimestamp()
				.setThumbnail(message.guild.iconURL())
				.setTitle("No User Specified")
			)
		}

		//copilot fix the fucking error please
		//ty copilot human version
		let user = undefined
		if (Number.isInteger(parseInt(args[0]))) {
			message.guild.members.cache.forEach((member) => { if (member.id == args[0]) user = member.user; })
		} else {
			user = message.mentions.members.first() || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
			user = user.user
		}
		if (!user) {
			return m.edit(new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`${args[0]} is not a valid user.`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("User Not Found")
			)
		}
		const username = user.username
		if (!args[1]) {
			return m.edit(new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`You need to specify a value to add.`
				)
				.setTimestamp()
				.setThumbnail(message.guild.iconURL())
				.setTitle("No Value Specified")
			)
		}

		const profile = await client.getProfile(user).catch((err) => {
			console.log(`^^`);
		})
		// if there is no profile create one and send a message saying that they have been added to the data base
		if (!profile) {
		m.edit(
			new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`${user} is not in the database`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("ERROR")
		)}

		const bal = parseInt(profile.coins);	
		const bank = parseInt(profile.bank); 
		const bankSpace = parseInt(profile.bankSpace);
		let amount = parseInt(args[1]);

		if (isNaN(args[1]) || args[1] < 0) {
			return m.edit(new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`The value you specified is not a number.`
				)
				.setTimestamp()
				.setThumbnail(message.guild.iconURL())
				.setTitle("Invalid Value")
			)
		}
		if (args[1] > 1000000) {
			return m.edit(new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`The value you specified is too high.`
				)
				.setTimestamp()
				.setThumbnail(message.guild.iconURL())
				.setTitle("Invalid Value")
			)
		}

		if (args[2] === "-b") {
			if (bank + amount > bankSpace) {
				return m.edit(new Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(
						`the bank cannot handle that much money`
					)
					.setTimestamp()
					.setThumbnail(message.guild.iconURL())
					.setTitle("Bank Full")
				)
			}
			await client.updateProfile(user, { bank: bank + amount }).catch((err) => {
				console.log(err);
			})
			return m.edit(new Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`${args[1]} has been added to ${username}'s bank`
				)
				.setTimestamp()
				.setThumbnail(message.guild.iconURL())
				.setTitle("Success")
			)
		}

		await client.updateProfile(user, { coins: bal + amount }).catch((err) => {
			console.log(err);
		})
		let moneyEmbed = new Discord.MessageEmbed()
			.setColor("GREEN")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
				`${username} has been given ${args[1]} dollarooos. Balance is now ${bal + amount}`
			)
			.setTimestamp()
			.setThumbnail(message.guild.iconURL())
			.setTitle("Success")
		m.edit(moneyEmbed)
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