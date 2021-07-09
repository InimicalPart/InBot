const commandInfo = {
	"primaryName": "help",
	"possibleTriggers": ["help", "h", "?"],
	"help": "Help allows you to get information about a command.",
	"aliases": ["h", "?"],
	"usage": "[COMMAND] [command]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "misc"
}

async function runCommand(message, args, RM) {
	const prefix = RM.process_env.prefix
	if (args[0]) {
		for (let i in RM) {
			if (i.startsWith("cmd")) {
				let k = RM[i]
				if (k.commandTriggers().includes(args[0])) {
					let aliases;
					let description;
					if (k.commandAliases().length < 1) {
						aliases = "No aliases."
					} else {
						aliases = '`' + prefix + k.commandAliases().join("` | `" + prefix) + "`"
					}
					if (k.commandHelp() == "") {
						description = "No description."
					} else {
						description = k.commandHelp()
					}
					const embed = new RM.Discord.MessageEmbed()
						.setAuthor(message.author.tag, message.author.avatarURL())
						.setDescription("Command: **" + k.commandPrim().toUpperCase() + "**")
						.addFields({
							name: "Description",
							value: description
						})
						.addFields({
							name: "Usage",
							value: k.commandUsage().replace("[COMMAND]", prefix + args[0])
						})
						.addFields({
							name: "Aliases",
							value: aliases
						})
						.addFields({
							name: "Category",
							value: k.commandCategory().toUpperCase()
						})
						.setTimestamp()
					return message.channel.send(embed)
				}
			}
		}
		message.channel.send(new RM.Discord.MessageEmbed().setDescription("Command was not found."))
	} else {
		const embed = new RM.Discord.MessageEmbed()
			.setTitle("Commands")
			.setColor(11730464)
			.setTimestamp()
			.setFooter("Please send a category name!")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.addField("🎉Fun", "Here can you find some commands that are fun!")
			.addField("🖼 III Submission", "Here you can find commands that you can use to submit images!")
			.addField("🛠 Misc", "Here are some commands that don't really fit in any category.")
			.addField("⚔ Moderation", "Here are some commands that admins can use to manage the server!")
			.addField("🎵 Music", "Here can you find commands that you can use to listen to music!")
		message.channel.send(embed).then((m) => {
			var filter2 = m => m.author.id === message.author.id
			message.channel.awaitMessages(filter2, {
				max: 1,
				time: 30000,
				errors: ['time']
			}).then(messageNext => {
				messageNext = messageNext.first()
				const wanting = messageNext.content.toLowerCase()
				//if (!categories.includes(wanting)) return message.channel.send("Category not understood. Canceling.")
				if (wanting === "fun") {
					let embed = new RM.Discord.MessageEmbed().setTitle("FUN")
					for (let i in RM) {
						if (i.startsWith("cmd")) {
							let k = RM[i]
							if (k.commandCategory() == "fun") {
								if (k.commandHelp() == "") {
									description = "No description."
								} else {
									description = k.commandHelp()
								}
								embed.addField(prefix + k.commandPrim(), description)
							}
						}
					}
					m.edit(embed)
				} else if (wanting == "iii" || wanting == "iii sub" || wanting == "iii submission") {
					let embed = new RM.Discord.MessageEmbed().setTitle("III Submission")
					for (let i in RM) {
						if (i.startsWith("cmd")) {
							let k = RM[i]
							if (k.commandCategory() == "iiisub") {
								if (k.commandHelp() == "") {
									description = "No description."
								} else {
									description = k.commandHelp()
								}
								embed.addField(prefix + k.commandPrim(), description)
							}
						}
					}
					m.edit(embed)
				} else if (wanting == "misc" || wanting == "miscellaneous") {
					let embed = new RM.Discord.MessageEmbed().setTitle("Miscellaneous")
					for (let i in RM) {
						if (i.startsWith("cmd")) {
							let k = RM[i]
							if (k.commandCategory() == "misc") {
								if (k.commandHelp() == "") {
									description = "No description."
								} else {
									description = k.commandHelp()
								}
								embed.addField(prefix + k.commandPrim(), description)
							}
						}
					}
					m.edit(embed)
				} else if (wanting == "mod" || wanting == "moderation") {
					let embed = new RM.Discord.MessageEmbed().setTitle("Moderation")
					for (let i in RM) {
						if (i.startsWith("cmd")) {
							let k = RM[i]
							if (k.commandCategory() == "mod") {
								if (k.commandHelp() == "") {
									description = "No description."
								} else {
									description = k.commandHelp()
								}
								embed.addField(prefix + k.commandPrim(), description)
							}
						}
					}
					m.edit(embed)
				} else if (wanting == "music") {
					let embed = new RM.Discord.MessageEmbed().setTitle("Music")
					for (let i in RM) {
						if (i.startsWith("cmd")) {
							let k = RM[i]
							if (k.commandCategory() == "music") {
								if (k.commandHelp() == "") {
									description = "No description."
								} else {
									description = k.commandHelp()
								}
								embed.addField(prefix + k.commandPrim(), description)
							}
						}
					}
					m.edit(embed)
				}
			}).catch(() => null);
		})
	}
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