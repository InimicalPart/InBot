//set global variables
//global.sQueueLink = []
//global.sQueueName = []
global.sQueue2 = new Map();
global.sQueue3 = new Map();
global.sQueue = new Map();
global.games = new Map();
global.seekMS = 0;
global.commandsUsed = 0;
global.userAmount = null;

//import modules
const net = require("net");
require("dotenv").config();
const Discord = require("discord.js");
require("discord-reply");
const config = require("./config.js");
const express = require("express");
const bodyParser = require("body-parser");
const jwt_decode = require("jwt-decode");
var Heroku = require("heroku-client"),
  heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });
if (process.env.NotMyToken == null) {
  console.log(
    "Token is missing, please make sure you have the .env file in the directory with the correct information. Please see https://github.com/InimicalPart/TheIIIProject for more information."
  );
  process.exit(1);
}

const client = new Discord.Client();
//!--------------------------
const fun = require("./commands/fun/index.js");
const iiisub = require("./commands/iii-submission/index.js");
const misc = require("./commands/misc/index.js");
const moderation = require("./commands/moderation/index.js");
const music = require("./commands/music/index.js");
//!--------------------------
const requiredModules = {
  cmdTest: misc.test(),
  cmdPost: iiisub.post(),
  cmdApprove: iiisub.approve(),
  cmdDeny: iiisub.deny(),
  cmdRemove: music.remove(),
  cmdEmbed: misc.embed(),
  cmdRestore: iiisub.restore(),
  cmdRandom: misc.random(),
  cmdHelp: misc.help(),
  cmdCalculate: misc.calculate(),
  cmdRoast: fun.roast(),
  cmdMotivation: fun.motivation(),
  cmdQueue: music.queue(),
  cmdPlay: music.play(),
  cmdVCSounds: music.vcsounds(),
  cmdSkip: music.skip(),
  cmdStop: music.stop(),
  cmdBan: moderation.ban(),
  cmdModlog: moderation.modlog(),
  cmdUnban: moderation.unban(),
  cmdPause: music.pause(),
  cmdNowplaying: music.nowplaying(),
  cmdLyrics: music.lyrics(),
  cmdSearch: music.search(),
  cmdConfig: moderation.config(),
  cmdLyrics: music.lyrics(),
  cmdSeek: music.seek(),
  cmdShuffle: music.shuffle(),
  cmdStats: misc.stats(),
  Discord: Discord,
  process_env: process.env,
  pretty_ms: require("pretty-ms"),
  client: client,
  submissionChannelID: "858140842798743603",
  submissionQueueID: "858356481556611122",
  logsID: "858357212828925952",
  iiiPostingID: "858161576561606697",
  botOwners: [
    "745783548241248286",
    "301062520679170066",
    "426826826220961821",
    "814623079346470993",
  ],
  setImageLinks: [
    "https://cdn.discordapp.com/attachments/857343827223117827/858124182981050408/Twitter_Header_2.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858124182209691708/Web_1920_64.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858124139042308096/Web_1920_61.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858124138597842964/Web_1920_57.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858124125063479296/Web_1920_58.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858124099062726696/Web_1920_60.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858124099422781451/Web_1920_63.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858124026190102558/Web_1920_59.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123979444322334/Web_1920_67.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123946850648094/Web_1920_55.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123924831076362/Web_1920_56.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123889539678228/Web_1920_54.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123885995753472/Web_1920_47.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123870626906122/Web_1920_44.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123863103897630/Web_1920_53.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123863308107776/Web_1920_51.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123859566657566/Web_1920_52.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123857653923881/Web_1920_46.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123848398405632/Web_1920_50.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123842840035378/Web_1920_43.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123842944892965/Web_1920_42.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123827754172436/Web_1920_45.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123820619268116/Web_1920_41.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123813157208114/Web_1920_40.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123807402360852/Web_1920_38.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123805209919528/Web_1920_39.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123795708903434/Web_1920_36.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123781310513163/Web_1920_34.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123781280497704/Web_1920_35.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123771767816203/Web_1920_32.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123765728280576/Web_1920_30.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123765112111124/Web_1920_37.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123757842071552/Web_1920_31.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123736146640936/Web_1920_29.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123735998267392/Web_1920_33.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123699764985856/Web_1920_27.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123695191752714/Web_1920_26.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123693007962172/Web_1920_28.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123686049742858/Web_1920_25.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123673645875210/Web_1920_23.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123668755447859/Web_1920_24.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123645461594162/Web_1920_22.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123632353214464/Web_1920_21.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123617854291978/Web_1920_20.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123604033273876/Web_1920_19.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123581354934272/Web_1920_18.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123570508726292/Web_1920_16.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123562703519795/Web_1920_17.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123553614725120/Web_1920_15.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123547737325608/Web_1920_13.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123533603438592/Web_1920_14.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123524749393940/Web_1920_12.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123513566855208/Web_1920_11.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123500489146368/Web_1920_10.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123499629051914/Web_1920_9.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123488999768085/Web_1920_8.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123487951978506/Web_1920_7.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123480855216148/Web_1920_5.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123473021042718/Web_1920_6.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123460580737024/Web_1920_4.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123438262190100/Web_1920_3.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123433627746334/Web_1920_2.png",
    "https://cdn.discordapp.com/attachments/857343827223117827/858123412149239818/Web_1920_1.png",
  ],
  math: require("mathjs"),
  path: require("path"),
  ytdl: require("ytdl-core"),
  db: require("quick.db"),
};
console.log("------------------------\n[I] Logging in...[I]");
client.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(process.env.prefix))
    return;
  if (
    ![
      "745783548241248286",
      "301062520679170066",
      "426826826220961821",
      "814623079346470993",
    ].includes(message.author.id) &&
    client.user.id == "859513472973537311"
  )
    return message.channel.send(
      "This is a DEV edition, where everything is tested. Only bot owners are allowed to use these commands. Please use the main version: <@858108082705006642>"
    );
  for (let i in requiredModules) {
    if (i.startsWith("cmd"))
      if (
        requiredModules[i]
          .commandTriggers()
          .includes(
            message.content
              .split(" ")[0]
              .toLowerCase()
              .replace(process.env.prefix, "")
          )
      )
        runCMD(requiredModules[i], message);
  }
});
async function runCMD(k, message) {
  if (Discord.version > "12.5.3")
    message.channel.send(
      "**NOTE:** The discord API has updated. Some commands may not work properly!"
    );
  global.commandsUsed++;
  k.runCommand(message, message.content.split(" ").slice(1), requiredModules);
}

