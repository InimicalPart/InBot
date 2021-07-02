const commandInfo = {
	possibleTriggers: ["queue", "q", "Q", "Queue"],
	help: "`.queue: lists the songs in the queue....\nAliases: .q",
};

async function runCommand(message, args, RM) {
	const queue2 = global.queue2;
	const queue3 = global.queue3;
	const queue = global.queue;
	const games = global.games

	let ops = {
		queue2: queue2,
		queue: queue,
		queue3: queue3,
		games: games,
	};

	const Discord = RM.Discord;
	const client = RM.client;
	const { Util } = require("discord.js");
	const { GOOGLE_API_KEY } = require("../../config");
	const YouTube = require("simple-youtube-api");
	const youtube = new YouTube(GOOGLE_API_KEY);
	const ytdl = require("ytdl-core");

	const { channel } = message.member.voice;
	if (!channel)
		return message.channel.send(
			"I'm sorry but you need to be in a voice channel to see queue!"
		);
	if (message.guild.me.voice.channel !== message.member.voice.channel) {
		return message.channel.send(
			"**You Have To Be In The Same Channel With The Bot!**"
		);
	}
	const serverQueue = ops.queue.get(message.guild.id);
	if (!serverQueue)
		return message.channel.send("❌ **Nothing playing in this server**");
	try {
		let currentPage = 0;
		const embeds = generateQueueEmbed(message, serverQueue.songs, RM);
		if (embeds !== 0) {
			const queueEmbed = await message.channel.send(
				`**Current Page - ${currentPage + 1}/${embeds.length}**`,
				embeds[currentPage]
			);
			await queueEmbed.react("⬅️");
			await queueEmbed.react("⏹");
			await queueEmbed.react("➡️");

			const filter = (reaction, user) =>
				["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) &&
				message.author.id === user.id;
			const collector = queueEmbed.createReactionCollector(filter);

			collector.on("collect", async (reaction, user) => {
				try {
					if (reaction.emoji.name === "➡️") {
						if (currentPage < embeds.length - 1) {
							currentPage++;
							queueEmbed.edit(
								`**Current Page - ${currentPage + 1}/${embeds.length}**`,
								embeds[currentPage]
							);
						}
					} else if (reaction.emoji.name === "⬅️") {
						if (currentPage !== 0) {
							--currentPage;
							queueEmbed.edit(
								`**Current Page - ${currentPage + 1}/${embeds.length}**`,
								embeds[currentPage]
							);
						}
					} else {
						collector.stop();
						reaction.message.reactions.removeAll();
					}
					await reaction.users.remove(message.author.id);
				} catch (e) {
					message.channel.send(e.message)
					serverQueue.connection.dispatcher.end();
					return message.channel.send(
						"**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**"
					);
				}
			});
		} else {
			const embed = new Discord.MessageEmbed()
				.setDescription(`**Current Song - [${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**`)
			message.channel.send(embed)
		}
	} catch (e) {
		message.channel.send(e.message)
		console.log(e)
		serverQueue.connection.dispatcher.end();
		return message.channel.send(
			"**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**"
		);
	}
}

function generateQueueEmbed(message, queue, RM) {
	const embeds = [];
	let k = 10;
	for (let i = 1; i < queue.length; i += 10) {

		const current = queue.slice(i, k);
		let j = i - 1;
		k += 10;
		let info;
		info = current
			.map((track) => `${++j} - [${track.title}](${track.url})`)
			.join("\n");
		if (info !== undefined) {
			const embed = new RM.Discord.MessageEmbed()
				.setTitle("Song Queue\n")
				.setThumbnail(message.guild.iconURL())
				.setColor("GREEN")
				.setDescription(
					`**Current Song - [${queue[0].title}](${queue[0].url})**\n\n**Next Up:**\n${info}`
				)
				.setTimestamp();
			embeds.push(embed);
		}
	}
	if (embeds.length < 1) {
		return 0
	} else {
		return embeds;
	}
}
function commandAlias() {
	return commandInfo.possibleTriggers;
}

function commandHelp() {
	return commandInfo.help;
}
module.exports = {
	runCommand,
	commandAlias,
	commandHelp,
};

console.log("[I] QUEUE initialized [I]");