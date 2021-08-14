const commandInfo = {
  primaryName: "queue", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["queue", "q"], // These are all commands that will trigger this command.
  help: "Gets the server queue.", // This is the general description of the command.
  aliases: ["q"], // These are command aliases that help.js will use
  usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
};

async function runCommand(message, args, RM) {
  if (!require("../../../config.js").cmdQueue) {
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

  const Discord = RM.Discord;

  const { channel } = message.member.voice;
  if (!channel)
    return message.channel.send({
      content: "You need to be in a voice channel to see queue!",
    });
  if (message.guild.me.voice.channel !== message.member.voice.channel) {
    return message.channel.send({
      content: "You need to be in the same voice channel as me!",
    });
  }
  const serverQueue = ops.queue.get(message.guild.id);
  if (!serverQueue)
    return message.channel.send({
      content: "❌ | Nothing playing in this server",
    });
  try {
    let currentPage = 0;
    const embeds = generateQueueEmbed(message, serverQueue.songs, RM);
    if (embeds !== 0) {
      const queueEmbed = await message.channel.send({
        content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
        embeds: [embeds[currentPage]],
      });
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
              queueEmbed.edit({
                content: `**Current Page - ${currentPage + 1}/${
                  embeds.length
                }**`,
                embeds: [embeds[currentPage]],
              });
            }
          } else if (reaction.emoji.name === "⬅️") {
            if (currentPage !== 0) {
              --currentPage;
              queueEmbed.edit({
                content: `**Current Page - ${currentPage + 1}/${
                  embeds.length
                }**`,
                embeds: [embeds[currentPage]],
              });
            }
          } else {
            collector.stop();
            reaction.message.reactions.removeAll();
          }
          await reaction.users.remove(message.author.id);
        } catch (e) {
          message.channel.send({ content: e.message });
          serverQueue.connection.dispatcher.end();
          return message.channel.send({
            content:
              "Missing Permissions - **[ADD_REACTIONS, MANAGE_MESSAGES]**!",
          });
        }
      });
    } else {
      const embed = new Discord.MessageEmbed().setDescription(
        `**Current Song - [${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**`
      );
      message.channel.send({ embeds: [embed] });
    }
  } catch (e) {
    message.channel.send({ content: e.message });
    console.log(e);
    serverQueue.connection.dispatcher.end();
    return message.channel.send({
      content: "Missing Permissions - **[ADD_REACTIONS, MANAGE_MESSAGES]**!",
    });
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
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/857343827223117827/860548004187865098/unknown.png"
        )
        .setColor("GREEN")
        .setDescription(
          `**Current Song - [${queue[0].title}](${queue[0].url})**\n\n**Next Up:**\n${info}`
        )
        .setTimestamp();
      embeds.push(embed);
    }
  }
  if (embeds.length < 1) {
    return 0;
  } else {
    return embeds;
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
