const app = {
  version: "3.2.6",
};
//set global variables
//global.sQueueLink = []
//global.sQueueName = []
global.sQueue2 = new Map();
global.sQueue3 = new Map();
global.sQueue = new Map();
global.games = new Map();
global.chessList = [];
global.sudokuList = [];
global.mineSweeperList = [];
global.playerBalance = new Map();
global.seekMS = 0;
global.commandsUsed = 0;
global.userAmount = null;
global.updatedTimers = false;
global.dirName = __dirname;
global.webhookify = [];
global.checkWordle = false;
global.wordleList = [];
global.SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
global.app = app;
//import modules
const moment = require("moment");
require("dotenv").config();

const Discord = require("discord.js");
const config = require("./config.js");
const chalk = require("chalk");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
if (process.env.NotMyToken == null) {
  console.log(
    "Token is missing, please make sure you have the .env file in the directory with the correct information. Please see https://github.com/InimicalPart/TheIIIProject for more information."
  );
  process.exit(1);
}
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
let slashCommandAssigns = [];
//!--------------------------
console.clear();
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MAIN] ") +
    chalk.green("TheIIIProject ") +
    chalk.bold.white("v" + app.version) +
    chalk.green(" is starting up!") +
    "\n" +
    chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [LOADER] ") +
    chalk.yellow("Modules are loading up...")
);
const path = require("path");
const { connect } = require(path.resolve(global.dirName, "databasec.js"));
(async () => {
  await connect();
})();
const fun = require("./commands/fun/index.js");
const iiisub = require("./commands/iii-submission/index.js");
const misc = require("./commands/misc/index.js");
const moderation = require("./commands/moderation/index.js");
const music = require("./commands/music/index.js");
const economy = require("./commands/economy/index.js");
const event = require("./events/index.js");
console.log(
  chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [LOADER] ") +
    chalk.green("Modules loaded! Adding to requiredModules....")
);
//!--------------------------
const requiredModules = {
  cmdTest: misc.test(),
  cmdPost: iiisub.post(),
  cmdApprove: iiisub.approve(),
  cmdDeny: iiisub.deny(),
  cmdRemove: music.remove(),
  cmdInfo: misc.info(),
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
  cmdSeek: music.seek(),
  cmdShuffle: music.shuffle(),
  cmdStats: misc.stats(),
  cmdBlackjack: economy.blackjack(),
  cmdAddmoney: economy.addmoney(),
  cmdBalance: economy.balance(),
  cmdRemovemoney: economy.removemoney(),
  cmdFlipacoin: misc.flipacoin(),
  cmdRayblackjack: misc.rayblackjack(),
  cmdWork: economy.work(),
  cmdDeposit: economy.deposit(),
  cmdWithdraw: economy.withdraw(),
  cmdPay: economy.pay(),
  cmdLeaderboard: economy.leaderboard(),
  cmdUse: economy.use(),
  cmdDbinfo: misc.dbinfo(),
  cmdSpawnitem: economy.spawnitem(),
  cmdInventory: economy.inventory(),
  cmdSetbankcap: economy.setbankcap(),
  cmdShop: economy.shop(),
  cmdBuy: economy.buy(),
  cmdRob: economy.rob(),
  cmdGive: economy.give(),
  cmdDaily: economy.daily(),
  cmdWeekly: economy.weekly(),
  cmdMonthly: economy.monthly(),
  cmdConvert: misc.convert(),
  cmdRun: misc.run(),
  cmdChess: fun.chess(),
  //   cmdScan: moderation.scan(),
  cmdSudoku: fun.sudoku(),
  cmdMinesweeper: fun.minesweeper(),
  //   cmdSpotify: music.spotify(),
  cmdTimer: misc.timer(),
  cmdWordle: fun.wordle(),
  cmdCodeify: misc.codeify(),
  cmdActivity: fun.activity(),
  eventonAIMsg: event.onAIMsg(),
  eventTimer: event.timer(),
  eventWordle: event.wordle(),
  DBClient: connect,
  cmdTesting: moderation.testing(),
  //   cmdV13: misc.v13(),
  //   cmdBombparty: fun.bombparty(),
  //   cmdTodo: misc.todo(),
  cmdSlots: economy.slots(),
  cmdUrban: misc.urban(),
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
    "516333697163853828",
  ],
  /* prettier-ignore */
  setImageLinks: ["https://cdn.discordapp.com/attachments/857343827223117827/858124182981050408/Twitter_Header_2.png","https://cdn.discordapp.com/attachments/857343827223117827/858124182209691708/Web_1920_64.png","https://cdn.discordapp.com/attachments/857343827223117827/858124139042308096/Web_1920_61.png","https://cdn.discordapp.com/attachments/857343827223117827/858124138597842964/Web_1920_57.png","https://cdn.discordapp.com/attachments/857343827223117827/858124125063479296/Web_1920_58.png","https://cdn.discordapp.com/attachments/857343827223117827/858124099062726696/Web_1920_60.png","https://cdn.discordapp.com/attachments/857343827223117827/858124099422781451/Web_1920_63.png","https://cdn.discordapp.com/attachments/857343827223117827/858124026190102558/Web_1920_59.png","https://cdn.discordapp.com/attachments/857343827223117827/858123979444322334/Web_1920_67.png","https://cdn.discordapp.com/attachments/857343827223117827/858123946850648094/Web_1920_55.png","https://cdn.discordapp.com/attachments/857343827223117827/858123924831076362/Web_1920_56.png","https://cdn.discordapp.com/attachments/857343827223117827/858123889539678228/Web_1920_54.png","https://cdn.discordapp.com/attachments/857343827223117827/858123885995753472/Web_1920_47.png","https://cdn.discordapp.com/attachments/857343827223117827/858123870626906122/Web_1920_44.png","https://cdn.discordapp.com/attachments/857343827223117827/858123863103897630/Web_1920_53.png","https://cdn.discordapp.com/attachments/857343827223117827/858123863308107776/Web_1920_51.png","https://cdn.discordapp.com/attachments/857343827223117827/858123859566657566/Web_1920_52.png","https://cdn.discordapp.com/attachments/857343827223117827/858123857653923881/Web_1920_46.png","https://cdn.discordapp.com/attachments/857343827223117827/858123848398405632/Web_1920_50.png","https://cdn.discordapp.com/attachments/857343827223117827/858123842840035378/Web_1920_43.png","https://cdn.discordapp.com/attachments/857343827223117827/858123842944892965/Web_1920_42.png","https://cdn.discordapp.com/attachments/857343827223117827/858123827754172436/Web_1920_45.png","https://cdn.discordapp.com/attachments/857343827223117827/858123820619268116/Web_1920_41.png","https://cdn.discordapp.com/attachments/857343827223117827/858123813157208114/Web_1920_40.png","https://cdn.discordapp.com/attachments/857343827223117827/858123807402360852/Web_1920_38.png","https://cdn.discordapp.com/attachments/857343827223117827/858123805209919528/Web_1920_39.png","https://cdn.discordapp.com/attachments/857343827223117827/858123795708903434/Web_1920_36.png","https://cdn.discordapp.com/attachments/857343827223117827/858123781310513163/Web_1920_34.png","https://cdn.discordapp.com/attachments/857343827223117827/858123781280497704/Web_1920_35.png","https://cdn.discordapp.com/attachments/857343827223117827/858123771767816203/Web_1920_32.png","https://cdn.discordapp.com/attachments/857343827223117827/858123765728280576/Web_1920_30.png","https://cdn.discordapp.com/attachments/857343827223117827/858123765112111124/Web_1920_37.png","https://cdn.discordapp.com/attachments/857343827223117827/858123757842071552/Web_1920_31.png","https://cdn.discordapp.com/attachments/857343827223117827/858123736146640936/Web_1920_29.png","https://cdn.discordapp.com/attachments/857343827223117827/858123735998267392/Web_1920_33.png","https://cdn.discordapp.com/attachments/857343827223117827/858123699764985856/Web_1920_27.png","https://cdn.discordapp.com/attachments/857343827223117827/858123695191752714/Web_1920_26.png","https://cdn.discordapp.com/attachments/857343827223117827/858123693007962172/Web_1920_28.png","https://cdn.discordapp.com/attachments/857343827223117827/858123686049742858/Web_1920_25.png","https://cdn.discordapp.com/attachments/857343827223117827/858123673645875210/Web_1920_23.png","https://cdn.discordapp.com/attachments/857343827223117827/858123668755447859/Web_1920_24.png","https://cdn.discordapp.com/attachments/857343827223117827/858123645461594162/Web_1920_22.png","https://cdn.discordapp.com/attachments/857343827223117827/858123632353214464/Web_1920_21.png","https://cdn.discordapp.com/attachments/857343827223117827/858123617854291978/Web_1920_20.png","https://cdn.discordapp.com/attachments/857343827223117827/858123604033273876/Web_1920_19.png","https://cdn.discordapp.com/attachments/857343827223117827/858123581354934272/Web_1920_18.png","https://cdn.discordapp.com/attachments/857343827223117827/858123570508726292/Web_1920_16.png","https://cdn.discordapp.com/attachments/857343827223117827/858123562703519795/Web_1920_17.png","https://cdn.discordapp.com/attachments/857343827223117827/858123553614725120/Web_1920_15.png","https://cdn.discordapp.com/attachments/857343827223117827/858123547737325608/Web_1920_13.png","https://cdn.discordapp.com/attachments/857343827223117827/858123533603438592/Web_1920_14.png","https://cdn.discordapp.com/attachments/857343827223117827/858123524749393940/Web_1920_12.png","https://cdn.discordapp.com/attachments/857343827223117827/858123513566855208/Web_1920_11.png","https://cdn.discordapp.com/attachments/857343827223117827/858123500489146368/Web_1920_10.png","https://cdn.discordapp.com/attachments/857343827223117827/858123499629051914/Web_1920_9.png","https://cdn.discordapp.com/attachments/857343827223117827/858123488999768085/Web_1920_8.png","https://cdn.discordapp.com/attachments/857343827223117827/858123487951978506/Web_1920_7.png","https://cdn.discordapp.com/attachments/857343827223117827/858123480855216148/Web_1920_5.png","https://cdn.discordapp.com/attachments/857343827223117827/858123473021042718/Web_1920_6.png","https://cdn.discordapp.com/attachments/857343827223117827/858123460580737024/Web_1920_4.png","https://cdn.discordapp.com/attachments/857343827223117827/858123438262190100/Web_1920_3.png","https://cdn.discordapp.com/attachments/857343827223117827/858123433627746334/Web_1920_2.png","https://cdn.discordapp.com/attachments/857343827223117827/858123412149239818/Web_1920_1.png",],
  common: require("common-tags"),
  math: require("mathjs"),
  path: path,
  ytdl: require("ytdl-core"),
  db: require("quick.db"),
  request: require("request"),
  ESA: require("spotify-web-api-node"),
  CU: require("convert-units"),
};
console.log(
  chalk.blueBright("------------------------\n") +
    chalk.green("Added!\n") +
    chalk.blueBright("------------------------\n") +
    chalk.white("[I] ") +
    chalk.yellow("Logging in... ") +
    chalk.white("[I]")
);
let slashCommands = [];
for (let i in requiredModules) {
  if (i.startsWith("cmd")) {
    if (requiredModules[i].getSlashCommand() !== null) {
      slashCommands.push(requiredModules[i].getSlashCommandJSON());
      slashCommandAssigns.push({
        commandName: requiredModules[i].getSlashCommandJSON().name,
        assignedTo: i,
      });
    }
  }
}
client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    interaction.reply({ content: "me has execution action" });
    for (let i in slashCommandAssigns) {
      if (slashCommandAssigns[i].commandName === interaction.commandName) {
        if (requiredModules[slashCommandAssigns[i].assignedTo] !== undefined) {
          console.log(
            "Command " +
              chalk.white.bold(interaction.commandName) +
              " is assigned to " +
              chalk.white.bold(slashCommandAssigns[i].assignedTo)
          );
          runCMD(
            requiredModules[slashCommandAssigns[i].assignedTo],
            convertToMSG(interaction)
          );
        }
      }
    }
    return;
  }
});
function convertToMSG(interaction) {
  let newInteraction = interaction;
  newInteraction.author = interaction.member.user;
  newInteraction.content = "III-COMMAND";
  //   delete newInteraction.user;
  return newInteraction;
}
client.on("messageCreate", async (message) => {
  for (let i in requiredModules) {
    if (i.startsWith("event")) {
      if (
        requiredModules[i].eventType() === "onMessage" &&
        message.guild.id !== "848978190088536115"
      ) {
        requiredModules[i].runEvent(requiredModules, message);
      }
    }
  }

  if (message.author.bot || !message.content.startsWith(process.env.prefix))
    return;
  if (message.guild === null) {
    let em = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("Error")
      .setDescription(`:x: Commands can only be used in servers.`)
      .setFooter({ text: `${message.author.tag} (${message.author.id})` })
      .setTimestamp();
    return message.reply(em);
  }
  if (
    ![
      "745783548241248286",
      "301062520679170066",
      "426826826220961821",
      "814623079346470993",
      "755934610579259432",
      "516333697163853828",
    ].includes(message.author.id) &&
    client.user.id == "859513472973537311"
  )
    return message.channel.send({
      content:
        "This is a DEV edition, where everything is tested. Only bot owners are allowed to use these commands. Please use the main version: <@858108082705006642>",
    });
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
      ) {
        if (
          requiredModules[i].commandCategory() === "developer" &&
          !requiredModules.botOwners.includes(message.author.id)
        )
          return;
        if (
          requiredModules[i].commandPrim() === "codeify" &&
          message.guild.id === "848978190088536115"
        )
          runCMD(requiredModules[i], message);
        else if (message.guild.id !== "848978190088536115")
          runCMD(requiredModules[i], message);
      }
  }
});
async function runCMD(k, message) {
  if (Discord.version > "13.6.0")
    message.channel.send({
      content:
        "**NOTE:** The discord API has updated. Some commands may not work properly!",
    });
  global.commandsUsed++;
  if (typeof message === "string") {
  } else
    k.runCommand(message, message.content.split(" ").slice(1), requiredModules);
}

