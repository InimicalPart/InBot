const commandInfo = {
  "possibleTriggers": ["pause", "Pause"],
  "help": "`.pause`: pauses the current playing song\nAliases: *none*"
}

async function runCommand(message, args, RM) {
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

  const serverQueue = ops.queue.get(message.guild.id);
  const { channel } = message.member.voice;

  try {

    if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to pause music!');
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send("**You Have To Be In The Same Channel With The Bot!**");
    };
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true);
      return message.channel.send('**Paused** ⏸');
    }
    return message.channel.send(':x: **There is Nothing Playing!**');
  } catch {
    serverQueue.connection.dispatcher.end();
    await channel.leave();
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

console.log("[I] PAUSE initialized [I]")