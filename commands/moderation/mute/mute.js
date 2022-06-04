const commandInfo = {
  primaryName: "mute", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["mute"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "mod",
  slashCommand: null,
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
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:980471497057501205> *Processing command...*"
        ),
      ],
    })
    .then(async (m) => {
      let user;
      if (args[0]) {
        try {
          user =
            message.mentions.members.first() ||
            (await message.guild.members.fetch(args[0])) ||
            (await message.guild.members.fetch(
              (r) =>
                r.user.username.toLowerCase() ===
                args.join(" ").toLocaleLowerCase()
            )) ||
            (await message.guild.members.fetch(
              (r) =>
                r.displayName.toLowerCase() ===
                args.join(" ").toLocaleLowerCase()
            )) ||
            (await message.guild.members.fetch(args[0])) ||
            null;
        } catch (e) {
          user = null;
        }
      } else {
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You must specify a user.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      //make sure author has the permission "MUTE_MEMBERS"
      if (
        !message.member.permissions.has(
          RM.Discord.Permissions.FLAGS.MUTE_MEMBERS
        )
      )
        return m.edit({
          content:
            "You need permission [MUTE_MEMBERS] to be able to mute users.",
        });
      let mutedRole;
      let assignedBotRole;
      await message.guild.roles.fetch().then(async (roles) => {
        roles.forEach((role) => {
          if (role?.name?.toLowerCase() === "muted") {
            mutedRole = role;
          }
          if (role?.tags?.botId === RM.client.user.id) {
            assignedBotRole = role;
          }
        });
      });

      if (!mutedRole) {
        await message.guild.roles
          .create({
            name: "Muted",
            color: "#a9a9a9",
            permissions: [],
            position: assignedBotRole.position - 1,
            reason: "Muted role created by the bot.",
          })
          .then(async (role) => {
            mutedRole = role;
            let channels = await message.guild.channels.fetch();
            channels.forEach((channel) => {
              channel.permissionOverwrites.create(mutedRole, {
                ADD_REACTIONS: false,
                PRIORITY_SPEAKER: false,
                STREAM: false,
                SEND_MESSAGES: false,
                SEND_TTS_MESSAGES: false,
                EMBED_LINKS: false,
                ATTACH_FILES: false,
                SPEAK: false,
                USE_VAD: false,
                USE_APPLICATION_COMMANDS: false,
                REQUEST_TO_SPEAK: false,
                USE_PUBLIC_THREADS: false,
                CREATE_PUBLIC_THREADS: false,
                USE_PRIVATE_THREADS: false,
                CREATE_PRIVATE_THREADS: false,
                SEND_MESSAGES_IN_THREADS: false,
              });
            });
          });
      }
      console.log(mutedRole);

      if (user) {
        if (user.id === message.author.id) {
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You can't mute yourself.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
        }
        if (user.roles.cache.has(mutedRole.id)) {
          return m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription(`${user} is already muted.`)
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
        }

        user.roles
          .add(mutedRole.id)
          .then(() => {
            global.logsEmitter.emit("mute", {
              executor: message.author,
              guild: message.guild,
              userid: user.id,
            });
            m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("GREEN")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription(
                    "User **" +
                      user.user.username +
                      "#" +
                      user.user.discriminator +
                      "** (" +
                      user.id +
                      ") has been muted."
                  )
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Success"),
              ],
            });
          })
          .catch((e) => {
            m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("An error occured.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Error"),
              ],
            });
            console.log(e);
          });
      }
    });
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
