const commandInfo = {
	"primaryName": "shuffle", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["shuffle"], // These are all commands that will trigger this command.
	"help": "Shuffles the queue.", // This is the general description pf the command.
	"aliases": [], // These are command aliases that help.js will use
	"usage": "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "music"
}

async function runCommand(message, args, RM) {
	if (!require("../../../config.js").cmdShuffle) {
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
	let songArray = []
	let otherSongArray = []
	const serverQueue = ops.queue.get(message.guild.id);
	const serverQueueClone = serverQueue
	serverQueueClone.songs.clear()
	let current = 0;
	for (let i in serverQueue.songs) {
		current++
		if (current == 1) {
			songArray.push(serverQueue.songs[i])
		} else {
			otherSongArray.push(serverQueue.songs[i])
		}
	}
	shuffle(otherSongArray)
	for (let i in otherSongArray) {
		songArray.push(otherSongArray[i])
	}
	for (let i in songArray) {
		serverQueueClone.songs.push(songArray[i])
	}
	serverQueue.songs = serverQueueClone.songs


	// return serverQueue = newSongs
}
function shuffle(array) {
	var currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
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