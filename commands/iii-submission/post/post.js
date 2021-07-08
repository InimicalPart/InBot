const commandInfo = {
	"primaryName": "post",
	"possibleTriggers": ["post"],
	"help": "Make an image submission.",
	"aliases": [],
	"usage": "[COMMAND]" // [COMMAND] gets replaced with the command and correct prefix later
}

async function runCommand(message, args, RM) {

	const Discord = RM.Discord;
	const client = RM.client;
	const submissionQueueID = RM.submissionQueueID;
	const iiiPostingID = RM.iiiPostingID;
	if (iiiPostingID != message.channel.id) return;
	message.channel.send("Please send the image you want to post")
	let url;
	let title;
	var filter = m => m.author.id === message.author.id
	message.channel.awaitMessages(filter, {
		max: 1,
		time: 30000,
		errors: ['time']
	}).then(messageNext => {
		messageNext = messageNext.first()
		if (messageNext.content.toLowerCase() == "cancel") {
			return message.channel.send("Cancelling.")
		}
		if (messageNext.attachments.size > 0 && messageNext.attachments.size < 2) {
			if (messageNext.attachments.every(attachIsImage)) {
				messageNext.attachments.forEach(attachment => {
					url = attachment.url;
					message.channel.send("Wow! What's this amazing picture called?")
					var filter2 = m => m.author.id === message.author.id
					message.channel.awaitMessages(filter2, {
						max: 1,
						time: 30000,
						errors: ['time']
					}).then(messageNext => {
						messageNext = messageNext.first()
						if (messageNext.content.toLowerCase() == "cancel") {
							return message.channel.send("Cancelling.")
						}
						if (messageNext.content.length > 75) {
							return message.channel.send("This title is too long! Try again with a shorter title");
						} else {
							title = messageNext.content;
							const submissionQueue = client.channels.cache.get(submissionQueueID);
							/*submissionChannel.send("**" + title + "**");
							submissionChannel.send(url);
							submissionChannel.send("Amazing picture by: <@" + message.author + ">")
							*/
							const subEmbed = new Discord.MessageEmbed()
								.setAuthor(message.author.tag, message.author.avatarURL())
								.setImage(url)
								.setColor("#FFFF00")
								.addField("Title:", "**" + title + "**")
								.addField("Amazing picture by:", "<@" + message.author + ">");

							submissionQueue.send(subEmbed)

							message.channel.send("Your image was sent to the queue! You'll get a DM when a choice was made! :D")
						}
					}).catch(() => {
						return message.channel.send("Time limit reached. Canceling.")
					});;
				});
			} else {
				return message.channel.send("Not an image.")
			}
		} else {
			return message.channel.send("You did not send an image.")
		}
	}).catch(() => {
		return message.channel.send("Time limit reached. Canceling.")
	});


}

function attachIsImage(msgAttach) {
	var url = msgAttach.url;
	//True if this url is a png image.
	if (url.indexOf("png", url.length - "png".length /*or 3*/) !== -1) {
		return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
	} else if (url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1) {
		return url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
	} else if (url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1) {
		return url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1;
	} else if (url.indexOf("webm", url.length - "webm".length /*or 3*/) !== -1) {
		return url.indexOf("webm", url.length - "webm".length /*or 3*/) !== -1;
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