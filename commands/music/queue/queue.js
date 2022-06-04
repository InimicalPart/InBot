const commandInfo = {
  primaryName: "queue", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["queue", "q"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
  reqPermissions: [],
  slashCommand: null,
  /*
  new global.SlashCommandBuilder()
    .setName("echo")
    .setDescription("Replies with your input!")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input to echo back")
        .setRequired(true)
    ),
  */
};

async function runCommand(message, args, RM, data) {
  //Check if command is disabled
  if (
    require("json5")
      .parse(
        require("fs").readFileSync(
          RM.path.resolve(global.dirName, "config.jsonc"),
          "utf-8"
        )
      )
      .disabledCommands.includes(commandInfo.primaryName.toLowerCase())
  ) {
    if (data)
      return message.reply({
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
        ephemeral: true,
      });
    else
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

  let guildQueue = RM.client.player.getQueue(message.guild.id);
  if (!guildQueue) {
    if (data)
      return message.reply({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("There is no music playing.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("No Music Playing"),
        ],
        ephemeral: true,
      });
    else
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("There is no music playing.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("No Music Playing"),
        ],
      });
  }

  let allSongs = guildQueue.songs;

  let queue = [];
  for (let i = 0; i < allSongs.length; i++) {
    queue.push(
      "**" +
        i +
        ":** " +
        " [" +
        allSongs[i].name
          .replace(/\[.*\]/g, "")
          .replace(/\(.*\)/g, "")
          .trim() +
        "](" +
        allSongs[i].url +
        ")" +
        // " by " +
        // allSongs[i].author.trim() +
        " [" +
        allSongs[i].duration +
        "]"
    );
  }
  //split the queue into chunks of 10
  let chunks = [];
  let queueCopy = queue.slice();
  queueCopy.shift();
  for (let i = 0; i < queueCopy.length; i += 10) {
    chunks.push(queueCopy.slice(i, i + 10));
  }
  let ProgressBar;
  try {
    ProgressBar = guildQueue?.createProgressBar();
  } catch (e) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("There is no music playing in this server.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Music Playing"),
      ],
    });
  }
  let currenttime = String(ProgressBar.prettier)
    .replace(/.*\]\[/g, "")
    .replace(/\/.*/g, "");
  let totaltime = guildQueue.nowPlaying.duration;
  let currentTimeSeconds = convertToS(currenttime);
  let totalTimeSeconds = convertToS(totaltime);
  let timeLeft = convertFromS(totalTimeSeconds - currentTimeSeconds);
  //create an embed for each chunk
  let embeds = [];
  let loopMsg = "";
  let RepeatMode = {
    SONG: 1,
    QUEUE: 2,
    1: "Song",
    2: "Queue",
    "1_icon": "🔂",
    "2_icon": "🔁",
  };
  if (guildQueue.repeatMode !== 0) {
    loopMsg =
      " | " +
      RepeatMode[guildQueue.repeatMode + "_icon"] +
      " Looping: " +
      RepeatMode[guildQueue.repeatMode];
  }
  for (let i = 0; i < chunks.length; i++) {
    if (i === 0) {
      embeds.push(
        new RM.Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            ":loud_sound: Now playing:" +
              "\n" +
              `[${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url}) [${timeLeft} left]\n\n` +
              ":loud_sound: Up next:\n" +
              chunks[i].join("\n")
          )
      );
    } else
      embeds.push(
        new RM.Discord.MessageEmbed()
          .setColor("ORANGE")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(chunks[i].join("\n"))
          .setTitle("Queue")
      );
  }
  //send the embeds as pages, that means that show the first embed, then when user reacts with ➡️, show the next embed, and so on
  let page = data ? 1 : parseInt(args[0]);
  if (isNaN(page)) page = 1;
  if (page < 1) page = 1;
  if (page == 1 && embeds.length == 0) {
    return message.reply({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            ":loud_sound: Now playing:" +
              "\n" +
              `[${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url}) [${timeLeft} left]\n\n` +
              ":loud_sound: Up next:\n" +
              "*~ Nothing ~*"
          )
          .setFooter({ text: "Page 1/1" + loopMsg }),
      ],
    });
  }
  if (page > embeds.length)
    return message.channel.send("There are no tracks on that page!");
  if (data)
    await message.reply({
      embeds: [
        embeds[page - 1].setFooter({
          text:
            "Page " +
            page +
            "/" +
            chunks.length +
            " | Songs in queue: " +
            queueCopy.length +
            " | Total length: " +
            getTotalLength() +
            loopMsg,
        }),
      ],
      ephemeral: data.ephemeral,
    });
  else
    await message.channel.send({
      embeds: [
        embeds[page - 1].setFooter({
          text:
            "Page " +
            page +
            "/" +
            chunks.length +
            " | Songs in queue: " +
            queueCopy.length +
            " | Total length: " +
            getTotalLength() +
            loopMsg,
        }),
      ],
    });
  function convertToS(time) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (time.split(":").length == 3) {
      hours = time.split(":")[0];
      minutes = time.split(":")[1];
      seconds = time.split(":")[2];
    } else {
      minutes = time.split(":")[0];
      seconds = time.split(":")[1];
    }
    return parseInt(hours * 3600) + parseInt(minutes * 60) + parseInt(seconds);
  }
  function convertFromS(seconds) {
    var hrs = ~~(seconds / 3600);
    var mins = ~~((seconds % 3600) / 60);
    var secs = ~~seconds % 60;
    var ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  function getTotalLength() {
    //the duration looks like <min>:<seconds>, the property "duration"
    //is in the format of <min>:<seconds>
    if (guildQueue.repeatMode !== 0) return "♾️";
    let totalLength = 0;
    let copyOfQueue = guildQueue.songs.slice();
    copyOfQueue.shift();

    for (let i = 0; i < copyOfQueue.length; i++) {
      let song = copyOfQueue[i];
      let duration = song.duration;
      let hours = 0;
      let minutes = 0;
      let seconds = 0;
      if (duration.split(":").length == 3) {
        hours = duration.split(":")[0];
        minutes = duration.split(":")[1];
        seconds = duration.split(":")[2];
      } else {
        minutes = duration.split(":")[0];
        seconds = duration.split(":")[1];
      }
      totalLength +=
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    }
    //convert seconds to hours:minutes:seconds
    var hrs = ~~(totalLength / 3600);
    var mins = ~~((totalLength % 3600) / 60);
    var secs = ~~totalLength % 60;
    var ret = "";
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
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
function commandPermissions() {
  return commandInfo.reqPermissions || null;
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
  commandPermissions,
  getSlashCommandJSON,
};
