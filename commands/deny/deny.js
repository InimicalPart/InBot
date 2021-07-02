const commandInfo = {
	"possibleTriggers": ["deny", "decline"]
}

async function runCommand(message, args, RM) {

	const Discord = RM.Discord;
	const client = RM.client;
	const submissionQueueID = RM.submissionQueueID;
	const logsID = RM.logsID;
	const botOwners = RM.botOwners;
	if (!botOwners.includes(message.author.id)) return //message.channel.send("Hmm... You don't seem to have enough permissions to do that.")
	message.delete();
	if (!args[0]) {
		return message.channel.send("Please provide the message to deny")
	}
	if (!args[1]) {
		return message.channel.send("Please provide the reason for the deny")
	}
	const submissionQueue = client.channels.cache.get(submissionQueueID);

	const messageID = args[0];
	const reason = args.slice(1).join(" ");
	let m = await submissionQueue.messages.fetch(messageID).catch((err) => {
		return message.channel.send("Invalid Message ID.")
	})
	if (m == undefined) {
		return message.channel.send("Invalid Message ID.");
	}


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
	const newEmbed = new Discord.MessageEmbed()
		.setAuthor(author.tag, author.avatarURL())
		.setImage(url)
		.setColor("#FFFF00")
		.addField("Title:", "**" + title + "**")
		.addField("Amazing picture by:", "<@" + message.author + ">")
		.addField('\u200b', '\u200b')
		.addField('Information:', ':x: | Denied, reason: ' + reason);
	m.delete()
	logs.send(newEmbed)
	logs.send("Post handled by: <@" + message.author.id + ">")
	await author.send("Your image submission was denied: " + reason).catch(() => {
		console.log("error, probably user has dms closed.")
	})

}

function commandAlias() {
	return commandInfo.possibleTriggers;
}
module.exports = {
	runCommand,
	commandAlias
}

console.log("[I] DENY initialized [I]")
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
"cmd<cmdname>.commandAlias()"

To call the command, from index.js call
"cmd<cmdname>.runCommand(message, arguments, requiredModules);"

To check if possible triggers has the command call
"cmd<cmdname>.commandAlias().includes(command)"

------------------[Instruction]------------------
*/
/* */
/* */ /* */ /* */ /* */ /* */ /* */ /* */