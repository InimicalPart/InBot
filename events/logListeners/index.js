const commandInfo = {
  type: "onStart",
};

async function runEvent(RM, event) {
  //   const discord = require("discord.js");
  //   const client = new discord.Client();
  const client = RM.client;
  client.on("guildBanAdd", async (data) => {
    if (RM?.config?.logs?.types?.ban) {
      console.log(data);
      //find channel that has id of RM.config.logs.channelID
      const mainGuild = await RM.client.guilds.fetch(
        RM.config.settings.mainGuild
      );
      const channel = await mainGuild.channels.fetch(RM.config.logs.channelID);
      const auditLog = await data.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_BAN_ADD",
      });
      const banLog = auditLog.entries.first();
      let { executor, target, reason } = banLog;

      const embed = new RM.Discord.MessageEmbed()
        .setTitle("User Banned")
        .setColor("#ff0000")
        //   .setDescription(
        //     `${
        //       data.user.username + "#" + data.user.discriminator
        //     } was banned from ${data.guild.name + " (" + data.reason + ")"}`
        //   )
        .addField(
          "Banned By",
          `**${executor.username}#${executor.discriminator}** (${executor.id})`
        )
        .addField("Reason", reason)
        .addField(
          "Banned User",
          `**${target.username}#${target.discriminator}** (${target.id})`
        )
        .setThumbnail(target.avatarURL())
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }
  });
  client.on("guildBanRemove", async (data) => {
    if (RM?.config?.logs?.types?.unban) {
      //find channel that has id of RM.config.logs.channelID
      const mainGuild = await RM.client.guilds.fetch(
        RM.config.settings.mainGuild
      );
      const channel = await mainGuild.channels.fetch(RM.config.logs.channelID);
      const auditLog = await data.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_BAN_REMOVE",
      });
      const unbanLog = auditLog.entries.first();
      let { executor, target } = unbanLog;

      const embed = new RM.Discord.MessageEmbed()
        .setTitle("User Unbanned")
        .setColor("#00ff00")
        //   .setDescription(
        //     `${
        //       data.user.username + "#" + data.user.discriminator
        //     } was banned from ${data.guild.name + " (" + data.reason + ")"}`
        //   )
        .addField(
          "Unbanned By",
          `**${executor.username}#${executor.discriminator}** (${executor.id})`
        )
        .addField(
          "Unbanned User",
          `**${target.username}#${target.discriminator}** (${target.id})`
        )
        .setThumbnail(target.avatarURL())
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }
  });
  global.logsEmitter.on("mute", async (data) => {
    if (RM?.config?.logs?.types?.mute) {
      const mainGuild = await RM.client.guilds.fetch(
        RM.config.settings.mainGuild
      );
      const channel = await mainGuild.channels.fetch(RM.config.logs.channelID);
      const user = await client.users.fetch(data?.userid);
      const embed = new RM.Discord.MessageEmbed()
        .setTitle("User Muted")
        .setColor("#ffff00")
        .addField(
          "Muted By",
          `**${data.executor.username}#${data.executor.discriminator}** (${data.executor.id})`
        )
        .addField(
          "Muted User",
          `**${user.username}#${user.discriminator}** (${user.id})`
        )
        .setThumbnail(user.avatarURL())
        .setTimestamp();
      channel.send({ embeds: [embed] });
    }
  });
  global.logsEmitter.on("unmute", async (data) => {
    if (RM?.config?.logs?.types?.unmute) {
      const mainGuild = await RM.client.guilds.fetch(
        RM.config.settings.mainGuild
      );
      const channel = await mainGuild.channels.fetch(RM.config.logs.channelID);
      const user = await client.users.fetch(data?.userid);
      const embed = new RM.Discord.MessageEmbed()
        .setTitle("User Unmuted")
        .setColor("#c3ff00")
        .addField(
          "Unmuted By",
          `**${data.executor.username}#${data.executor.discriminator}** (${data.executor.id})`
        )
        .addField(
          "Unmuted User",
          `**${user.username}#${user.discriminator}** (${user.id})`
        )
        .setThumbnail(user.avatarURL())
        .setTimestamp();
      channel.send({ embeds: [embed] });
    }
  });
  console.log("Listeners ready.");
}
function eventType() {
  return commandInfo.type;
}
module.exports = {
  runEvent,
  eventType,
};
