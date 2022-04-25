const commandInfo = {
  primaryName: "spotify", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["spotify", "alias2", "alias3"], // These are all commands that will trigger this command.
  help: "eats your cake!", // This is the general description of the command.
  aliases: ["alias2", "alias3"], // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "music",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdSpotify) {
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
  //   let ESA = RM.ESA;
  //   let ESA = require("enhanced-spotify-api");
  //   if (ESA.getAccessToken() == null) {
  //     console.log("No token, making new one");
  //     await getToken();
  //     console.log(ESA.getAccessToken());
  //   }
  var SpotifyWebApi = require("spotify-web-api-node");
  //   var ESA = require("enhanced-spotify-api");
  //   let Spotify = require("../../../resources/spoti.js");
  let Spotify = require("spotify-web-playback");
  var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SpotifyCreds.split(":")[0],
    clientSecret: process.env.SpotifyCreds.split(":")[1],
  });
  if (spotifyApi.getAccessToken() == null) {
    console.log("No token, making new one");
    await getToken();
    console.log(spotifyApi.getAccessToken().substring(0, 15));
  }
  const spotify = new Spotify();

  await spotify.connect(spotifyApi.getAccessToken());

  spotify.play("spotify:track:4cOdK2wGLETKBW3PvgPWqT");
  //   let name = args[0] || "Never gonna give you up";
  //   spotifyApi.searchTracks(name).then(
  //     function (data) {
  //       console.log(
  //         'Search by "' + name + '"',
  //         data.body.tracks.items[0].artists
  //       );
  //       let fullString = "";
  //       for (let song of data.body.tracks.items) {
  //         fullString += "🔊 " + song.name + " - " + song.artists[0].name + "\n";
  //       }
  //       //remove the last "\n"
  //       fullString = fullString.substring(0, fullString.length - 1);
  //       message.channel.send({
  //         embeds: [
  //           new RM.Discord.MessageEmbed()
  //             .setColor("GREEN")
  //             .setAuthor({
  //               name: message.author.tag,
  //               iconURL: message.author.avatarURL(),
  //             })
  //             .setDescription(fullString)
  //             .setThumbnail(message.guild.iconURL())
  //             .setTitle("Search Results"),
  //         ],
  //       });
  //     },
  //     function (err) {
  //       console.error(err);
  //     }
  //   );

  //   var playlistID = args[0] || "6Ibg2aBUp5NP0lAujEGa6p";
  //   spotifyApi
  //     .getPlaylist(playlistID)
  //     .then(function (data) {
  //       var playlist = data.body;
  //       var playlistName = playlist.name;
  //       var playlistTracks = playlist.tracks.items;
  //       var playlistTracksLength = playlistTracks.length;
  //       message.channel.send(
  //         playlistTracksLength + " songs in playlist '" + playlistName + "'",
  //         {
  //           split: true,
  //         }
  //       );
  //     })
  //     .catch(function (err) {
  //       if (err?.body?.error?.status === 404) {
  //         return message.channel.send(
  //           "Playlist with Id: " + playlistID + " not found"
  //         );
  //       }
  //       console.log(err);
  //       message.channel.send("Error: " + err);
  //     });
  //   for (var i = 0; i < tracks.length; i++) {
  //     var track = tracks[i];
  //     console.log(track.name);
  //     message.channel.send(track.name, {
  //       split: true,
  //     });
  //   }
  //   message.channel.send();
  // message.channel.send(tracks.join(", "));
  async function getToken() {
    return new Promise(function (resolve, reject) {
      RM.request.post(
        {
          url: "https://accounts.spotify.com/api/token",
          headers: {
            Authorization:
              "Basic " +
              new Buffer.from(process.env.SpotifyCreds).toString("base64"),
          },
          form: {
            grant_type: "client_credentials",
          },
          json: true,
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            spotifyApi.setAccessToken(body.access_token);
            resolve();
          } else {
            reject();
          }
        }
      );
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
