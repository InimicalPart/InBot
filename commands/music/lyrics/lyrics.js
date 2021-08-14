const commandInfo = {
  primaryName: "lyrics",
  possibleTriggers: ["ly", "lyrics", "lyric"],
  help: "shows the lyrics to the current song / or a song",
  aliases: ["ly", "lyric"],
  usage: "[COMMAND] <name of a song>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
};

async function runCommand(message, args, RM) {
  if (!require("../../../config.js").cmdLyrics) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription("Command disabled by Administrators.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Command Disabled"),
      ],
    });
  }
  const { MessageEmbed } = RM.Discord;
  const Genius = require("genius-lyrics");
  const GClient = new Genius.Client();

  const queue2 = global.sQueue2;
  const queue3 = global.sQueue3;
  const queue = global.sQueue;
  const games = global.games;

  let ops = {
    queue2: queue2,
    queue: queue,
    queue3: queue3,
    games: games,
  };

  const { channel } = message.member.voice;
  if (!channel)
    return message.channel.send({content:
      "I'm sorry but you need to be in a voice channel to see lyrics!"
    });
  if (message.guild.me.voice.channel !== message.member.voice.channel) {
    return message.channel.send({
      content: "**You Have To Be In The Same Channel With The Bot!**",
    });
  }
  const serverQueue = ops.queue.get(message.guild.id);
  if (!serverQueue)
    return message.channel.send({
      content: "❌ **Nothing playing in this server**",
    });

  let songName = serverQueue.songs[0].title;
  songName = songName.replace(
    /lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|official video music|\(official video music\)|extended|hd|(\[.+\])/gi,
    ""
  );

  const sentMessage = await message.channel.send({
    content: "👀 Searching for lyrics... 👀",
  });

  try {
    const searches = await GClient.songs.search(songName);
    const firstSong = searches[0];
    const lyrics = await firstSong.lyrics();

    const lyembed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`Lyrics for ${songName}`)
      .setDescription(lyrics);
    await sentMessage.edit({ content: "", embeds: [lyembed] });
  } catch (e) {
    message.channel.send({ content: `:x: Error when fetching lyrics - ${e}` });
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
  commandCategory,
};
