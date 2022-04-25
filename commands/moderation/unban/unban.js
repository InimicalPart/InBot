const commandInfo = {
  primaryName: "unban",
  possibleTriggers: ["unban"],
  help: "Allows an admin to unban a user",
  aliases: [],
  usage: "[COMMAND] <user/user id>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "mod",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  if (!require("../../../config.js").cmdUnban) {
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
  const db = RM.db;

  if (!message.member.permissions.has(RM.Discord.Permissions.FLAGS.BAN_MEMBERS))
    return message.channel.send({
      content:
        "**You Dont Have The Permissions To Unban Someone! - [BAN_MEMBERS]**",
    });

  if (!args[0])
    return message.channel.send({ content: "**Please Enter A Name!**" });

  let bannedMemberInfo = await message.guild.fetchBans();

  let bannedMember;
  bannedMember =
    bannedMemberInfo.find(
      (b) => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()
    ) ||
    bannedMemberInfo.get(args[0]) ||
    bannedMemberInfo.find(
      (bm) => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase()
    );
  if (!bannedMember)
    return message.channel.send({
      content:
        "**Please Provide A Valid Username, Tag Or ID Or The User Is Not Banned!**",
    });

  let reason = args.slice(1).join(" ");

  if (
    !message.guild.me.permissions.has(RM.Discord.Permissions.FLAGS.BAN_MEMBERS)
  )
    return message.channel.send({
      content: "**I Don't Have Permissions To Unban Someone! - [BAN_MEMBERS]**",
    });
  try {
    if (reason) {
      message.guild.members.unban(bannedMember.user.id, reason);
      var sembed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL(),
        })
        .setDescription(
          `**${bannedMember.user.tag} has been unbanned for ${reason}**`
        );
      message.channel.send({ embeds: [sembed] });
    } else {
      message.guild.members.unban(bannedMember.user.id, reason);
      var sembed2 = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL(),
        })
        .setDescription(`**${bannedMember.user.tag} has been unbanned**`);
      message.channel.send({ embeds: [sembed2] });
    }
  } catch {}

  let channel = db.fetch(`modlog_${message.guild.id}`);
  if (!channel) return;

  let embed = new MessageEmbed()
    .setColor("#ff0000")
    .setThumbnail(
      bannedMember.user.displayAvatarURL({
        dynamic: true,
      })
    )
    .setAuthor({
      name: `${message.guild.name} Modlogs`,
      iconURL: message.guild.iconURL(),
    })
    .addField("**Moderation**", "unban")
    .addField("**Unbanned**", `${bannedMember.user.username}`)
    .addField("**ID**", `${bannedMember.user.id}`)
    .addField("**Moderator**", message.author.username)
    .addField("**Reason**", `${reason}` || "**No Reason**")
    .addField("**Date**", message.createdAt.toLocaleString())
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
    .setTimestamp();

  var sChannel = message.guild.channels.cache.get(channel);
  if (!sChannel) return;
  sChannel.send({ embeds: [embed] });
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
}; /* */ /* */ /* */ /* */ /* */

/* */
/* */
/* */
/* */
/* */
/* */
/*
------------------[Instruction]------------------

1. Make a directory in commands/ with your command name
2. Inside that directory, make a "<command name>.js" file
3. Copy the contents of TEMPLATE.js and paste it in the <command name>.js file and modify it to your needs.
4. In index.js add to the top:
"const cmd<cmdNameHere> = require('./commands/<command name>/<command name>.js');" at the top.

-------------------------------------------------

To get all possible triggers, from index.js call
"cmd<cmdname>.commandTriggers()"

To call the command, from index.js call
"cmd<cmdname>.runCommand(message, arguments, requiredModules);"

To check if possible triggers has the command call
"cmd<cmdname>.commandTriggers().includes(command)"

------------------[Instruction]------------------
*/
/* */
/* */
/* */
/* */
/* */
