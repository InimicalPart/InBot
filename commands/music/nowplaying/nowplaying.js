const commandInfo = {
  primaryName: "nowplaying",
  possibleTriggers: ["np", "nowplaying"],
  help: "Shows current song playing",
  aliases: ["np"],
  usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  if (!require("../../../config.js").cmdNowplaying) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Command disabled by Administrators.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Command Disabled"),
      ],
    });
  }
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

  const { MessageEmbed } = RM.Discord;

  try {
    const serverQueue = ops.queue.get(message.guild.id);
    if (!serverQueue)
      return message.channel.send({
        content: "❌ | Nothing playing in this server!",
      });
    let video = serverQueue.songs[0];
    let description;
    if (video.duration == "Live Stream") {
      description = "[LIVE]";
    } else {
      description = playbackBar(video);
    }
    const videoEmbed = new MessageEmbed()
      .setThumbnail(video.thumbnail)
      .setColor("GREEN")
      .setTitle(video.title)
      .setDescription(description)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();
    message.channel.send({ embeds: [videoEmbed] });
    return;

    function playbackBar(video) {
      const passedTimeInMS =
        serverQueue.connection.dispatcher.streamTime + global.seekMS;
      const passedTimeInMSObj = {
        seconds: Math.floor((passedTimeInMS / 1000) % 60),
        minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
        hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24),
      };
      const passedTimeFormatted = formatDuration(passedTimeInMSObj);

      const totalDurationObj = video.duration;
      const totalDurationFormatted = formatDuration(totalDurationObj);

      let totalDurationInMS = 0;
      Object.keys(totalDurationObj).forEach(function (key) {
        if (key == "hours") {
          totalDurationInMS =
            totalDurationInMS + totalDurationObj[key] * 3600000;
        } else if (key == "minutes") {
          totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 60000;
        } else if (key == "seconds") {
          totalDurationInMS = totalDurationInMS + totalDurationObj[key] * 100;
        }
      });
      const playBackBarLocation = Math.round(
        (passedTimeInMS / totalDurationInMS) * 10
      );

      let playBack = "";
      for (let i = 1; i < 21; i++) {
        if (playBackBarLocation == 0) {
          playBack = "⚪▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
          break;
        } else if (playBackBarLocation == 11) {
          playBack = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⚪";
          break;
        } else if (i == playBackBarLocation * 2) {
          playBack = playBack + "⚪";
        } else {
          playBack = playBack + "▬";
        }
      }
      playBack = `${playBack}\n\n\`${passedTimeFormatted} / ${totalDurationFormatted}\``;
      return playBack;
    }

    function formatDuration(durationObj) {
      const duration = `${durationObj.hours ? durationObj.hours + ":" : ""}${
        durationObj.minutes ? durationObj.minutes : "00"
      }:${
        durationObj.seconds < 10
          ? "0" + durationObj.seconds
          : durationObj.seconds
          ? durationObj.seconds
          : "00"
      }`;
      return duration;
    }
  } catch (e) {
    return message.channel.send({ content: "Error! " + e.message });
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
function getSlashCommand() {
  return commandInfo.slashCommand;
}
function getSlashCommandJSON() {
  if (commandInfo.slashCommand.length !== null)
    return commandInfo.slashCommand.toJSON();
  else return null;
}
module.exports = {
  runCommand,
  commandTriggers,
  commandHelp,
  commandAliases,
  commandPrim,
  commandUsage,
  commandCategory,
  getSlashCommand,
  getSlashCommandJSON,
};