client.on("ready", async () => {
  console.log("[I] Logged in! [I]");
  if (client.user.id == "859513472973537311") {
    client.user.setPresence({
      activity: {
        name: `III DEV EDITION`,
        type: "WATCHING",
      },
      status: "dnd",
    });
  } else {
    client.user.setPresence({
      activity: {
        name: `III V1`,
        type: "WATCHING",
      },
      status: "dnd",
    });
  }
  let users = [];
  const list = client.guilds.cache.get("857017449743777812");
  list.members.cache.forEach((member) => users.push(member.id));
  if (client.user.id != "859513472973537311" && config.showUsers == true)
    await list.channels.cache
      .get("862425213799104512")
      .setName("↦ • Members: " + users.length);
  global.userAmount = users.length;
  const createdAt = list.createdAt;
  const today = new Date();
  var DIT = today.getTime() - createdAt.getTime();
  var days = Math.round(DIT / (1000 * 3600 * 24));
  var communityDay = new Date("18 August 2021");
  var DITC = communityDay.getTime() - today.getTime();
  var daysC = Math.round(DITC / (1000 * 3600 * 24));

  console.log(
    "------------------------\nThe III Society has " +
      users.length +
      " members.\n"
  );
  console.log(
    "Only " +
      (7000 - users.length) +
      " more until we reach the Community requirements!"
  );
  console.log(
    "Only " + (100 - users.length) + " more until we reach 100 members!"
  );
  console.log(
    "Only " + (500 - users.length) + " more until we can see Server Metrics!\n"
  );
  console.log(
    "The III Society was created at " +
      createdAt.toLocaleDateString() +
      ". That's " +
      days +
      " days ago!"
  );
  console.log(
    "Only " +
      daysC +
      " days until The III Society is old enough to apply to Server Discovery!"
  );
  if (client.user.id == "859513472973537311") {
    console.log(
      "\n⚠ As this is a DEV edition, Channels will not be updated to avoid interference with the main edition. ⚠"
    );
  } else if (config.showUsers == false) {
    console.log(
      "\n⚠ As showUsers in config is disabled, channel won't be updated. ⚠"
    );
  }
  let edition;
  if (client.user.id == "859513472973537311") {
    edition = "DEV";
  } else {
    edition = "MAIN";
  }
  console.log(
    "------------------------\n" +
      client.user.tag +
      " is ready and is running " +
      edition +
      " edition!"
  );
  const { networkInterfaces } = require("os");

  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  console.log(results);
});
//import express and start a server on port 3000

client.on("guildMemberAdd", async () => {
  if (client.user.id != "859513472973537311" && config.showUsers == true) {
    let users = [];
    const list = client.guilds.cache.get("857017449743777812");
    list.members.cache.forEach((member) => users.push(member.id));
    await list.channels.cache
      .get("862425213799104512")
      .setName("↦ • Members: " + users.length);
    global.userAmount = users.length;
  }
});
client.on("guildMemberRemove", async () => {
  if (client.user.id != "859513472973537311" && config.showUsers == true) {
    let users = [];
    const list = client.guilds.cache.get("857017449743777812");
    list.members.cache.forEach((member) => users.push(member.id));
    await list.channels.cache
      .get("862425213799104512")
      .setName("↦ • Members: " + users.length);
    global.userAmount = users.length;
  }
});
var server = net.createServer(function (socket) {
  socket.on("data", function (data) {
    if (data.toString() == "200 ok") {
      console.log("[-] Connection closed.");
      socket.destroy();
    }
  });
  socket.write(
    "III_CLIENT_DATA: " +
      `{"userAmount": ${global.userAmount}, "commandsUsed": ${global.commandsUsed}}`
  );
  socket.pipe(socket);
});

server.on("connection", function () {
  console.log("[+] Connection received.");
});
server.on("close", function () {
  console.log("[-] Server closed.");
});
server.on("error", function (err) {
  console.log("[-] ERROR");
  console.log(err);
  server.close();
});
server.listen(7380, "0.0.0.0");
client.login(process.env.NotMyToken);
