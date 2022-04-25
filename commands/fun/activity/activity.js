const commandInfo = {
  primaryName: "activity", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["activity", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
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
        .addChoice("Poker Night", "poker_night")
        .addChoice("Betrayal", "betrayal")
        .addChoice("YT Together", "youtube_together")
        .addChoice("Watch Together Dev", "watch_together_dev")
        .addChoice("Fishington", "fishington")
        .addChoice("Chess in the Park", "chess_in_the_park")
        .addChoice("Chess in the Park Development", "chess_in_the_park_dev")
        .addChoice("Doodle Crew", "doodlecrew")
        .addChoice("Word Snacks", "wordsnacks")
        .addChoice("Letter Tile", "lettertile")
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
  if (!require("../../../config.js").cmdActivity) {
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
    youtube_together: "880218394199220334",
    watch_together_dev: "880218832743055411",
    fishington: "814288819477020702",
    chess_in_the_park: "832012774040141894",
    chess_in_the_park_dev: "832012586023256104",
    betrayal: "773336526917861400",
    doodlecrew: "878067389634314250",
    wordsnacks: "879863976006127627",
    lettertile: "879863686565621790",
    poker_night: "755827207812677713",
  };
  activityNames = [
    { label: "Poker Night", value: "poker_night" },
    { label: "Betrayal", value: "betrayal" },
    { label: "YT Together", value: "youtube_together" },
    { label: "Watch Together Dev", value: "watch_together_dev" },
    { label: "Fishington", value: "fishington" },
    { label: "Chess in the Park", value: "chess_in_the_park" },
    {
      label: "Chess in the Park Development",
      value: "chess_in_the_park_dev",
    },
    { label: "Doodle Crew", value: "doodlecrew" },
    { label: "Word Snacks", value: "wordsnacks" },
    { label: "Letter Tile", value: "lettertile" },
  ];
  if (message.content === "III-COMMAND") isSlashCommand = true;
  if (!isSlashCommand) {
    let row = new RM.Discord.MessageActionRow().addComponents(
      new RM.Discord.MessageSelectMenu()
        .setCustomId("activitySelect-" + message.id)
        .setPlaceholder("No activity selected")
        .addOptions([
          { label: "Poker Night", value: "poker_night" },
          { label: "Betrayal", value: "betrayal" },
          { label: "YT Together", value: "youtube_together" },
          { label: "Watch Together Dev", value: "watch_together_dev" },
          { label: "Fishington", value: "fishington" },
          { label: "Chess in the Park", value: "chess_in_the_park" },
          {
            label: "Chess in the Park Development",
            value: "chess_in_the_park_dev",
          },
          { label: "Doodle Crew", value: "doodlecrew" },
          { label: "Word Snacks", value: "wordsnacks" },
          { label: "Letter Tile", value: "lettertile" },
        ])
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
    message.channel
      .send({ content: "hi", components: [row] })
      .then((a) => (m = a));
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
                  " has started " +
                  activityName +
                  " in " +
                  vc.name +
                  "!\n\nInvite: https://discord.com/invite/" +
                  Invite.code
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invitation for game " + activityName + "!"),
          ],
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
}; /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */

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
