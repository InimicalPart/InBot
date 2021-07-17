const commandInfo = {
	"primaryName": "stop",
	"possibleTriggers": ["stop"],
	"help": "Stops the entire song and queue.",
	"aliases": [],
	"usage": "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "music"
}

async function runCommand(message, args, RM) {
	if (!require("../../../config.js").cmdStop) {
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
	const queue2 = global.sQueue2;
	const queue3 = global.sQueue3;
	const queue = global.sQueue;
	const games = global.games

	let ops = {
		queue2: queue2,
		queue: queue,
		queue3: queue3,
		games: games,
	};

	const serverQueue = ops.queue.get(message.guild.id);
	if (!serverQueue) return message.channel.send(":x: | There is nothing playing!")

	const { channel } = message.member.voice;
	if (!channel) return message.channel.send('You need to be in a voice channel!');
	const embed = new RM.Discord.MessageEmbed()
		.setDescription(`Stopping music.`)
	message.channel.send(embed)
	ops.queue.delete(message.guild.id);
	serverQueue.connection.dispatcher.end()

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
/* */ /* */ /* */ /* */ /* */ /* */ /* */
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
/* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */