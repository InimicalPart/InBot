const commandInfo = {
    primaryName: "lyrics",
    possibleTriggers: ["ly", "lyrics", "lyric"],
    help: "shows the lyrics to the current song / or a song",
    aliases: ["ly", "lyric"],
    usage: "[COMMAND] <name of a song>", // [COMMAND] gets replaced with the command and correct prefix later
    category: "music",
};

async function runCommand(message, args, RM) {
    const { MessageEmbed } = RM.Discord;
    const Genius = require("genius-lyrics");
    const GClient = new Genius.Client();

    const queue2 = global.queue2;
    const queue3 = global.queue3;
    const queue = global.queue;
    const games = global.games;

    let ops = {
        queue2: queue2,
        queue: queue,
        queue3: queue3,
        games: games,
    };

    const { channel } = message.member.voice;
    if (!channel)
        return message.channel.send(
            "I'm sorry but you need to be in a voice channel to see lyrics!"
        );
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
        return message.channel.send(
            "**You Have To Be In The Same Channel With The Bot!**"
        );
    }
    const serverQueue = ops.queue.get(message.guild.id);
    if (!serverQueue)
        return message.channel.send("❌ **Nothing playing in this server**");

    let songName = serverQueue.songs[0].title;
    songName = songName.replace(
        /lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|official video music|\(official video music\)|extended|hd|(\[.+\])/gi,
        ""
    );

    const sentMessage = await message.channel.send(
        "👀 Searching for lyrics... 👀"
    );

    try {
        const searches = await GClient.songs.search(songName);
        const firstSong = searches[0];
        const lyrics = await firstSong.lyrics();

        const lyembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Lyrics for ${songName}`)
            .setDescription(lyrics);
        await sentMessage.edit("", lyembed);
    } catch (e) {
        message.channel.send(`:x: Error when fetching lyrics - ${e}`);
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
