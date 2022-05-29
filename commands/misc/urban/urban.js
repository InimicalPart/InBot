const commandInfo = {
  primaryName: "urban", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["urban", "u"], // These are all commands that will trigger this command.
  help: "Gets a definition from the Urban Dictonary.", // This is the general description of the command.
  aliases: ["u"], // These are command aliases that help.js will use
  usage: "[COMMAND] <query> [index]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require(RM.path.resolve(global.dirName, "config.js")).cmdUrban) {
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

  // cmd stuff here
  let query = args;
  let index = 0;
  if (!isNaN(parseInt(query[query.length - 1]))) {
    index = parseInt(query.pop());
    if (index > 0) index--;
  }
  query = query.join(" ");
  if (!query) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Please enter a search term.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Urban Dictionary"),
      ],
    });
  }
  let json = await RM.request(
    {
      url: `http://api.urbandictionary.com/v0/define?term=${query}`,
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      try {
        json = JSON.parse(body);
      } catch (e) {
        json = body;
      }

      if (json.list.length < 1) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("No results found.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Urban Dictionary"),
          ],
        });
      }
      if (index > json.list.length - 1) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Index out of range.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Urban Dictionary"),
          ],
        });
      }

      let embed = new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setDescription(
          json.list[index].definition.replace(/\[/g, "").replace(/\]/g, "") ||
            "N/A"
        )
        .setThumbnail(message.guild.iconURL())
        .setTitle(json.list[index].word || "N/A")
        .addField(
          "Example",
          json.list[index].example.replace(/\[/g, "").replace(/\]/g, "")
        )
        .addField("Author", json.list[index].author || "N/A")
        .addField(
          "Rating",
          (json.list[index].thumbs_up || "N/A") +
            " 👍 / " +
            (json.list[index].thumbs_down || "N/A") +
            " 👎"
        )
        .addField("Link", json.list[index].permalink || "N/A");
      return message.channel.send({ embeds: [embed] });
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
};
