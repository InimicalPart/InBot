const commandInfo = {
  primaryName: "activity", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["activity"], // These are all commands that will trigger this command.
  help: "Start an activity in a voice channel", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
  slashCommand: new global.SlashCommandBuilder()
    .setName("activity")
    .setDescription("Select which activity to start.")
    .addStringOption((option) =>
      option
        .setName("activity")
        .setDescription("The activity to start.")
        .setRequired(true)
        .addChoices(
          { name: "Awkword", value: "awkword" },
          { name: "Betrayal", value: "betrayal_io" },
          { name: "Blazing 8s", value: "blazing_eights" },
          {
            name: "Checkers in the Park",
            value: "checkers_in_the_park",
          },
          { name: "Chess in the Park", value: "chess_in_the_park" },
          { name: "Doodle Crew", value: "doodlecrew" },
          { name: "Fishington.io", value: "fishington_io" },
          { name: "Land.io", value: "land_io" },
          { name: "Letter League", value: "letterleague" },
          { name: "Poker Night", value: "poker_night" },
          { name: "Putt Party", value: "putt_party" },
          { name: "Sketch Heads", value: "sketch_heads" },
          { name: "Sketchy Artist", value: "sketchy_artist" },
          { name: "SpellCast", value: "spellcast" },
          { name: "Watch Together", value: "watch_together" },
          { name: "Word Snacks", value: "wordsnacks" }
        )
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "The VC where the activity will be. (not required if in vc)"
        )
    ),
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
  let isSlashCommand = false;
  let activity,
    m,
    vc,
    activityNames,
    activityName = null;
  let applications = {
    awkword: "879863881349087252",
    betrayal_io: "773336526917861400",
    blazing_eights: "832025144389533716",
    checkers_in_the_park: "832013003968348200",
    chess_in_the_park: "832012774040141894",
    doodlecrew: "878067389634314250",
    fishington_io: "814288819477020702",
    land_io: "903769130790969345",
    letterleague: "879863686565621790",
    poker_night: "755827207812677713",
    putt_party: "945737671223947305",
    sketch_heads: "902271654783242291",
    sketchy_artist: "879864070101172255",
    spellcast: "852509694341283871",
    watch_together: "880218394199220334",
    wordsnacks: "879863976006127627",
  };
  activityNames = [
    { label: "Awkword", value: "awkword" },
    { label: "Betrayal", value: "betrayal_io" },
    { label: "Blazing 8s", value: "blazing_eights" },
    {
      label: "Checkers in the Park",
      value: "checkers_in_the_park",
    },
    { label: "Chess in the Park", value: "chess_in_the_park" },
    { label: "Doodle Crew", value: "doodlecrew" },
    { label: "Fishington.io", value: "fishington_io" },
    { label: "Land.io", value: "land_io" },
    { label: "Letter League", value: "letterleague" },
    { label: "Poker Night", value: "poker_night" },
    { label: "Putt Party", value: "putt_party" },
    { label: "Sketch Heads", value: "sketch_heads" },
    { label: "Sketchy Artist", value: "sketchy_artist" },
    { label: "SpellCast", value: "spellcast" },
    { label: "Watch Together", value: "watch_together" },
    { label: "Word Snacks", value: "wordsnacks" },
  ];
  if (message.content === "INBOT-COMMAND") isSlashCommand = true;

  if (!isSlashCommand) {
    let row = new RM.Discord.MessageActionRow().addComponents(
      new RM.Discord.MessageSelectMenu()
        .setCustomId("activitySelect-" + message.id)
        .setPlaceholder("No activity selected")
        .addOptions(activityNames)
    );
    let componentFilter = (component) => {
      if (
        component.customId.includes(message.id) &&
        component.customId.includes("activitySelect") &&
        component.user.id === message.author.id
      )
        return true;
      return false;
    };
    message.channel.send({ components: [row] }).then((a) => (m = a));
    let collector = await message.channel.createMessageComponentCollector({
      filter: componentFilter,
      time: 60000,
    });
    collector.on("collect", (component) => {
      activity = component.values[0];
      collector.end();
    });
    collector.on("end", () => {
      if (m) {
        m.edit({ components: [] });
      }
    });
  } else {
    activity = message.options.getString("activity");
    if (message.options.getChannel("channel"))
      vc = message.options.getChannel("channel");
    else {
      //check if user is in vc
      const vcchannel = await message.member.voice.channel;
      if (vcchannel) vc = vcchannel;
      else
        return message.reply({
          content: "You are not in a voice channel!",
          ephemeral: true,
        });
      //   console.log(activity, vc.name);
    }
  }
  let Invite;
  RM.request(
    {
      url: "https://discord.com/api/v8/channels/" + vc.id + "/invites",
      method: "POST",
      body: JSON.stringify({
        max_age: 86400,
        max_uses: 0,
        target_application_id: applications[activity]
          ? applications[activity]
          : application,
        target_type: 2,
        temporary: false,
        validate: null,
      }),
      headers: {
        Authorization: `Bot ${RM.client.token}`,
        "Content-Type": "application/json",
      },
    },
    (err, res, body) => {
      if (err) {
        console.log(err);
        return message.channel.send({
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
      }
      Invite = JSON.parse(body);
      if (Invite.code) {
        for (let i in activityNames) {
          if (activityNames[i].value == activity) {
            activityName = activityNames[i].label;
          }
        }
        message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                message.author.tag +
                  " has started **" +
                  activityName +
                  "** in **" +
                  vc.name +
                  "**!\n\nInvite: https://discord.com/invite/" +
                  Invite.code
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invitation for game " + activityName + "!"),
          ],
        });
        if (isSlashCommand)
          message.reply({
            content:
              "Activity '" +
              activityName +
              "' started in " +
              vc.name +
              "\n\nInvite: <https://discord.com/invite/" +
              Invite.code +
              ">",
            ephemeral: true,
          });
      }
    }
  );
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
