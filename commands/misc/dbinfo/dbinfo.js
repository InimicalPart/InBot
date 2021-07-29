const commandInfo = {
	"primaryName": "dbinfo", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["dbinfo"], // These are all commands that will trigger this command.
	"help": "Allows admins to check information in the database!", // This is the general description of the command.
	"aliases": [], // These are command aliases that help.js will use
	"usage": "[COMMAND] <id>", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "misc"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdDbinfo) {
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
	if (!message.member.hasPermission("ADMINISTRATOR")) {
		await connect.end()
		return m.edit(new RM.Discord.MessageEmbed()
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
	const { connect } = require("../../../databasec")
	await connect()
	await connect.create("currency")
	var SqlString = require('sqlstring');
	message.channel.send(new RM.Discord.MessageEmbed().setDescription("<a:loading:869354366803509299> *Working on it...*")).then(async (m) => {
		if (!args[0]) {
			connect.end(true)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setDescription("You need to specify an id to get info on.")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return
		}
		if (isNaN(parseInt(args[0]))) {
			connect.end(true)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setDescription("Incorrect argument")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return
		}
		const res = await connect.query("SELECT * FROM currency WHERE id=" + SqlString.escape(args[0]))
		if (res.rows.length < 1) {
			connect.end(true)
			m.edit(new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setDescription("Could not find a user with that id.")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Error")
			)
			return
		}
		const resjson = JSON.parse(JSON.stringify(res.rows[0]))
		const res2 = await connect.query("SELECT * FROM inventory WHERE userid=" + resjson.userid)
		if (res2.rows.length < 1) {
			const user = message.guild.members.cache.get(resjson.userid)
			const tag = user.user.tag
			const iconURL = user.user.avatarURL()
			const embed = new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setThumbnail(iconURL)
				.setTitle("DB Data")
				.addFields({
					name: "ID",
					value: resjson.id,
				})
				.addFields({
					name: "Name",
					value: "**" + tag + "**",
				})
				.addFields({
					name: "User ID",
					value: resjson.userid
				})
				.addFields({
					name: "Wallet",
					value: resjson.amountw
				})
				.addFields({
					name: "Bank",
					value: resjson.amountb
				})
				.addFields({
					name: "Bank Capacity",
					value: resjson.maxbank
				})
				.addFields({
					name: "Level",
					value: resjson.level
				})
			m.edit(embed)
			connect.end(true)
		} else {
			const res2json = JSON.parse(JSON.stringify(res2.rows[0]))
			const user = message.guild.members.cache.get(resjson.userid)
			const tag = user.user.tag
			const iconURL = user.user.avatarURL()
			const embed = new RM.Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setThumbnail(iconURL)
				.setTitle("DB Data")
				.addFields({
					name: "ID",
					value: resjson.id,
				})
				.addFields({
					name: "Name",
					value: "**" + tag + "**",
				})
				.addFields({
					name: "User ID",
					value: resjson.userid
				})
				.addFields({
					name: "Wallet",
					value: resjson.amountw
				})
				.addFields({
					name: "Bank",
					value: resjson.amountb
				})
				.addFields({
					name: "Bank Capacity",
					value: resjson.maxbank
				})
				.addFields({
					name: "Level",
					value: resjson.level
				})
				.addFields({
					name: "Inventory",
					value: JSON.stringify(res2json.items)
				})
			m.edit(embed)
			connect.end(true)
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