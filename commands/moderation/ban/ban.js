const commandInfo = {
  primaryName: "ban",
  possibleTriggers: ["ban"],
  help: "Allows an admin to ban a member.",
  aliases: [],
  usage: "[COMMAND] <user/user id> [reason]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "mod",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
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
  const { MessageEmbed } = RM.Discord;
  const db = RM.db; // TODO: Make it not use quick.db
  try {
    if (
      !message.member.permissions.has(RM.Discord.Permissions.FLAGS.BAN_MEMBERS)
    )
      return message.channel.send({
        content: "You need permission [BAN_MEMBERS] to be able to ban users.",
      });
    if (
      !message.guild.me.permissions.has(
        RM.Discord.Permissions.FLAGS.BAN_MEMBERS
      )
    )
      return message.channel.send({
        content: "I need permission [BAN_MEMBERS] to be able to ban users.",
      });
    if (!args[0])
      return message.channel.send({
        content: "Provide a user that you want to ban.",
      });
    let banMember;
    try {
      banMember =
        message.mentions.members.first() ||
        (await message.guild.members.fetch(args[0])) ||
        (await message.guild.members.fetch(
          (r) =>
            r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
        )) ||
        (await message.guild.members.fetch(
          (r) =>
            r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
        )) ||
        (await message.guild.members.fetch(args[0])) ||
        null;
    } catch (e) {
      banMember = null;
    }
    if (!banMember)
      return message.channel.send({
        content: "That user is not in the server",
      });
    if (banMember.user) {
      banMember = banMember.user;
    }
    if (banMember === message.member)
      return message.channel.send({ content: "You can't ban yourself." });

    var reason = args.slice(1).join(" ");

    // if (!banMember.bannable)
    //   return message.channel.send({ content: "I cannot ban that user" });
    try {
      message.guild.members.ban(banMember, {
        days: 7,
        reason: reason,
      });
      banMember
        .send({
          content: `You have been banned from **${message.guild.name}** for '${
            reason || "No Reason"
          }'`,
        })
        .catch(() => null); // user probably has dms closed
    } catch {
      message.guild.members
        .ban(banMember, {
          days: 7,
          reason: reason,
        })
        .catch(() => null);
    }
    if (reason) {
      var sembed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL(),
        })
        .setDescription(
          `**${banMember.username}** has been banned for ${reason}`
        );
      message.channel.send({ embeds: [sembed] });
    } else {
      var sembed2 = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL(),
        })
        .setDescription(`**${banMember.username}** has been banned`);
      message.channel.send({ embeds: [sembed2] });
    }
    let channel = db.fetch(`modlog_${message.guild.id}`);
    if (channel == null) return;

    if (!channel) return;

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.guild.name} Modlogs`,
        iconURL: message.guild.iconURL(),
      })
      .setColor("GREEN")
      .setThumbnail(
        banMember.displayAvatarURL({
          dynamic: true,
        })
      )
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
      .addField("**Action**", "ban")
      .addField("**Banned User**", banMember.username)
      .addField("**ID**", `${banMember.id}`)
      .addField("**Banned By**", message.author.username)
      .addField("**Reason**", `${reason || "**No Reason**"}`)
      .addField("**Date**", message.createdAt.toLocaleString())
      .setTimestamp();

    var sChannel = message.guild.channels.cache.get(channel);
    if (!sChannel) return;
    sChannel.send({ embeds: [embed] });
  } catch (e) {
    console.log(e);
    return message.channel.send({ content: `**${e.message}**` });
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
