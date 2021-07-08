const commandInfo = {
	"primaryName": "approve",
	"possibleTriggers": ["approve"],
	"help": "Allows admins to approve an image submission.",
	"aliases": [],
	"usage": "[COMMAND] <MSG ID> [reason]" // [COMMAND] gets replaced with the command and correct prefix later
}

async function runCommand(message, args, RM) {

	const Discord = RM.Discord;
	const client = RM.client;
	const submissionChannelID = RM.submissionChannelID;
	const submissionQueueID = RM.submissionQueueID;
	const logsID = RM.logsID;
	const botOwners = RM.botOwners;
	if (!botOwners.includes(message.author.id)) return // message.channel.send("Hmm... You don't seem to have enough permissions to do that.")
	message.delete();
	if (!args[0]) {
		return message.channel.send("Please provide the message to approval")
	}
	const submissionQueue = client.channels.cache.get(submissionQueueID);
	const submissionChannel = client.channels.cache.get(submissionChannelID);
	const messageID = args[0];
	let m = await submissionQueue.messages.fetch(messageID).catch((err) => {
		return message.channel.send("Invalid Message ID.")
	})


	//return message.channel.send(messageID + "s content is: " + m.content)
	if (!m.editable) return message.channel.send("I cannot edit that message.")
	if (m.embeds.length < 1) return message.channel.send("This isn't an image submission.")
	const url = m.embeds[0].image.url
	const authorID = m.embeds[0].author.iconURL.match(/[0-9]{18}/gmi)
	let title = null;
	for (let field of m.embeds[0].fields) {
		if (field.name == 'Title:') {
			title = field.value;
			break
		}
	}
	if (title == null) {
		return message.channel.send("This isn't an image submission.")
	}
	const author = await client.users.fetch(String(authorID));

	//console.log(url, authorID, title, author.tag)
	let exists = null;
	for (let field of m.embeds[0].fields) {
		if (field.name == 'Information:') {
			exists = field.value;
			break
		}

	}
	//console.log(exists)
	if (exists != null) {
		return message.channel.send("This message has already been denied or approved.")
	}

	const logs = client.channels.cache.get(logsID)
	let newEmbed;
	if (!args[1]) {
		newEmbed = new Discord.MessageEmbed()
			.setAuthor(author.tag, author.avatarURL())
			.setImage(url)
			.setColor("#FFFF00")
			.addField("Title:", "**" + title + "**")
			.addField("Amazing picture by:", "<@" + message.author + ">")
			.addField('\u200b', '\u200b')
			.addField('Information:', ':white_check_mark: | Approved');
	} else {
		const reason = args.slice(1).join(" ");
		newEmbed = new Discord.MessageEmbed()
			.setAuthor(author.tag, author.avatarURL())
			.setImage(url)
			.setColor("#FFFF00")
			.addField("Title:", "**" + title + "**")
			.addField("Amazing picture by:", "<@" + message.author + ">")
			.addField('\u200b', '\u200b')
			.addField('Information:', ':white_check_mark: | Approved, reason: ' + reason);
	}
	m.delete()
	submissionChannel.send(newEmbed).then(function (messagea) {
		messagea.react("👍")
		messagea.react("👎")
	}).catch(function (err) {
		console.error("ERROR: " + err.message)
	});
	logs.send(newEmbed)
	logs.send("Post handled by: <@" + message.author.id + ">")
	if (!args[1]) {
		await author.send("Your image submission was approved! No reason was supplied").catch(() => {
			console.log("error, probably user has dms closed.")
		})
	} else {
		const reason = args.slice(1).join(" ");
		await author.send("Your image submission was approved!: " + reason).catch(() => {
			console.log("error, probably user has dms closed.")
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
module.exports = {
	runCommand,
	commandTriggers,
	commandHelp,
	commandAliases,
	commandPrim,
	commandUsage
}

console.log("[I] APPROVE initialized [I]")
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