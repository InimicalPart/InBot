const commandInfo = {
  primaryName: "leaderboard", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["leaderboard", "lb", "top"], // These are all commands that will trigger this command.
  help: "Get the leaderboard of the server!", // This is the general description of the command.
  aliases: ["lb", "top"], // These are command aliases that help.js will use
  usage: "[COMMAND] [w/b]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
  slashCommand: null,
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
  const { connect } = require("../../../databasec");
  await connect();
  await connect.create("currency");
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:980471497057501205> *Working on it...*"
        ),
      ],
    })
    .then(async (m) => {
      let res;
      if (!args[0] || args[0].toLowerCase() === "all") {
        res = await connect.query(
          "SELECT * FROM currency ORDER BY amountw+amountb desc LIMIT 5;"
        );
      } else if (
        args[0].toLowerCase() === "wallet" ||
        args[0].toLowerCase() === "wallets" ||
        args[0].toLowerCase() === "w"
      ) {
        res = await connect.query(
          "SELECT * FROM currency ORDER BY amountw desc LIMIT 5;"
        );
      } else if (
        args[0].toLowerCase() === "bank" ||
        args[0].toLowerCase() === "banks" ||
        args[0].toLowerCase() === "b"
      ) {
        res = await connect.query(
          "SELECT * FROM currency ORDER BY amountb desc LIMIT 5;"
        );
      } else {
        res = await connect.query(
          "SELECT * FROM currency ORDER BY amountw+amountb desc;"
        );
      }
      let allrows = [];
      for (let i in res.rows) {
        allrows.push(res.rows[i]);
      }
      // 🥇🥈🥉
      let top5names = [];
      for (let i in allrows) {
        const row = JSON.parse(JSON.stringify(allrows[i]));
        let user = (await message.guild.members.fetch(row.userid)) || null;
        if (user.user) {
          user = user.user;
        }
        if (user == null) {
          top5names.push("Unknown#0000");
        } else {
          top5names.push(user.tag);
        }
      }
      let finalDesc = "";
      let start = "";
      for (let i in top5names) {
        const row = JSON.parse(JSON.stringify(allrows[i]));
        if (!args[0] || args[0].toLowerCase() === "all") {
          start = "Top 5 Wallets and Banks:\n\n";
          if (i == 0) {
            finalDesc +=
              "🥇 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**\n\n";
          } else if (i == 1) {
            finalDesc +=
              "🥈 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**\n\n";
          } else if (i == 2) {
            finalDesc +=
              "🥉 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**\n\n";
          } else if (i == 3) {
            finalDesc +=
              "4: **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**\n\n";
          } else if (i == 4) {
            finalDesc +=
              "5: **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**";
          }
        } else if (
          args[0].toLowerCase() === "wallet" ||
          args[0].toLowerCase() === "wallets" ||
          args[0].toLowerCase() === "w"
        ) {
          start = "Top 5 Wallets:\n\n";
          if (i == 0) {
            finalDesc +=
              "🥇 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**,\n\n";
          } else if (i == 1) {
            finalDesc +=
              "🥈 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**\n\n";
          } else if (i == 2) {
            finalDesc +=
              "🥉 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**\n\n";
          } else if (i == 3) {
            finalDesc +=
              "4: **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**\n\n";
          } else if (i == 4) {
            finalDesc +=
              "5: **" + top5names[i] + "**, Wallet: **$" + row.amountw + "**";
          }
        } else if (
          args[0].toLowerCase() === "bank" ||
          args[0].toLowerCase() === "banks" ||
          args[0].toLowerCase() === "b"
        ) {
          start = "Top 5 Banks:\n\n";
          if (i == 0) {
            finalDesc +=
              "🥇 **" + top5names[i] + "**, Bank: **$" + row.amountb + "**\n\n";
          } else if (i == 1) {
            finalDesc +=
              "🥈 **" + top5names[i] + "**, Bank: **$" + row.amountb + "**\n\n";
          } else if (i == 2) {
            finalDesc +=
              "🥉 **" + top5names[i] + "**, Bank: **$" + row.amountb + "**\n\n";
          } else if (i == 3) {
            finalDesc +=
              "4: **" + top5names[i] + "**, Bank: **$" + row.amountb + "**\n\n";
          } else if (i == 4) {
            finalDesc +=
              "5: **" + top5names[i] + "**, Bank: **$" + row.amountb + "**";
          }
        } else {
          start = "Top 5 Wallets and Banks:\n\n"; //hi?
          if (i == 0) {
            finalDesc +=
              "🥇 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**\n\n";
          } else if (i == 1) {
            finalDesc +=
              "🥈 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**\n\n";
          } else if (i == 2) {
            finalDesc +=
              "🥉 **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**\n\n";
          } else if (i == 3) {
            finalDesc +=
              "4: **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**\n\n";
          } else if (i == 4) {
            finalDesc +=
              "5: **" +
              top5names[i] +
              "**, Wallet: **$" +
              row.amountw +
              "**, Bank: **$" +
              row.amountb +
              "**, Total: **$" +
              (parseInt(row.amountw) + parseInt(row.amountb)) +
              "**";
          }
        }
      }

      let embed = new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setTitle("Leaderboard")
        .setDescription(start + finalDesc)
        .setThumbnail(message.guild.iconURL());
      m.edit({ embeds: [embed] });
      await connect.end(true);
    })
    .catch(async (err) => {
      console.log(err);
      message.channel.send({ content: "Error: " + err });
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
