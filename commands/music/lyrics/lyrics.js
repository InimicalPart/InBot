const commandInfo = {
  primaryName: "lyrics", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["lyrics", "ly"], // These are all commands that will trigger this command.
  help: "fetches lyrics for songs", // This is the general description pf the command.
  aliases: ["ly"], // These are command aliases that help.js will use
  usage: "[COMMAND] <song name>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdLyrics) {
    return message.channel.send(
      new RM.Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription("Command disabled by Administrators.")
        .setThumbnail(message.guild.iconURL())
        .setTitle("Command Disabled")
    );
  }

  const client = RM.client;
  const Genius = require("genius-lyrics");
  const Client = new Genius.Client(process.env.GENIUS_API_KEY);

  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:869354366803509299> Searching for Lyrics..."
        ),
      ],
    })
    .then(async (m) => {
      if (args.length < 1) {
        const songNotDefined = new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription("Please specify a song name.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid Arguments");
        return m.edit({ embeds: [songNotDefined] });
      }
      let timeStart = new Date().getTime();
      const searches = await Client.songs.search(args.join(" "));
      let timeTaken = new Date().getTime() - timeStart; // time taken to get lyrics in milliseconds
      if (searches.length < 1) {
        const noLyricsFound = new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: `${message.author.tag}`,
            iconURL: `${message.author.avatarURL()}`,
          })
          .setDescription("No lyrics found.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Lyrics Found")
          .setFooter({
            text: "Time taken: " + timeTaken / 1000 + " seconds",
          });
        return m.edit({ embeds: [noLyricsFound] });
      }
      const firstSong = searches[0];
      const lyrics = await firstSong.lyrics();

      // if no lyrics found
      if (!lyrics) {
        const noLyricsFound = new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: `${message.author.tag}`,
            iconURL: `${message.author.avatarURL()}`,
          })
          .setDescription("No lyrics found.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Lyrics Found")
          .setFooter({
            text: "Time taken: " + timeTaken / 1000 + " seconds",
          });
        return m.edit({ embeds: [noLyricsFound] });
      }

      // if there are no results
      if (!firstSong) {
        const noResults = new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: `${message.author.tag}`,
            iconURL: `${message.author.avatarURL()}`,
          })
          .setDescription("No results found.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("No Results Found")
          .setFooter({
            text: "Time taken: " + timeTaken / 1000 + " seconds",
          });
        return m.edit({ embeds: [noResults] });
      }

      // if the length of the lyrics is greater than 2000 characters, split it into multiple messages
      // split it at end of the line around 4000 characters
      // then send in multiple embeds
      if (lyrics.length > 3500) {
        const lyricsArray = lyrics.split("\n");
        const lyricsArrayLength = lyricsArray.length;
        const embedArray = [];
        let embedIndex = 0;
        let embedString = "";
        for (let i = 0; i < lyricsArrayLength; i++) {
          if (embedString.length + lyricsArray[i].length > 3500) {
            embedArray[embedIndex] = embedString;
            embedString = "";
            embedIndex++;
          }
          embedString += lyricsArray[i] + "\n";
        }
        embedArray[embedIndex] = embedString;

        for (let i = 0; i < embedArray.length; i++) {
          if (i === 0) {
            m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("BLUE")
                  .setAuthor({
                    name: `${message.author.tag}`,
                    iconURL: `${message.author.avatarURL()}`,
                  })
                  .setDescription(embedArray[i])
                  .setTitle(
                    "Lyrics for " +
                      firstSong.title +
                      " - " +
                      firstSong.artist.name
                  )
                  .setURL(firstSong.url)
                  .setFooter({
                    text: "Time taken: " + timeTaken / 1000 + " seconds",
                  }),
                // set the thumbnail to the song art
              ],
            });
          } else {
            message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("BLUE")
                  .setDescription(embedArray[i])
                  .setImage(firstSong.image),
              ],
            });
          }
        }
      } else {
        //
        const lyricmsg = new RM.Discord.MessageEmbed()
          .setColor("BLUE")
          .setAuthor({
            name: `${message.author.tag}`,
            iconURL: `${message.author.avatarURL()}`,
          })
          .setDescription(lyrics)
          .setTitle(
            "Lyrics for " + firstSong.title + " - " + firstSong.artist.name
          )
          .setImage(firstSong.image)
          .setURL(firstSong.url)
          .setFooter({
            text: "Time taken: " + timeTaken / 1000 + " seconds",
          });

        m.edit({ embeds: [lyricmsg] });
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
