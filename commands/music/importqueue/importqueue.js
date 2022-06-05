const { queue } = require("..");

const commandInfo = {
  primaryName: "importqueue", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["importqueue"], // These are all commands that will trigger this command.
  help: "Import queue", // This is the general description of the command.
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
  }

  //get message attachment
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

  const attachment = message.attachments.first();
  if (!attachment || !attachment.name.endsWith(".json")) {
    return message.reply({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Please attach the exported queue to your message.")
          .setThumbnail(message.guild.iconURL())
          .setTitle(attachment ? "Invalid file type" : "No attachment"),
      ],
    });
  }
  //downlaod file using attachment.url
  RM.request.get(attachment.url, callback);
  async function callback(_err, _res, body) {
    let json;
    try {
      json = JSON.parse(body);
    } catch (e) {
      return message.reply({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("The attachment is not a valid queue.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Invalid Attachment"),
        ],
      });
    }
    message.channel
      .send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("ORANGE")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("Importing queue...")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Importing queue..."),
        ],
      })
      .then(async (msg) => {
        let amountSongs = 0;
        for (let i = 0; i < json.length; i++) {
          if (i % 5 === 0) {
            await msg.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("ORANGE")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription(
                    `Importing queue... ${i}/${json.length - 1} songs`
                  )
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Importing queue..."),
              ],
            });
          }

          if (json[i].loop) {
            queue.setRepeatMode(json[i].loop);
          } else {
            if (json[i].url) {
              amountSongs++;
              let song = await queue
                .play(json[i].url)
                .catch((_) => {
                  if (!guildQueue) queue.stop();
                })
                .then(() => {
                  if (queue.isPlaying) {
                    queue.setPaused(true);
                  }
                });
              if (json[i].data) {
                song.setData(json[i].data);
              }
            } else {
              try {
                queue.stop();
              } catch (e) {}
              return message.reply({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor({
                      name: message.author.tag,
                      iconURL: message.author.avatarURL(),
                    })
                    .setDescription("The attachment is not a valid queue.")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Invalid Attachment"),
                ],
              });
            }
          }
        }
        queue.setPaused(false);

        msg.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(`Imported ${amountSongs} songs.`)
              .setThumbnail(message.guild.iconURL())
              .setTitle("Import Successful"),
          ],
        });
      });
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
