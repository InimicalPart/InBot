const commandInfo = {
  primaryName: "timer", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["timer", "t"], // These are all commands that will trigger this command.
  help: "Sets a timer to notify you", // This is the general description of the command.
  aliases: ["t"], // These are command aliases that help.js will use
  usage: "[COMMAND] <time> <time args[1]> [message]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
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
  let convert = RM.CU;
  let path = require("path");
  let time = args[0];
  let timerMessage = args.slice(1).join(" ");
  if (!time)
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Please enter a time.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Missing Arguments"),
      ],
    });

  const connect = RM.DBClient;
  await connect.create("timer");
  if (timerMessage.length < 1) {
    timerMessage = "Timer has ended.";
  }
  if (!getTimeInMS(time)) {
    let allTimers = await connect.query("SELECT * FROM timer");
    let idTimer;
    if (allTimers.rows.length >= 1) {
      allTimers = JSON.parse(JSON.stringify(allTimers.rows));
      //check if the time variable is in any of the timers ids
      idTimer = allTimers.find((timer) => timer.timerid === time);
    }
    if (time.toLowerCase() === "list") {
      let timers = await connect.query("SELECT * FROM timer");
      if (timers.rows.length < 1) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("There are no timers.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("No Timers"),
          ],
        });
      }
      timers = JSON.parse(JSON.stringify(timers.rows));
      let timerList = "";
      let format =
        "[ID]. Time left: [TL], ID: [CID], Author: [AUT], Message: '[MSG]'\n";
      for (let i = 0; i < timers.length; i++) {
        let username = await RM.client.users.fetch(timers[i].userid);
        username = username.username + "#" + username.discriminator;
        timerList += format
          .replace("[TL]", RM.pretty_ms(timers[i].time - Date.now()))
          .replace("[CID]", timers[i].timerid)
          .replace("[AUT]", username)
          .replace("[MSG]", timers[i].message)
          .replace("[ID]", i + 1);
      }
      //send it as an attachment using buffer
      let attachment = new RM.Discord.MessageAttachment(
        Buffer.from(timerList, "utf-8"),
        "list.yaml"
      );
      return message.channel.send({ files: [attachment] });
    } else if (idTimer) {
      // user is trying to modify the timer
      if (args[1].toLowerCase() === "delete") {
        let username = await RM.client.users.fetch(idTimer.userid);
        username = username.username + "#" + username.discriminator;
        message.channel.send({
          content:
            "Are you sure you want to delete this timer? (yes/no)\n\n\nTime left: **" +
            RM.pretty_ms(idTimer.time - Date.now()) +
            "**\nTimer Message: **'" +
            idTimer.message +
            "'**\nTimer ID: **" +
            idTimer.timerid +
            "**\nTimer Author: **" +
            username +
            "**",
          reply: { messageReference: message.id },
        });
        const filter = (m) => m.author.id === message.author.id;
        message.channel
          .awaitMessages({ filter, max: 1, time: 30000 })
          .then(async (collected) => {
            let msg = collected.first();
            if (
              msg.content.toLowerCase() === "yes" ||
              msg.content.toLowerCase() === "y"
            ) {
              await connect.query("DELETE FROM timer WHERE timerid = " + time);
              global.updatedTimers = true;

              return message.channel.send({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor({
                      name: message.author.tag,
                      iconURL: message.author.avatarURL(),
                    })
                    .setDescription("Timer " + time + " has been deleted.")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Timer Deleted"),
                ],
              });
            } else {
              return message.channel.send({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor({
                      name: message.author.tag,
                      iconURL: message.author.avatarURL(),
                    })
                    .setDescription("Timer deletion cancelled.")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Timer Cancelled"),
                ],
              });
            }
          })
          .catch(() => {
            return message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("Timer deletion cancelled.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Timer Cancelled"),
              ],
            });
          });
      } else if (args[1].toLowerCase() === "info") {
        let username = await RM.client.users.fetch(idTimer.userid);
        username = username.username + "#" + username.discriminator;
        message.channel.send({
          content:
            "Time left: **" +
            RM.pretty_ms(idTimer.time - Date.now()) +
            "**\nTimer Message: **'" +
            idTimer.message +
            "'**\nTimer ID: **" +
            idTimer.timerid +
            "**\nTimer Author: **" +
            username +
            "**",
          reply: { messageReference: message.id },
        });
      } else if (args[1].toLowerCase() === "edit") {
        let username = await RM.client.users.fetch(idTimer.userid);
        username = username.username + "#" + username.discriminator;
        if (!args[2]) {
          return message.channel.send({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("Please enter the part to edit (message/time).")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Missing Arguments"),
            ],
          });
        }
        if (args[2].toLowerCase() === "message") {
          if (!args[3]) {
            return message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("Please enter the new message.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Missing Arguments"),
              ],
            });
          }
          let username = await RM.client.users.fetch(idTimer.userid);
          username = username.username + "#" + username.discriminator;
          message.channel.send({
            content:
              "Are you sure you want to edit this timer? (yes/no)\n\n\nTime left: **" +
              RM.pretty_ms(idTimer.time - Date.now()) +
              "**\nTimer Message: **'" +
              idTimer.message +
              "'**\nTimer ID: **" +
              idTimer.timerid +
              "**\nTimer Author: **" +
              username +
              "**\n\nEditing: **MESSAGE**",
            reply: { messageReference: message.id },
          });
          const filter = (m) => m.author.id === message.author.id;
          message.channel
            .awaitMessages({ filter, max: 1, time: 30000 })
            .then(async (collected) => {
              let msg = collected.first();
              if (
                msg.content.toLowerCase() === "yes" ||
                msg.content.toLowerCase() === "y"
              ) {
                await connect.query(
                  "UPDATE timer SET message = '" +
                    args.slice(3).join(" ") +
                    "' WHERE timerid = " +
                    time
                );
                global.updatedTimers = true;
                return message.channel.send({
                  embeds: [
                    new RM.Discord.MessageEmbed()
                      .setColor("GREEN")
                      .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.avatarURL(),
                      })
                      .setDescription(
                        "Changed message of timer with ID **" +
                          time +
                          "** to: **'" +
                          args.slice(3).join(" ") +
                          "'**"
                      )
                      .setThumbnail(message.guild.iconURL())
                      .setTitle("Timer Edited"),
                  ],
                });
              } else {
                return message.channel.send({
                  embeds: [
                    new RM.Discord.MessageEmbed()
                      .setColor("RED")
                      .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.avatarURL(),
                      })
                      .setDescription("Timer update cancelled.")
                      .setThumbnail(message.guild.iconURL())
                      .setTitle("Timer Cancelled"),
                  ],
                });
              }
            })
            .catch(() => {
              return message.channel.send({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor({
                      name: message.author.tag,
                      iconURL: message.author.avatarURL(),
                    })
                    .setDescription("Timer update cancelled.")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Timer Cancelled"),
                ],
              });
            });
        } else if (args[2].toLowerCase() === "time") {
          if (!args[3]) {
            return message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("Please enter the new time.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Missing Arguments"),
              ],
            });
          }
          let newTime = new Date().getTime() + getTimeInMS(args[3]);
          if (newTime < Date.now()) {
            return message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("Please enter a valid time.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Invalid Time"),
              ],
            });
          }
          let username = await RM.client.users.fetch(idTimer.userid);
          username = username.username + "#" + username.discriminator;
          message.channel.send({
            content:
              "Are you sure you want to edit this timer? (yes/no)\n\n\nTime left: **" +
              RM.pretty_ms(idTimer.time - Date.now()) +
              "**\nTimer Message: **'" +
              idTimer.message +
              "'**\nTimer ID: **" +
              idTimer.timerid +
              "**\nTimer Author: **" +
              username +
              "**\n\nEditing: **TIME**",
            reply: { messageReference: message.id },
          });
          const filter = (m) => m.author.id === message.author.id;
          message.channel
            .awaitMessages({ filter, max: 1, time: 30000 })
            .then(async (collected) => {
              let msg = collected.first();
              if (
                msg.content.toLowerCase() === "yes" ||
                msg.content.toLowerCase() === "y"
              ) {
                await connect.query(
                  "UPDATE timer SET time = " +
                    newTime +
                    " WHERE timerid = " +
                    time
                );
                global.updatedTimers = true;
                return message.channel.send({
                  embeds: [
                    new RM.Discord.MessageEmbed()
                      .setColor("GREEN")
                      .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.avatarURL(),
                      })
                      .setDescription(
                        "The time on timer with ID **" +
                          time +
                          "** has been changed to: **" +
                          RM.pretty_ms(newTime - Date.now()) +
                          "**"
                      )
                      .setThumbnail(message.guild.iconURL())
                      .setTitle("Timer Edited"),
                  ],
                });
              } else {
                return message.channel.send({
                  embeds: [
                    new RM.Discord.MessageEmbed()
                      .setColor("RED")
                      .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.avatarURL(),
                      })
                      .setDescription("Timer update cancelled.")
                      .setThumbnail(message.guild.iconURL())
                      .setTitle("Timer Cancelled"),
                  ],
                });
              }
            })
            .catch(() => {
              return message.channel.send({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor({
                      name: message.author.tag,
                      iconURL: message.author.avatarURL(),
                    })
                    .setDescription("Timer update cancelled.")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Timer Cancelled"),
                ],
              });
            });
        }
      }
      return;
    }
  }
  let timeEnd = new Date().getTime() + getTimeInMS(time);
  console.log(time, timeEnd, new Date().getTime(), getTimeInMS(time));
  if (timeEnd < Date.now() && !getTimeInMS(time)) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Please enter a valid time.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid Time"),
      ],
    });
  }
  let id = Math.floor(new Date().getTime() * Math.random());
  await connect.query(
    `INSERT INTO timer(timerid, userid, time, settings, channelid, messageid, message) VALUES(${id}, ${
      message.author.id
    }, ${timeEnd}, '${JSON.stringify({})}', ${message.channel.id}, ${
      message.id
    }, '${timerMessage}')`
  );
  global.updatedTimers = true;
  return message.channel.send({
    embeds: [
      new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setDescription("Timer set for " + niceify(time) + ".\nTimer ID: " + id)
        .setThumbnail(message.guild.iconURL())
        .setTitle("Timer Set"),
    ],
  });
  function niceify(time) {
    let time2 = time
      .replace(/([0-9]+)/g, " $1 ")
      .trim()
      .split(" ");
    //join [0] with [1], [2] with [3] etc
    let time3 = [];
    for (let i = 0; i < time2.length; i += 2) {
      time3.push(time2[i] + time2[i + 1].toLowerCase());
    }
    return time3.join(" ");
  }
  function getTimeInMS(timeStr) {
    let CU = require("convert-units");
    let valid = ["ns", "mu", "ms", "s", "m", "h", "d", "w", "mth", "y"];
    if (
      ["list", "delete", "edit", "info"].includes(timeStr.toLowerCase()) ||
      typeof timeStr !== "string" ||
      !timeStr.match(/([a-zA-Z])/g)
    ) {
      //   console.log("i dont like this, returning");
      return null;
    }
    // console.log("check passed in gTIMS", timeStr);
    let time2 = timeStr
      .replace(/([0-9]+)/g, " $1 ")
      .trim()
      .split(" ");
    let time = 0;
    for (let i = 0; i < time2.length; i += 2) {
      if (valid.includes(time2[i + 1].toLowerCase())) {
        time += CU(time2[i])
          .from(convertToCU(time2[i + 1].toLowerCase()))
          .to("ms");
      } else {
        // console.log(time2[i + 1].toLowerCase(), "no match");
        return null;
      }
      //   console.log(time);
    }
    return time;
    function convertToCU(time) {
      switch (time) {
        case "m":
          return "min";
        case "w":
          return "week";
        case "mth":
          return "month";
        case "y":
          return "year";
        default:
          return time;
      }
    }
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
