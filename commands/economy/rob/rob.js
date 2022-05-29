const commandInfo = {
  primaryName: "rob", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["rob", "steal"], // These are all commands that will trigger this command.
  help: "Rob another users wallet!", // This is the general description of the command.
  aliases: ["steal"], // These are command aliases that help.js will use
  usage: "[COMMAND] <user>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
  slashCommand: null,
};
function calcPercent(percent, number) {
  return parseInt((percent / 100) * number);
}
function between(lower, upper) {
  var scale = upper - lower + 1;
  return Math.floor(lower + Math.random() * scale);
}
async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require(RM.path.resolve(global.dirName, "config.js")).cmdRob) {
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
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:980471497057501205> *Working on it...*"
        ),
      ],
    })
    .then(async (m) => {
      const { connect } = require("../../../databasec");
      await connect();
      await connect.create("currency");
      await connect.create("cooldown");

      if ((await connect.fetch("currency", message.author.id)) == null) {
        await connect.add("currency", message.author.id);
      }

      if ((await connect.fetch("cooldown", message.author.id)) == null) {
        await connect.add("cooldown", message.author.id);
      }
      if (!args[0]) {
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You need to specify a user to rob!")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return await connect.end(true);
      }
      let user;
      try {
        user =
          message.mentions.members.first() ||
          (await message.guild.members.fetch(args[0])) ||
          (await message.guild.members.fetch(
            (r) =>
              r.user.username.toLowerCase() ===
              args.join(" ").toLocaleLowerCase()
          )) ||
          (await message.guild.members.fetch(
            (r) =>
              r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
          )) ||
          (await message.guild.members.fetch(args[0])) ||
          null;
      } catch (e) {
        user = null;
      }
      if (user == null) {
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("**Error:** User not found!")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return await connect.end(true);
      }
      if (user.user) {
        user = user.user;
      }
      const userCooldown = await connect.fetch("cooldown", message.author.id);
      if (userCooldown.robcool !== null) {
        const cooldown = new Date(userCooldown.robcool * 1000);
        const now = new Date();
        var DITC = cooldown.getTime() - now.getTime();
        const timeLeft = RM.pretty_ms;
        if (DITC.toString().includes("-")) {
        } else {
          m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription(
                  "**Error:** You are on cooldown! Time left:\n`" +
                    timeLeft(DITC) +
                    "`"
                )
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
          return await connect.end(true);
        }
      }

      if ((await connect.fetch("currency", user.id)) == null) {
        await connect.add("currency", user.id);
      }
      if ((await connect.fetch("inventory", user.id)) == null) {
        await connect.add("inventory", user.id);
      }
      if ((await connect.fetch("inventory", message.author.id)) == null) {
        await connect.add("inventory", message.author.id);
      }

      /*if (connect.fetch("inventory", user.id) == null) {
      connect.add("inventory", user.id)
    }
  	
    Check if user has a lockpick or a landmine
    */

      let userCurrency = await connect.fetch("currency", user.id);
      let authorCurrency = await connect.fetch("currency", message.author.id);
      let userWal = userCurrency.amountw;
      let authorWal = authorCurrency.amountw;

      if (authorWal < 500) {
        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "**Error:** You need at least 500 coins to rob someone!"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
        return await connect.end(true);
      }
      if (userWal < 500) {
        await connect.end(true);
        return m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "**" +
                  user.username +
                  "** needs to have more than 500 coins, otherwise it's just not worth it."
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Error"),
          ],
        });
      }
      const victimInv = await connect.fetch("inventory", user.id);
      const thiefInv = await connect.fetch("inventory", message.author.id);
      const victimActive = victimInv.items.active;
      if (victimActive.padlock !== undefined) {
        const padlockExpiry = victimActive.padlock;
        const padlockExpiryDate = new Date(padlockExpiry);
        if (
          (padlockExpiryDate.getTime() - new Date().getTime())
            .toString()
            .includes("-")
        ) {
          delete victimInv.items.active.padlock;
          await connect.updateInv(
            "inventory",
            message.author.id,
            victimInv.items
          );
          user.send({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("Your padlock expired!")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
          await connect.updateCooldown(
            "cooldown",
            message.author.id,
            new Date(new Date().setTime(new Date().getTime() + 45 * 60 * 1000))
          );
          rest();
        } else {
          console.log(thiefInv.items.lockpick);
          if (
            thiefInv.items.lockpick !== null &&
            thiefInv.items.lockpick !== undefined &&
            thiefInv.items.lockpick >= 1
          ) {
            m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("YELLOW")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription(
                    "This user has an active padlock! You have `" +
                      thiefInv.items.lockpick +
                      "` lockpicks.\nDo you want to use one and try to pick the lock?\n\n`yes/y/no/n`"
                  )
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Padlock"),
              ],
            });
            var filter2 = (m) => m.author.id === message.author.id;
            await message.channel
              .awaitMessages({
                filter: filter2,
                max: 1,
                time: 30000,
                errors: ["time"],
              })
              .then(async (messageNext) => {
                messageNext = messageNext.first();
                const response = messageNext.content.toLowerCase();
                if (response === "yes" || response === "y") {
                  thiefInv.items.lockpick -= 1;
                  if (thiefInv.items.lockpick === 0) {
                    delete thiefInv.items.lockpick;
                  }
                  await connect.updateCooldown(
                    "cooldown",
                    message.author.id,
                    new Date(
                      new Date().setTime(new Date().getTime() + 45 * 60 * 1000)
                    )
                  );
                  await connect.updateInv(
                    "inventory",
                    message.author.id,
                    thiefInv.items
                  );

                  m.edit({
                    embeds: [
                      new RM.Discord.MessageEmbed()
                        .setColor("AQUA")
                        .setAuthor({
                          name: message.author.tag,
                          iconURL: message.author.avatarURL(),
                        })
                        .setDescription(
                          "Picking...\n\n:lock: Pin 1: **NOT BOUND**\n" +
                            ":lock: Pin 2: **NOT BOUND**\n" +
                            ":lock: Pin 3: **NOT BOUND**\n" +
                            ":lock: Pin 4: **NOT BOUND**\n" +
                            ":lock: Pin 5: **NOT BOUND**"
                        )
                        .setThumbnail(message.guild.iconURL())
                        .setTitle("Padlock Picking"),
                    ],
                  });
                  let pin1 = "NOT BOUND";
                  let pin2 = "NOT BOUND";
                  let pin3 = "NOT BOUND";
                  let pin4 = "NOT BOUND";
                  let pin5 = "NOT BOUND";
                  const pins = [1, 2, 3, 4, 5];
                  let pickBroke = false;
                  setTimeout(() => {
                    const selectedPin = Math.floor(Math.random() * pins.length);
                    const pin = pins[selectedPin];
                    if (pin == 1) {
                      pin1 = "BOUND";
                    }
                    if (pin == 2) {
                      pin2 = "BOUND";
                    }
                    if (pin == 3) {
                      pin3 = "BOUND";
                    }
                    if (pin == 4) {
                      pin4 = "BOUND";
                    }
                    if (pin == 5) {
                      pin5 = "BOUND";
                    }
                    pins.splice(selectedPin, 1);
                    if (between(1, 20) == 10) {
                      pickBroke = true;
                      return broke();
                    }
                    m.edit({
                      embeds: [
                        new RM.Discord.MessageEmbed()
                          .setColor("AQUA")
                          .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.avatarURL(),
                          })
                          .setDescription(
                            "Picking...\n\n:lock: Pin 1: **" +
                              pin1 +
                              "**\n:lock: Pin 2: **" +
                              pin2 +
                              "**\n:lock: Pin 3: **" +
                              pin3 +
                              "**\n:lock: Pin 4: **" +
                              pin4 +
                              "**\n:lock: Pin 5: **" +
                              pin5 +
                              "**"
                          )
                          .setThumbnail(message.guild.iconURL())
                          .setTitle("Padlock Picking"),
                      ],
                    });
                    setTimeout(() => {
                      const selectedPin = Math.floor(
                        Math.random() * pins.length
                      );
                      const pin = pins[selectedPin];
                      if (pin == 1) {
                        pin1 = "BOUND";
                      }
                      if (pin == 2) {
                        pin2 = "BOUND";
                      }
                      if (pin == 3) {
                        pin3 = "BOUND";
                      }
                      if (pin == 4) {
                        pin4 = "BOUND";
                      }
                      if (pin == 5) {
                        pin5 = "BOUND";
                      }
                      pins.splice(selectedPin, 1);
                      if (between(1, 20) == 10) {
                        pickBroke = true;
                        return broke();
                      }
                      m.edit({
                        embeds: [
                          new RM.Discord.MessageEmbed()
                            .setColor("AQUA")
                            .setAuthor({
                              name: message.author.tag,
                              iconURL: message.author.avatarURL(),
                            })
                            .setDescription(
                              "Picking...\n\n:lock: Pin 1: **" +
                                pin1 +
                                "**\n:lock: Pin 2: **" +
                                pin2 +
                                "**\n:lock: Pin 3: **" +
                                pin3 +
                                "**\n:lock: Pin 4: **" +
                                pin4 +
                                "**\n:lock: Pin 5: **" +
                                pin5 +
                                "**"
                            )
                            .setThumbnail(message.guild.iconURL())
                            .setTitle("Padlock Picking"),
                        ],
                      });
                      setTimeout(() => {
                        const selectedPin = Math.floor(
                          Math.random() * pins.length
                        );
                        const pin = pins[selectedPin];
                        if (pin == 1) {
                          pin1 = "BOUND";
                        }
                        if (pin == 2) {
                          pin2 = "BOUND";
                        }
                        if (pin == 3) {
                          pin3 = "BOUND";
                        }
                        if (pin == 4) {
                          pin4 = "BOUND";
                        }
                        if (pin == 5) {
                          pin5 = "BOUND";
                        }
                        pins.splice(selectedPin, 1);
                        if (between(1, 20) == 10) {
                          pickBroke = true;
                          return broke();
                        }
                        m.edit({
                          embeds: [
                            new RM.Discord.MessageEmbed()
                              .setColor("AQUA")
                              .setAuthor({
                                name: message.author.tag,
                                iconURL: message.author.avatarURL(),
                              })
                              .setDescription(
                                "Picking...\n\n:lock: Pin 1: **" +
                                  pin1 +
                                  "**\n:lock: Pin 2: **" +
                                  pin2 +
                                  "**\n:lock: Pin 3: **" +
                                  pin3 +
                                  "**\n:lock: Pin 4: **" +
                                  pin4 +
                                  "**\n:lock: Pin 5: **" +
                                  pin5 +
                                  "**"
                              )
                              .setThumbnail(message.guild.iconURL())
                              .setTitle("Padlock Picking"),
                          ],
                        });
                        setTimeout(() => {
                          const selectedPin = Math.floor(
                            Math.random() * pins.length
                          );
                          const pin = pins[selectedPin];
                          if (pin == 1) {
                            pin1 = "BOUND";
                          }
                          if (pin == 2) {
                            pin2 = "BOUND";
                          }
                          if (pin == 3) {
                            pin3 = "BOUND";
                          }
                          if (pin == 4) {
                            pin4 = "BOUND";
                          }
                          if (pin == 5) {
                            pin5 = "BOUND";
                          }
                          pins.splice(selectedPin, 1);
                          m.edit({
                            embeds: [
                              new RM.Discord.MessageEmbed()
                                .setColor("AQUA")
                                .setAuthor({
                                  name: message.author.tag,
                                  iconURL: message.author.avatarURL(),
                                })
                                .setDescription(
                                  "Picking...\n\n:lock: Pin 1: **" +
                                    pin1 +
                                    "**\n:lock: Pin 2: **" +
                                    pin2 +
                                    "**\n:lock: Pin 3: **" +
                                    pin3 +
                                    "**\n:lock: Pin 4: **" +
                                    pin4 +
                                    "**\n:lock: Pin 5: **" +
                                    pin5 +
                                    "**"
                                )
                                .setThumbnail(message.guild.iconURL())
                                .setTitle("Padlock Picking"),
                            ],
                          });
                          setTimeout(async () => {
                            const selectedPin = Math.floor(
                              Math.random() * pins.length
                            );
                            const pin = pins[selectedPin];
                            if (pin == 1) {
                              pin1 = "BOUND";
                            }
                            if (pin == 2) {
                              pin2 = "BOUND";
                            }
                            if (pin == 3) {
                              pin3 = "BOUND";
                            }
                            if (pin == 4) {
                              pin4 = "BOUND";
                            }
                            if (pin == 5) {
                              pin5 = "BOUND";
                            }
                            pins.splice(selectedPin, 1);
                            if (between(1, 20) == 10) {
                              pickBroke = true;
                              return broke();
                            }
                            m.edit({
                              embeds: [
                                new RM.Discord.MessageEmbed()
                                  .setColor("AQUA")
                                  .setAuthor({
                                    name: message.author.tag,
                                    iconURL: message.author.avatarURL(),
                                  })
                                  .setDescription(
                                    "Picking...\n\n:lock: Pin 1: **" +
                                      pin1 +
                                      "**\n:lock: Pin 2: **" +
                                      pin2 +
                                      "**\n:lock: Pin 3: **" +
                                      pin3 +
                                      "**\n:lock: Pin 4: **" +
                                      pin4 +
                                      "**\n:lock: Pin 5: **" +
                                      pin5 +
                                      "**"
                                  )
                                  .setThumbnail(message.guild.iconURL())
                                  .setTitle("Padlock Picking"),
                              ],
                            });
                            delete victimInv.items.active.padlock;
                            await connect.updateInv(
                              "inventory",
                              user.id,
                              victimInv.items
                            );
                            return rest();
                          }, between(2000, 4000));
                        }, between(2000, 4000));
                      }, between(2000, 4000));
                    }, between(2000, 4000));
                  }, between(2000, 4000));
                  async function broke() {
                    await connect.end(true);
                    return m.edit({
                      embeds: [
                        new RM.Discord.MessageEmbed()
                          .setColor("RED")
                          .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.avatarURL(),
                          })
                          .setDescription(
                            "Lockpick broke and you failed to rob " +
                              user.username +
                              "!"
                          )
                          .setThumbnail(message.guild.iconURL())
                          .setTitle("Lockpick broke!"),
                      ],
                    });
                  }
                } else if (response === "no" || response === "n") {
                  await connect.updateCooldown(
                    "cooldown",
                    message.author.id,
                    new Date(
                      new Date().setTime(new Date().getTime() + 45 * 60 * 1000)
                    )
                  );
                  m.edit({
                    embeds: [
                      new RM.Discord.MessageEmbed()
                        .setColor("RED")
                        .setAuthor({
                          name: message.author.tag,
                          iconURL: message.author.avatarURL(),
                        })
                        .setDescription(
                          "User has an active padlock but you didnt use a lockpick!"
                        )
                        .setThumbnail(message.guild.iconURL())
                        .setTitle("Error"),
                    ],
                  });

                  return await connect.end(true);
                }
              })
              .catch(async (e) => {
                message.channel.send({ content: "Timeout, " + e.message });
                await connect.updateCooldown(
                  "cooldown",
                  message.author.id,
                  new Date(
                    new Date().setTime(new Date().getTime() + 45 * 60 * 1000)
                  )
                );
                console.log(e);
                await connect.end(true);
              });
          } else {
            await connect.updateCooldown(
              "cooldown",
              message.author.id,
              new Date(
                new Date().setTime(new Date().getTime() + 45 * 60 * 1000)
              )
            );
            m.edit({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription(
                    "User has an active padlock but you don't have a lockpick!"
                  )
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Error"),
              ],
            });

            return await connect.end(true);
          }
        }
      }
      await connect.updateCooldown(
        "cooldown",
        message.author.id,
        new Date(new Date().setTime(new Date().getTime() + 45 * 60 * 1000))
      );
      rest();
      //await connect.updateCooldown("cooldown", message.author.id, new Date(new Date().setTime(new Date().getTime() + (45 * 60 * 1000))))
      async function rest() {
        if (victimInv.items.active.landmine !== undefined) {
          const landmineExpiry = victimActive.landmine;
          const landmineExpiryDate = new Date(landmineExpiry);
          if (
            (landmineExpiryDate.getTime() - new Date().getTime())
              .toString()
              .includes("-")
          ) {
            delete victimInv.items.active.landmine;
            await connect.updateInv("inventory", user.id, victimInv.items);
            user.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("Your landmine expired!")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Error"),
              ],
            });
          } else {
            delete victimInv.items.active.landmine;
            await connect.updateInv("inventory", user.id, victimInv.items);
            const victimBal = await connect.fetch(
              "currency",
              message.author.id
            );
            if (between(1, 100) > 50) {
              //instant death
              await connect.update("currency", message.author.id, 0);
              m.edit({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor({
                      name: message.author.tag,
                      iconURL: message.author.avatarURL(),
                    })
                    .setDescription(
                      "You have been killed by a landmine! You lost **`$" +
                        victimBal.amountw +
                        "`**!"
                    )
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("You died!"),
                ],
              });
              return await connect.end(true);
            }
          }
        }
        const failOdds = between(0, 100);
        if (failOdds > 75) {
          const fortyOfBal = calcPercent(50, authorWal);
          const amountToRemove = between(200, fortyOfBal);
          await connect.update(
            "currency",
            user.id,
            parseInt(userWal) + parseInt(amountToRemove)
          );

          await connect.update(
            "currency",
            message.author.id,
            parseInt(authorWal) - parseInt(amountToRemove)
          );

          m.edit({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription(
                  "You got caught while trying to rob **" +
                    user.username +
                    "** You lost: **`$" +
                    amountToRemove +
                    "`**!"
                )
                .setThumbnail(message.guild.iconURL())
                .setTitle("Fail"),
            ],
          });
          return await connect.end(true);
        }
        const fiftyOfBal = calcPercent(75, userWal);
        const amountToRemove = parseInt(between(300, fiftyOfBal));

        await connect.update(
          "currency",
          user.id,
          parseInt(userWal) - parseInt(amountToRemove)
        );

        await connect.update(
          "currency",
          message.author.id,
          parseInt(authorWal) + parseInt(amountToRemove)
        );

        m.edit({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "You successfully robbed **" +
                  user.username +
                  "** You got: **`$" +
                  amountToRemove +
                  "`**!"
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Success"),
          ],
        });
        user.send({
          content:
            "**" +
            message.author.tag +
            "** just robbed you out of **`$" +
            amountToRemove +
            "`**!",
        });
        return await connect.end(true);
      }
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
