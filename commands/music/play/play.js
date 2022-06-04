const commandInfo = {
  primaryName: "play", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["play", "p"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["p"], // These are command aliases that help.js will use
  usage: "[COMMAND] <song>", // [COMMAND] gets replaced with the command and correct prefix later
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

async function runCommand(message, args, RM) {
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
  } // ill add the thing in index to have client.player mk
  let isPlaylist = false;
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:980471497057501205> *Processing command...*"
        ),
      ],
    })
    .then(async (m) => {
      if (!args[0]) {
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a song to play.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("No Song Specified"),
          ],
        });
      }
      let guildQueue = RM.client.player.getQueue(message.guild.id);

      let queue = RM.client.player.createQueue(message.guild.id);
      try {
        await queue.join(message.member.voice.channel);
      } catch (e) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You are not in a voice channel.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Not in a voice channel"),
          ],
        });
      }
      //check if args.join(" ") is an url
      let song = null;
      if (
        args.join(" ").startsWith("https://open.spotify.com/playlist") ||
        args.join(" ").startsWith("https://open.spotify.com/album") ||
        (args.join(" ").startsWith("https://music.youtube.com/") &&
          args.join(" ").includes("&list=")) ||
        (args.join(" ").startsWith("https://www.youtube.com/") &&
          args.join(" ").includes("&list="))
      ) {
        let finalURL = args.join(" ");
        if (
          args.join(" ").startsWith("https://music.youtube.com/") ||
          args.join(" ").startsWith("https://www.youtube.com/")
        ) {
          finalURL = `https://www.youtube.com/playlist?list=${getURLQuery(
            args.join(" "),
            "list"
          )}`;
        }
        console.log(finalURL);
        song = await queue.playlist(finalURL).catch((err) => {
          if (!guildQueue) queue.stop();
        });
        isPlaylist = true;
      } else {
        song = await queue.play(args.join(" ")).catch((_) => {
          if (!guildQueue) queue.stop();
        });
      }
      if (!song) {
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "Could not find " + (isPlaylist ? "playlist" : "song")
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Could not find " + (isPlaylist ? "playlist" : "song")),
          ],
        });
      } else {
        let songName = song.name.replace(/\[.*\]/g, "").replace(/\(.*\)/g, "");
        console.log(song);
        console.log(queue.songs);
        if (queue.isPlaying) {
          if (!isPlaylist)
            return m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("GREEN")
                  .setAuthor({
                    name:
                      "| Added to queue (#" + (queue?.songs?.length - 1) + ")",
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription(
                    `[${songName}](${song.url}) [${song.duration}]`
                  ),
              ],
            });
          else
            return m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("GREEN")
                  .setAuthor({
                    name: "| Playlist added to queue",
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription(
                    `**${song.songs.length}** songs added to queue.`
                  ),
              ],
            });
        } else {
          let messageComponents =
            new RM.Discord.MessageActionRow().addComponents(
              new RM.Discord.MessageButton()
                .setLabel("Pause & Resume")
                .setStyle("SUCCESS")
                .setCustomId("inbot-pauseandresume"),
              new RM.Discord.MessageButton()
                .setLabel("Skip")
                .setStyle("PRIMARY")
                .setCustomId("inbot-skip"),
              new RM.Discord.MessageButton()
                .setLabel("Stop")
                .setStyle("DANGER")
                .setCustomId("inbot-stop"),
              new RM.Discord.MessageButton()
                .setLabel("Show Queue")
                .setStyle("SECONDARY")
                .setCustomId("inbot-showqueue")
            );
          if (!isPlaylist)
            m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("GREEN")
                  .setAuthor({
                    name: "| Now Playing",
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription(
                    `[${songName}](${song.url}) [${song.duration}]`
                  ),
              ],
              components: [messageComponents],
            });
          else
            m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("GREEN")
                  .setAuthor({
                    name: "| Now Playing",
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription(
                    `Playlist added!\n[${song.songs[0].name}](${song.songs[0].url}) [${song.songs[0].duration}]`
                  ),
              ],
              components: [messageComponents],
            });

          let componentFilter = (component) => {
            return !component.user.bot;
          };
          let componmentCollector =
            await message.channel.createMessageComponentCollector({
              filter: componentFilter,
            });
          componmentCollector.on("collect", async (component) => {
            component.author = message.author;
            component.guild = message.guild;
            if (component.customId === "inbot-showqueue") {
              let queueCommand = RM["cmdQueue"];
              queueCommand.runCommand(component, args, RM, {
                ephemeral: true,
              });
            } else if (component.customId === "inbot-skip") {
              RM["cmdSkip"].runCommand(component, args, RM, {
                ephemeral: true,
              });
            } else if (component.customId === "inbot-stop") {
              RM["cmdStop"].runCommand(component, args, RM, {
                ephemeral: true,
              });
            } else if (component.customId === "inbot-pauseandresume") {
              if (!queue.paused) {
                RM["cmdPause"].runCommand(component, args, RM, {
                  ephemeral: true,
                });
              } else {
                RM["cmdResume"].runCommand(component, args, RM, {
                  ephemeral: true,
                });
              }
            }
          });
        }
      }
    });
  function getURLQuery(url, variable) {
    var query = url.split("?")[1];
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return null;
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
