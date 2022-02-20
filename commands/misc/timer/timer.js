const commandInfo = {
  primaryName: "timer", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["timer", "t"], // These are all commands that will trigger this command.
  help: "Sets a timer to notify you", // This is the general description of the command.
  aliases: ["t"], // These are command aliases that help.js will use
  usage: "[COMMAND] <time> <time unit> [message]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdTimer) {
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
  let unit = args[1];
  let timerMessage = args.slice(2).join(" ");
  if (!time) {
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
  } else if (!unit && String(time).toLowerCase() !== "list") {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Please enter a time unit.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Missing Arguments"),
      ],
    });
  }
  const { connect } = require(path.resolve(global.dirName, "databasec.js"));
  await connect();
  await connect.create("timer");
  if (timerMessage.length < 1) {
    timerMessage = "Timer has ended.";
  }
  if (isNaN(parseInt(time))) {
    time = time.toLowerCase();
    if (time === "list") {
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
    }
  } else {
    let timers = await connect.query("SELECT * FROM timer");
    if (timers.rows.length >= 1) {
      timers = JSON.parse(JSON.stringify(timers.rows));
      //check if the time variable is in any of the timers ids
      let timer = timers.find((timer) => timer.timerid === time);
      if (timer) {
        // user is trying to modify the timer
        if (unit.toLowerCase() === "delete") {
          let username = await RM.client.users.fetch(timer.userid);
          username = username.username + "#" + username.discriminator;
          message.channel.send({
            content:
              "Are you sure you want to delete this timer? (yes/no)\n\n\nTime left: **" +
              RM.pretty_ms(timer.time - Date.now()) +
              "**\nTimer Message: **'" +
              timer.message +
              "'**\nTimer ID: **" +
              timer.timerid +
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
                await connect.query(
                  "DELETE FROM timer WHERE timerid = " + time
                );
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
        } else if (unit.toLowerCase() === "info") {
          let username = await RM.client.users.fetch(timer.userid);
          username = username.username + "#" + username.discriminator;
          message.channel.send({
            content:
              "Time left: **" +
              RM.pretty_ms(timer.time - Date.now()) +
              "**\nTimer Message: **'" +
              timer.message +
              "'**\nTimer ID: **" +
              timer.timerid +
              "**\nTimer Author: **" +
              username +
              "**",
            reply: { messageReference: message.id },
          });
        } else if (unit.toLowerCase() === "edit") {
          let username = await RM.client.users.fetch(timer.userid);
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
                  .setDescription(
                    "Please enter the part to edit (message/time)."
                  )
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
            let username = await RM.client.users.fetch(timer.userid);
            username = username.username + "#" + username.discriminator;
            message.channel.send({
              content:
                "Are you sure you want to edit this timer? (yes/no)\n\n\nTime left: **" +
                RM.pretty_ms(timer.time - Date.now()) +
                "**\nTimer Message: **'" +
                timer.message +
                "'**\nTimer ID: **" +
                timer.timerid +
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
                  await connect.query(
                    "UPDATE timer SET message = '" +
                      args.slice(3).join(" ") +
                      "' WHERE timerid = " +
                      time
                  );
                  return message.channel.send({
                    embeds: [
                      new RM.Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setAuthor({
                          name: message.author.tag,
                          iconURL: message.author.avatarURL(),
                        })
                        .setDescription(
                          "Timer with the ID " + time + " has been updated."
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
            if (!args[4]) {
              return message.channel.send({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor({
                      name: message.author.tag,
                      iconURL: message.author.avatarURL(),
                    })
                    .setDescription("Please enter the unit of time.")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Missing Arguments"),
                ],
              });
            }
            let newTime = null;
            try {
              newTime =
                new Date().getTime() + convert(args[3]).from(args[4]).to("ms");
            } catch (e) {
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

            let username = await RM.client.users.fetch(timer.userid);
            username = username.username + "#" + username.discriminator;
            message.channel.send({
              content:
                "Are you sure you want to edit this timer? (yes/no)\n\n\nTime left: **" +
                RM.pretty_ms(timer.time - Date.now()) +
                "**\nTimer Message: **'" +
                timer.message +
                "'**\nTimer ID: **" +
                timer.timerid +
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
                  await connect.query(
                    "UPDATE timer SET time = " +
                      newTime +
                      " WHERE timerid = " +
                      time
                  );
                  return message.channel.send({
                    embeds: [
                      new RM.Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setAuthor({
                          name: message.author.tag,
                          iconURL: message.author.avatarURL(),
                        })
                        .setDescription(
                          "Timer with the ID " + time + " has been updated."
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
  }
  let timeEnd = null;
  try {
    timeEnd = new Date().getTime() + convert(time).from(unit).to("ms");
  } catch (e) {
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
  await connect.end(true);
  return message.channel.send({
    embeds: [
      new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setDescription(
          "Timer set for " + time + " " + unit + ".\nTimer ID: " + id
        )
        .setThumbnail(message.guild.iconURL())
        .setTitle("Timer Set"),
    ],
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
module.exports = {
  runCommand,
  commandTriggers,
  commandHelp,
  commandAliases,
  commandPrim,
  commandUsage,
  commandCategory,
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