client.on("ready", async () => {
  const rest = new REST({ version: "9" }).setToken(process.env.NotMyToken);
  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(client.user.id), {
        body: slashCommands,
      });

      console.log(
        "Successfully reloaded application (/) commands. " +
          slashCommands.length +
          " commands loaded."
      );
    } catch (error) {
      console.error(error);
    }
  })();
  console.log(
    chalk.white("[I] ") + chalk.green("Logged in!") + chalk.white(" [I]")
  );
  if (client.user.id == "859513472973537311") {
    client.user.setPresence({
      activities: [
        {
          name: `III V2 [DEV]`,
          type: "WATCHING",
        },
      ],
      status: "dnd",
    });
  } else {
    client.user.setPresence({
      activities: [
        {
          name: `III V2`,
          type: "WATCHING",
        },
      ],
      status: "dnd",
    });
  }
  let users = [];
  const list = await client.guilds.fetch("857017449743777812");
  await list.members
    .fetch()
    .then(async (member) => {
      member.forEach(async (m) => {
        if (
          String(m.user.username).toLowerCase().includes("| gg") ||
          String(m.user.username).toLowerCase().includes("|| discord.gg") ||
          String(m.user.username).toLowerCase().includes("dcgate") ||
          String(m.user.username).toLowerCase().includes("discordgate")
        ) {
          console.log(m.user.username + " is getting banned.");
          await m.send({
            content:
              "Hello, you have been suspected of being a user bot, for safety concerns, we have banned you. If you think this is a mistake. Please message Inimi#0565",
          });
          m.ban({ reason: "User bots are not allowed." });
        } else {
          users.push(m.id);
        }
      });
    })
    .catch(console.error);
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
    chalk.blueBright("------------------------\n") +
      chalk.redBright("The III Society") +
      " has " +
      chalk.cyanBright(users.length) +
      " members.\n"
  );
  console.log(
    "Only " +
      chalk.cyanBright(7000 - users.length) +
      " more until we reach the Community requirements!"
  );
  console.log(
    "Only " +
      chalk.cyanBright(100 - users.length) +
      " more until we reach 100 members!"
  );
  console.log(
    "Only " +
      chalk.cyanBright(500 - users.length) +
      " more until we can see Server Metrics!\n"
  );
  console.log(
    chalk.redBright("The III Society") +
      " was created on the " +
      chalk.cyanBright(createdAt.toLocaleDateString()) +
      ". That's " +
      chalk.cyanBright(days) +
      " days ago!"
  );
  if (client.user.id == "859513472973537311") {
    console.log(
      "\n" +
        chalk.yellowBright("⚠  ") +
        "As this is a DEV edition, Channels will not be updated to avoid interference with the main edition. " +
        chalk.yellowBright("⚠")
    );
  } else if (config.showUsers == false) {
    console.log(
      "\n" +
        chalk.yellowBright("⚠") +
        " As showUsers in config is disabled, channel won't be updated. " +
        chalk.yellowBright("⚠")
    );
  }
  let edition;
  if (client.user.id == "859513472973537311") {
    edition = "DEVELOPMENT";
  } else {
    edition = "MAIN";
  }
  result = DateFormatter.formatDate(new Date(), `MMMM ????, YYYY hh:mm:ss A`);
  result = result.replace("????", getOrdinalNum(new Date().getDate()));
  isDevMode =
    edition === "DEVELOPMENT"
      ? chalk.greenBright("YES")
      : chalk.redBright("NO");
  console.log(
    "------------------------\n" +
      "Current time is: " +
      chalk.cyanBright(result) +
      "\n" +
      "Discord.JS version: " +
      chalk.yellow(Discord.version) +
      "\n" +
      "In Development Mode: " +
      isDevMode +
      "\n" +
      "Current API Latency: " +
      chalk.cyanBright(client.ws.ping) +
      " ms\n" +
      "------------------------\n" +
      chalk.blue.bold(client.user.tag) +
      " is ready and is running " +
      chalk.blue.bold(edition) +
      " edition!"
  );
  require("glob")("**/board_*.png", function (er, files) {
    for (const file of files) {
      require("fs").unlinkSync(file);
    }
  });
  for (let i in requiredModules) {
    if (i.startsWith("event")) {
      if (requiredModules[i].eventType() === "onStart") {
        requiredModules[i].runEvent(requiredModules);
      }
    }
  }
});
//import express and start a server on port 3000

