const commandInfo = {
	"primaryName": "shop", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["shop", "alias2", "alias3"], // These are all commands that will trigger this command.
	"help": "eats your cake!", // This is the general description of the command.
	"aliases": ["alias2", "alias3"], // These are command aliases that help.js will use
	"usage": "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "economy"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdShop) {
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
		//const DiscordPages = require("djs-embed-pages");
		const { connect } = require("../../../databasec")
		await connect()
		await connect.create("currency")

		let page1 = new RM.Discord.MessageEmbed()
			.setDescription(
				"<:banknote:870085917963067392> **Bank Note** - [$80,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nIncrease your maximum bank capacity by $1000\nid: `banknote`\n\n" +
				":brain: **Ray's Brain** - [$20,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nHe doesnt know\nid:`raybrain`\n\n" +
				":lock: **Padlock** - [$5,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nLock your wallet for 10h! Stops every thief if they don't have a lockpick\nid:`padlock`\n\n" +
				":lock_with_ink_pen: **Lockpick** - [$7,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nGet a lockpick so you can pick padlocks!\nid: `lockpick`\n\n" +
				"<:landmine:870679232651591700> **Landmine** - [$10,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nA landmine will have a 50% of killing the thief.\nid: `landmine`\n\n"
			)
		let page2 = new RM.Discord.MessageEmbed()
			.setDescription(
				"<:banknote:870085917963067392> **No Bank Note** - [$80,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nIncrease your maximum bank capacity by $1000\nid: `banknote`\n\n" +
				":brain: **Ray's Brain** - [$20,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nHe doesnt know\nid:`raybrain`\n\n" +
				":lock: **Padlock** - [$5,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nLock your wallet for 10h! Stops every thief if they don't have a lockpick\nid:`padlock`\n\n" +
				":lock_with_ink_pen: **Lockpick** - [$2,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nGet a lockpick so you can pick padlocks!\nid: `lockpick`\n\n" +
				"<:landmine:870679232651591700> **Landmine** - [$10,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nA landmine will have a 50% of killing the thief.\nid: `landmine`\n\n"
			)

		m.edit(page1)
		//":moneybag: **Money Bag** - [$10,000](https://www.youtube.com/watch?v=j5a0jTc9S10)\nYou can store up to $10,000\nid: `moneybag`\n\n" +
		//m.edit(embed)
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