const commandInfo = {
	"possibleTriggers": ["play", "p", "P", "Play"],
	"help": "`.play: plays a song of our choice from youtube\nAliases: .p"
}

async function runCommand(message, args, RM) {
	try {
		const queue2 = global.queue2;
		const queue3 = global.queue3;
		const queue = global.queue;
		const games = global.games

		let ops = {
			queue2: queue2,
			queue: queue,
			queue3: queue3,
			games: games
		}

		const Discord = RM.Discord;
		const client = RM.client;
		const { Util } = require('discord.js');
		const { GOOGLE_API_KEY } = require('../../config');
		const YouTube = require("simple-youtube-api");
		const youtube = new YouTube(GOOGLE_API_KEY);
		const ytdl = require('ytdl-core');

		if (!args[0]) return message.channel.send("**Please Enter Song Name Or Link!**")
		args = message.content.split(' ');
		const searchString = args.slice(1).join(' ');
		const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');

		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();

			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, message, channel, true);
			}
			return message.channel.send(`**Playlist \`${playlist.title}\` has been added to the queue!**`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 1);
					var video = await youtube.getVideoByID(videos[0].id);
				} catch (err) {
					return message.channel.send('❌ **No Matches!**')
				}
			}
			return handleVideo(video, message, channel);
		}
		function addzeros(number, length) { var my_string = '' + number; while (my_string.length < length) { my_string = '0' + my_string; } return my_string; }
		async function handleVideo(video, message, channel, playlist = false) {
			const serverQueue = ops.queue.get(message.guild.id);
			const songInfo = await ytdl.getInfo(video.id);
			const song = {
				id: video.id,
				title: Util.escapeMarkdown(video.title),
				url: `https://www.youtube.com/watch?v=${video.id}`,
				thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
				duration: video.duration,
				time: songInfo.videoDetails.lengthSeconds,
				isLive: songInfo.videoDetails.isLiveContent
			};

			if (serverQueue) {
				serverQueue.songs.push(song);
				if (playlist) return undefined;
				else {
					const sembed = new Discord.MessageEmbed()
						.setColor("GREEN")
						.setTitle("Added To Queue")
						.setThumbnail(song.thumbnail)
						.setTimestamp()
						.setDescription(`**${song.title}** has been added to queue!\n\nRequested By **${message.author.username}**`)
						.setFooter(message.member.displayName, message.author.displayAvatarURL());
					message.channel.send(sembed)
				}
				return undefined;
			}

			const queueConstruct = {
				textChannel: message.channel,
				voiceChannel: channel,
				connection: null,
				songs: [],
				volume: 2,
				playing: true,
				loop: false,
			};
			ops.queue.set(message.guild.id, queueConstruct);
			queueConstruct.songs.push(song);
			try {
				const connection = await channel.join();
				queueConstruct.connection = connection;
				play(queueConstruct.songs[0]);
			} catch (error) {
				console.error(`I could not join the voice channel: ${error.message}`);
				ops.queue.delete(message.guild.id);
				await channel.leave();
				return message.channel.send(`I could not join the voice channel: ${error.message}`);
			}
		};
		async function play(song) {
			const queue = ops.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				ops.queue.delete(message.guild.id);
				return;
			};

			let npmin = Math.floor(song.time / 60);
			let npsec = song.time - npmin * 60
			let np;
			if (song.isLive) {
				np = "[LIVE]"
			} else {
				np = `${addzeros(npmin, 2)}:${addzeros(npsec, 2)}`.split(' ')
			}
			const dispatcher = queue.connection.play(ytdl(song.url, { highWaterMark: 1 << 20, quality: "highestaudio" }))
				.on('finish', () => {
					if (queue.loop) {
						queue.songs.push(queue.songs.shift());
						return play(queue.songs[0]);
					}
					queue.songs.shift();
					play(queue.songs[0]);
				})
				.on('error', error => console.error(error));

			dispatcher.setVolumeLogarithmic(queue.volume / 5);
			const embed = new Discord.MessageEmbed()
				.setColor("GREEN")
				.setTitle('Now Playing\n')
				.setThumbnail(song.thumbnail)
				.setTimestamp()
				.setDescription(`🎵 Now playing:\n **${song.title}** 🎵\n\n Song Length: **${np}**`)
				.setFooter(message.member.displayName, message.author.displayAvatarURL());
			queue.textChannel.send(embed);
		}
	} catch (e) {
		message.channel.send(e.message)
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
	commandHelp
}

console.log("[I] PLAY initialized [I]")