client.on("guildMemberAdd", async (user) => {
  if (
    String(user.username).toLowerCase().includes("| gg") ||
    String(user.username).toLowerCase().includes("|| discord.gg") ||
    String(user.username).toLowerCase().includes("dcgate") ||
    String(user.username).toLowerCase().includes("discordgate")
  ) {
    user.ban({ reason: "User bots are not allowed." });
  }
  if (client.user.id != "859513472973537311" && config.showUsers == true) {
    let users = [];
    const list = await client.guilds.fetch("857017449743777812");
    await list.members
      .fetch()
      .then(async (member) => member.forEach(async (m) => users.push(m.id)))
      .catch(console.error);
    await list.channels.cache
      .get("862425213799104512")
      .setName("↦ • Members: " + users.length);
    global.userAmount = users.length;
  }
});
client.on("guildMemberRemove", async () => {
  if (client.user.id != "859513472973537311" && config.showUsers == true) {
    let users = [];
    const list = await client.guilds.fetch("857017449743777812");
    await list.members
      .fetch()
      .then(async (member) => member.forEach(async (m) => users.push(m.id)))
      .catch(console.error);
    await list.channels.cache
      .get("862425213799104512")
      .setName("↦ • Members: " + users.length);
    global.userAmount = users.length;
  }
});
client.login(process.env.NotMyToken);
function getOrdinalNum(n) {
  return (
    n +
    (n > 0
      ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : "")
  );
}
const DateFormatter = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  formatDate: function (e, t) {
    var r = this;
    return (
      (t = r.getProperDigits(t, /d+/gi, e.getDate())),
      (t = (t = r.getProperDigits(t, /M+/g, e.getMonth() + 1)).replace(
        /y+/gi,
        function (t) {
          var r = t.length,
            g = e.getFullYear();
          return 2 == r ? (g + "").slice(-2) : 4 == r ? g : t;
        }
      )),
      (t = r.getProperDigits(t, /H+/g, e.getHours())),
      (t = r.getProperDigits(t, /h+/g, r.getHours12(e.getHours()))),
      (t = r.getProperDigits(t, /m+/g, e.getMinutes())),
      (t = (t = r.getProperDigits(t, /s+/gi, e.getSeconds())).replace(
        /a/gi,
        function (t) {
          var g = r.getAmPm(e.getHours());
          return "A" === t ? g.toUpperCase() : g;
        }
      )),
      (t = r.getFullOr3Letters(t, /d+/gi, r.dayNames, e.getDay())),
      (t = r.getFullOr3Letters(t, /M+/g, r.monthNames, e.getMonth()))
    );
  },
  getProperDigits: function (e, t, r) {
    return e.replace(t, function (e) {
      var t = e.length;
      return 1 == t ? r : 2 == t ? ("0" + r).slice(-2) : e;
    });
  },
  getHours12: function (e) {
    return (e + 24) % 12 || 12;
  },
  getAmPm: function (e) {
    return e >= 12 ? "pm" : "am";
  },
  getFullOr3Letters: function (e, t, r, g) {
    return e.replace(t, function (e) {
      var t = e.length;
      return 3 == t ? r[g].substr(0, 3) : 4 == t ? r[g] : e;
    });
  },
};
