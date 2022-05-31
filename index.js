const app = {
  version: "3.3.0",
};
global.app = app;
global.bannedUsers = [];
global.chessList = [];
global.mineSweeperList = [];
global.sudokuList = [];
global.UNOList = [];
global.wordleList = [];
global.checkWordle = false;
global.updatedTimers = false;
global.dirName = __dirname;
global.SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
const chalk = require("chalk");
try {
  const moment = require("moment");
  require("dotenv").config();

  const Discord = require("discord.js");
  const config = require("./config.js");
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v9");
  if (process.env.DISCORD_TOKEN == null) {
    console.log(
      "Token is missing, please make sure you have the .env file in the directory with the correct information. Please see https://github.com/InimicalPart/InBot for more information."
    );
    process.exit(1);
  }
  const client = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Discord.Intents.FLAGS.DIRECT_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
      Discord.Intents.FLAGS.GUILD_VOICE_STATES,
      Discord.Intents.FLAGS.GUILDS,
    ],
    partials: ["CHANNEL"],
  });
  let slashCommandAssigns = [];
  //!--------------------------
  console.clear();
  console.log(
    chalk.white.bold("[" + moment().format("M/D/y HH:mm:ss") + "] [MAIN] ") +
      chalk.green("InBot ") +
      chalk.bold.white("v" + app.version) +
      chalk.green(" is starting up!") +
      "\n" +
      chalk.white.bold(
        "[" + moment().format("M/D/y HH:mm:ss") + "] [LOADER] "
      ) +
      chalk.yellow("Modules are loading up...")
  );
  const path = require("path");
  const { connect } = require(path.resolve(global.dirName, "databasec.js"));
  (async () => {
    await connect();
  })();
  const fun = require("./commands/fun/index.js");
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
    botOwners: ["301062520679170066", "814623079346470993"],
    cmdWordle: fun.wordle(),
    cmdActivity: fun.activity(),
    cmdAddmoney: economy.addmoney(),
    cmdBalance: economy.balance(),
    cmdBan: moderation.ban(),
    cmdBlackjack: economy.blackjack(),
    cmdBotban: moderation.botban(),
    cmdBuy: economy.buy(),
    cmdCalculate: misc.calculate(),
    cmdChess: fun.chess(),
    cmdConvert: misc.convert(),
    cmdDaily: economy.daily(),
    cmdDbinfo: misc.dbinfo(),
    cmdDeposit: economy.deposit(),
    cmdFlipacoin: misc.flipacoin(),
    cmdGive: economy.give(),
    cmdHelp: misc.help(),
    cmdInfo: misc.info(),
    cmdInventory: economy.inventory(),
    cmdLeaderboard: economy.leaderboard(),
    cmdLyrics: music.lyrics(),
    cmdMinesweeper: fun.minesweeper(),
    cmdMonthly: economy.monthly(),
    cmdMotivation: fun.motivation(),
    cmdPay: economy.pay(),
    cmdRemovemoney: economy.removemoney(),
    cmdRoast: fun.roast(),
    cmdRob: economy.rob(),
    cmdRun: misc.run(),
    cmdSetbankcap: economy.setbankcap(),
    cmdShop: economy.shop(),
    cmdSlots: economy.slots(),
    cmdSpawnitem: economy.spawnitem(),
    cmdStats: misc.stats(),
    cmdSudoku: fun.sudoku(),
    cmdPing: misc.ping(),
    cmdTimer: misc.timer(),
    cmdUnban: moderation.unban(),
    cmdUno: fun.uno(),
    cmdUrban: misc.urban(),
    cmdUse: economy.use(),
    cmdWeekly: economy.weekly(),
    cmdWithdraw: economy.withdraw(),
    eventGetbotbanned: event.getBotBanned(),
    eventTimer: event.getActiveTimers(),
    eventWordle: event.getCurrentWordle(),
    DBClient: connect,
    Discord: Discord,
    process_env: process.env,
    client: client,
    math: require("mathjs"),
    path: require("path"),
    pretty_ms: require("pretty-ms"),
    request: require("request"),
    CU: require("convert-units"),
    chalk: require("chalk"),
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
      if (
        global.bannedUsers.includes(
          interaction?.member?.user?.id || interaction?.user?.id
        )
      ) {
        return interaction.reply({
          content:
            "You are banned from using commands. If you believe this is an error, please contact Inimi#0565.",
          ephemeral: true,
        });
      }
      //   interaction.deferReply();
      for (let i in slashCommandAssigns) {
        if (slashCommandAssigns[i].commandName === interaction.commandName) {
          if (
            requiredModules[slashCommandAssigns[i].assignedTo] !== undefined
          ) {
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
    newInteraction.author = interaction?.member?.user || interaction?.user?.id;
    newInteraction.content = "INBOT-COMMAND";
    newInteraction.isSlashCommand = true;
    //   delete newInteraction.user;
    return newInteraction;
  }
  client.on("messageCreate", async (message) => {
    if (global.bannedUsers.includes(message.author.id)) {
      return;
    }
    for (let i in requiredModules) {
      if (i.startsWith("event")) {
        if (requiredModules[i].eventType() === "onMessage") {
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
        .setFooter({
          text: `${message.author.tag} (${message.author.id})`,
        })
        .setTimestamp();
      return message.reply({
        embeds: [em],
      });
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
          runCMD(requiredModules[i], message);
        }
    }
  });
  async function runCMD(k, message) {
    if (Discord.version > "13.7.0")
      message.channel.send({
        content:
          "**NOTE:** The discord API has updated. Some commands may not work properly!",
      });
    if (typeof message === "string") {
    } else
      k.runCommand(
        message,
        message.content.split(" ").slice(1),
        requiredModules
      );
  }

  client.on("ready", async () => {
    const rest = new REST({
      version: "9",
    }).setToken(process.env.DISCORD_TOKEN);
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
            name: `V3 [DEV]`,
            type: "WATCHING",
          },
        ],
        status: "dnd",
      });
    } else {
      client.user.setPresence({
        activities: [
          {
            name: `V3`,
            type: "WATCHING",
          },
        ],
        status: "dnd",
      });
    }
    let users = [];
    const list = await client.guilds.fetch("931616832668958748");
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
            m.ban({
              reason: "User bots are not allowed.",
            });
          } else {
            users.push(m.id);
          }
        });
      })
      .catch(console.error);
    if (client.user.id != "859513472973537311" && config.showUsers == true)
      await list.channels.cache
        .get("980251559113920522")
        .setName("↦ • Members: " + users.length + " •");
    const createdAt = list.createdAt;
    const today = new Date();
    var msSinceCreation = today.getTime() - createdAt.getTime();
    var daysSinceCreation = Math.round(msSinceCreation / (1000 * 3600 * 24));

    console.log(
      chalk.blueBright("------------------------\n") +
        chalk.redBright("Inimi's Community Hub") +
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
      chalk.redBright("Inimi's Community Hub") +
        " was created on the " +
        chalk.cyanBright(createdAt.toLocaleDateString()) +
        ". That's " +
        chalk.cyanBright(daysSinceCreation) +
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
        "Prefix: " +
        chalk.blue(process.env.prefix) +
        "\n" +
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
      user.ban({
        reason: "User bots are not allowed.",
      });
    }
    if (client.user.id != "859513472973537311" && config.showUsers == true) {
      let users = [];
      const list = await client.guilds.fetch("931616832668958748");
      await list.members
        .fetch()
        .then(async (member) => member.forEach(async (m) => users.push(m.id)))
        .catch(console.error);
      await list.channels.cache
        .get("980251559113920522")
        .setName("↦ • Members: " + users.length + " •");
    }
  });
  client.on("guildMemberRemove", async () => {
    if (client.user.id != "859513472973537311" && config.showUsers == true) {
      let users = [];
      const list = await client.guilds.fetch("931616832668958748");
      await list.members
        .fetch()
        .then(async (member) => member.forEach(async (m) => users.push(m.id)))
        .catch(console.error);
      await list.channels.cache
        .get("980251559113920522")
        .setName("↦ • Members: " + users.length + " •");
    }
  });
  client.login(process.env.DISCORD_TOKEN);
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
} catch (e) {
  console.log(
    chalk.hex("#FF0000").bold("-----------------------------------[") +
      chalk.white.bold(e.toString().replace(/:.*/g, "")) +
      chalk.hex("#FF0000").bold("]-----------------------------------\n")
  );
  console.log(e);
  console.log(
    chalk.hex("#FF0000").bold("\n-----------------------------------[") +
      chalk.white.bold(e.toString().replace(/:.*/g, "")) +
      chalk.hex("#FF0000").bold("]-----------------------------------")
  );
}
