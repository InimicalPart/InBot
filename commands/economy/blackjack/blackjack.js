const commandInfo = {
  primaryName: "blackjack", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["blackjack", "bj"], // These are all commands that will trigger this command.
  help: "InBot's official blackjack! Play with a bot! `[PREFIX]bj help` for more information!", // This is the general description of the command.
  aliases: ["bj"], // These are command aliases that help.js will use
  usage: "[COMMAND] <bet amount>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "economy",
  slashCommand: null,
};
function between(lower, upper) {
  var scale = upper - lower + 1;
  return Math.floor(lower + Math.random() * scale);
}
function getCard(NoA) {
  let type = between(1, 4);
  if (type === 1) {
    type = "♧";
  } else if (type === 2) {
    type = "♢";
  } else if (type === 3) {
    type = "♡";
  } else if (type === 4) {
    type = "♤";
  }
  let card;
  if (!NoA) {
    card = between(2, 14);
    if (card === 11) {
      card = "J";
    } else if (card === 12) {
      card = "Q";
    } else if (card === 13) {
      card = "K";
    } else if (card === 14) {
      card = "A";
    }
  } else {
    card = between(2, 13);
    if (card === 11) {
      card = "J";
    } else if (card === 12) {
      card = "Q";
    } else if (card === 13) {
      card = "K";
    }
  }
  return type + card;
}
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
            name: message.author.username,
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
  if (!args[0]) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("You need to specify a bet amount.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Error"),
      ],
    });
  }
  let bet;
  if (args[0].toLowerCase() === "help") {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "You can play blackjack with the bot!\n\n" +
              "Welcome to InBot's Blackjack! Here you can play blackjack with a dealer which even tho the dealer is a robot, it's pretty good at it.\n\n**Card values:**\nAce = **11**\n10, Jack, Queen, King = **10**\n9 = **9**\n8 = **8**\n7 = **7**\n6 = **6**\n5 = **5**\n4 = **4**\n3 = **3**\n2 = **2**\n\n" +
              "**Prize:**\nWin normally: **2 times your bet**\nGet a blackjack: **3 times your bet**\nPush: **No losses/No winnings**\nDealer gets a blackjack: **Lose 3 times your bet.**\nTimeout: **Lose your bet**\nInvalid Input: **Lose your bet**\n\n" +
              "**Betting:**\nYou need to bet at least **500** dollaroos to play, the maximum bet is **10,000** dollaroos"
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Blackjack Help")
          .setFooter({ text: "Blackjack Help" })
          .setTimestamp(),
      ],
    });
  } else if (Number.isInteger(parseInt(args[0]))) {
    if ((await connect.fetch("currency", message.author.id)) === null) {
      await connect.add("currency", message.author.id, 0, 0, 1000, 0);
    }
    bet = parseInt(args[0]);
    let tempWal = await connect.fetch("currency", message.author.id);
    const wallet = parseInt(tempWal.amountw);
    if (wallet < bet) {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("You don't have enough money to make this bet.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Error"),
        ],
      });
    } else if (bet < 500) {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("You can't bet less than 500.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Error"),
        ],
      });
    } else if (bet > 3000000) {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("You can't bet more than 3,000,000.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Error"),
        ],
      });
    } else {
      let tempWal2 = await connect.fetch("currency", message.author.id);
      const newInfo = parseInt(tempWal2.amountw);
      if (parseInt(newInfo - bet) === 0) {
        await connect.update("currency", message.author.id, 0);
      } else {
        await connect.update(
          "currency",
          message.author.id,
          parseInt(newInfo - bet)
        );
      }
      message.channel.send({
        content: "$" + bet + " has been removed from your account",
      });
    }
    /*
		postgresql database
		-----------------------
		const { Client } = require('pg');const client = new Client({connectionString: process.env.DATABASE_URL,ssl: {rejectUnauthorized: false}});client.connect();client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {if (err) throw err;for (let row of res.rows) {console.log(JSON.stringify(row));}client.end();});*/

    const playersCards = [];
    const dealersCards = [];
    const d1 = getCard(); // dealers first card
    const d2 = getCard(true); // dealers second card
    const p1 = getCard(); // players first card
    const p2 = getCard(true); // players second card
    playersCards.push(p1);
    playersCards.push(p2);
    dealersCards.push(d1);
    dealersCards.push(d2);

    let firstNum = `${p1}`.substring(1);
    let secondNum = `${p2}`.substring(1);
    let dFirstNum = `${d1}`.substring(1);
    let dSecondNum = `${d2}`.substring(1);
    if (firstNum == "J" || firstNum == "Q" || firstNum == "K") {
      firstNum = 10;
    } else if (firstNum == "A") {
      firstNum = 11;
    }

    if (secondNum == "J" || secondNum == "Q" || secondNum == "K") {
      secondNum = 10;
    }
    let totalNum = firstNum - 0 + (secondNum - 0);

    if (dFirstNum == "J" || dFirstNum == "Q" || dFirstNum == "K") {
      dFirstNum = 10;
    } else if (dFirstNum == "A") {
      dFirstNum = 11;
    }

    if (dSecondNum == "J" || dSecondNum == "Q" || dSecondNum == "K") {
      dSecondNum = 10;
    }
    let dTotalNum = dFirstNum - 0 + (dSecondNum - 0);
    if (dTotalNum == 21) {
      if (totalNum == 21) {
        const embed = new RM.Discord.MessageEmbed()
          .setColor("YELLOW")
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.avatarURL(),
          })
          .setTitle(":warning: PUSH :warning:")
          .setDescription(
            `Both the dealer and the player got a blackjack! You don't lose anything`
          )
          .addFields({
            name: "Your cards",
            value: "`" + p1 + " | " + p2 + "`" + "\nValue: " + totalNum,
          })
          .addFields({
            name: "Dealer's cards",
            value: "`" + d1 + " | " + d2 + "`" + "\nValue: " + dTotalNum,
          });
        message.channel.send({ embeds: [embed] });
        return gameFinished("push");
      }
      const embed = new RM.Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.avatarURL(),
        })
        .setTitle(":x: LOSE :x:")
        .setDescription(`Dealer got a blackjack!`)
        .addFields({
          name: "Your cards",
          value: "`" + p1 + " | " + p2 + "`" + "\nValue: " + totalNum,
        })
        .addFields({
          name: "Dealer's cards",
          value: "`" + d1 + " | " + d2 + "`" + "\nValue: " + dTotalNum,
        });

      message.channel.send({ embeds: [embed] });
      return gameFinished("dblackjack");
    }
    if (totalNum == 21) {
      const embed = new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.avatarURL(),
        })
        .setTitle(":money_with_wings: BLACKJACK :money_with_wings:")
        .setDescription(`You got a blackjack! You win $${bet * 2}!`)
        .addFields({
          name: "Your cards",
          value: "`" + p1 + " | " + p2 + "`" + "\nValue: " + totalNum,
        })
        .addFields({
          name: "Dealer's cards",
          value: "`" + d1 + " | " + d2 + "`",
        });
      message.channel.send({ embeds: [embed] });
      return gameFinished("blackjack");
    }
    const embed = new RM.Discord.MessageEmbed()
      .setColor("GREEN")
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.avatarURL(),
      })
      .setTitle("Blackjack")
      .addFields({
        name: "Your cards",
        value: "`" + p1 + " | " + p2 + "`\nValue: " + totalNum,
      })
      .addFields({
        name: "Dealers cards",
        value: "`" + d1 + " | " + "X" + "`\nValue: " + dFirstNum,
      })
      .setTimestamp()
      .setFooter({ text: "HIT or STAND" });

    await message.channel.send({ embeds: [embed] });

    let adCards = "`";
    let apCards = "`";
    for (let i in playersCards) {
      const card = playersCards[i];
      if (i - 0 + 1 == playersCards.length) {
        apCards += card + "`";
      } else {
        apCards += card + " | ";
      }
    }
    for (let i in dealersCards) {
      const card = dealersCards[i];
      if (i - 0 + 1 == dealersCards.length) {
        adCards += card + "`";
      } else {
        adCards += card + " | ";
      }
    }
    function runGame() {
      var filter2 = (m) => m.author.id === message.author.id;
      message.channel
        .awaitMessages({
          filter: filter2,
          max: 1,
          time: 30000,
          errors: ["time"],
        })
        .then((messageNext) => {
          messageNext = messageNext.first();
          if (
            messageNext.content.toLowerCase() === "hit" ||
            messageNext.content.toLowerCase() === "h"
          ) {
            console.log("a");
            let aCard = getCard();
            let aCardVal = `${aCard}`.substring(1);
            if (aCardVal == "J" || aCardVal == "Q" || aCardVal == "K") {
              aCardVal = 10;
            } else if (aCardVal == "A") {
              aCardVal = 11;
            }
            playersCards.push(aCard);
            apCards = "`";
            for (let i in playersCards) {
              const card = playersCards[i];
              if (i - 0 + 1 == playersCards.length) {
                apCards += card + "`";
              } else {
                apCards += card + " | ";
              }
            }
            totalNum = totalNum - 0 + (aCardVal - 0);
            if (totalNum > 21) {
              //tell user result
              return makeDealerEnd(apCards, "bust");
            } else if (totalNum === 21) {
              apCards = "`";
              for (let i in playersCards) {
                const card = playersCards[i];
                if (i - 0 + 1 == playersCards.length) {
                  apCards += card + "`";
                } else {
                  apCards += card + " | ";
                }
              }
              const embed = new RM.Discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.avatarURL(),
                })
                .setTitle(":money_with_wings: BLACKJACK :money_with_wings:")
                .setDescription(`You got a blackjack! You win $${bet * 2}!`)
                .addFields({
                  name: "Your cards",
                  value: apCards + "\nValue: " + totalNum,
                })
                .addFields({
                  name: "Dealer's cards",
                  value: adCards + "\nValue: " + dTotalNum,
                });
              message.channel.send({ embeds: [embed] });
              return gameFinished("playerwin");
            } else {
              apCards = "`";
              for (let i in playersCards) {
                const card = playersCards[i];
                if (i - 0 + 1 == playersCards.length) {
                  apCards += card + "`";
                } else {
                  apCards += card + " | ";
                }
              }
              const embed = new RM.Discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.avatarURL(),
                })
                .setTitle("Blackjack")
                .addFields({
                  name: "Your cards",
                  value: apCards + "\nValue: " + totalNum,
                })
                .addFields({
                  name: "Dealers cards",
                  value: "`" + d1 + " | " + "X" + "`\nValue: " + dFirstNum,
                })
                .setTimestamp()
                .setFooter({ text: "HIT or STAND, 30 seconds to answer" });

              message.channel.send({ embeds: [embed] });
            }
            runGame();
          } else if (
            messageNext.content.toLowerCase() === "stand" ||
            messageNext.content.toLowerCase() === "s"
          ) {
            return makeDealerEnd(apCards, "stand");
          } else {
            // ADD DOUBLE / SPLIT
            message.channel.send({
              content:
                "Not understood, (to make sure this isnt used to cheat, this will remove 500 currency)",
            });
            return gameFinished("invalid");
          }
        })
        .catch((e) => {
          message.channel.send({
            content:
              e +
              "Time limit reached. (to make sure this isnt used to cheat, this will remove 500 currency)",
          });
          return gameFinished("timeout");
        });
    }
    console.log("running game");
    runGame();
    function makeDealerEnd(player, reason) {
      //Dealer makes his moves
      const chance = between(1, 3);
      let dealernum;

      if (chance === 3) {
        dealernum = 17;
      } else {
        dealernum = between(14, 16);
      }
      function dealerTurn(dTotalNumF) {
        adCards = "`";
        for (let i in dealersCards) {
          const card = dealersCards[i];
          if (i - 0 + 1 == dealersCards.length) {
            adCards += card + "`";
          } else {
            adCards += card + " | ";
          }
        }
        if (dTotalNumF > dealernum) {
          if (dTotalNumF > 21) {
            if (reason === "bust") {
              const embed = new RM.Discord.MessageEmbed()
                .setColor("YELLOW")
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.avatarURL(),
                })
                .setTitle(":warning: PUSH :warning:")
                .setDescription(`Both the dealer and you busted!`)
                .addFields({
                  name: "Your cards",
                  value: player + "\nValue: " + totalNum,
                })
                .addFields({
                  name: "Dealers cards",
                  value: adCards + "\nValue: " + dTotalNumF,
                })
                .setTimestamp();
              message.channel.send({ embeds: [embed] });
              return gameFinished("push");
            } else {
              const embed = new RM.Discord.MessageEmbed()
                .setColor("GREEN")
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.avatarURL(),
                })
                .setTitle(":white_check_mark: YOU WIN :white_check_mark:")
                .setDescription(`The dealer BUSTED!`)
                .addFields({
                  name: "Your cards",
                  value: player + "\nValue: " + totalNum,
                })
                .addFields({
                  name: "Dealers cards",
                  value: adCards + "\nValue: " + dTotalNumF,
                })
                .setTimestamp();

              message.channel.send({ embeds: [embed] });
              return gameFinished("playerwin");
            }
          } else if (dTotalNumF === 21) {
            const embed = new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setTitle(":x: DEALER WINS :x:")
              .setDescription(`The dealer got a blackjack!`)
              .addFields({
                name: "Your cards",
                value: player + "\nValue: " + totalNum,
              })
              .addFields({
                name: "Dealers cards",
                value: adCards + "\nValue: " + dTotalNum,
              })
              .setTimestamp();

            message.channel.send({ embeds: [embed] });
            return gameFinished("dblackjack");
          } else if (dTotalNumF > totalNum) {
            //dealer stands
            const embed = new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setTitle(":x: DEALER WINS :x:")
              .setDescription(
                `The dealer had \`${dTotalNumF}\` and you had \`${totalNum}\`.`
              )
              .addFields({
                name: "Your cards",
                value: player + "\nValue: " + totalNum,
              })
              .addFields({
                name: "Dealers cards",
                value: adCards + "\nValue: " + dTotalNum,
              })
              .setTimestamp();

            message.channel.send({ embeds: [embed] });
            return gameFinished("dealerwin");
          } else if (dTotalNumF === totalNum) {
            const embed = new RM.Discord.MessageEmbed()
              .setColor("YELLOW")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setTitle(":warning: PUSH :warning:")
              .addFields({
                name: "Your cards",
                value: player + "\nValue: " + totalNum,
              })
              .addFields({
                name: "Dealers cards",
                value: adCards + "\nValue: " + dTotalNumF,
              })
              .setTimestamp();

            message.channel.send({ embeds: [embed] });
            return gameFinished("push");
          } else if (dTotalNumF < totalNum && reason !== "bust") {
            const embed = new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setTitle(":white_check_mark: YOU WIN :white_check_mark:")
              .setDescription(
                `The dealer had \`${dTotalNumF}\` and you had \`${totalNum}\`. You won!`
              )
              .addFields({
                name: "Your cards",
                value: player + "\nValue: " + totalNum,
              })
              .addFields({
                name: "Dealers cards",
                value: adCards + "\nValue: " + dTotalNumF,
              })
              .setTimestamp();

            message.channel.send({ embeds: [embed] });
            return gameFinished("playerwin");
          } else if (reason == "bust") {
            apCards = "`";
            for (let i in playersCards) {
              const card = playersCards[i];
              if (i - 0 + 1 == playersCards.length) {
                apCards += card + "`";
              } else {
                apCards += card + " | ";
              }
            }
            const embed = new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL(),
              })
              .setTitle(":x: BUST :x:")
              .setDescription(`You BUSTED! You lose ${bet}!`)
              .addFields({
                name: "Your cards",
                value: player + "\nValue: " + totalNum,
              })
              .addFields({
                name: "Dealers cards",
                value: adCards + "\nValue: " + dTotalNumF,
              });
            message.channel.send({ embeds: [embed] });
            gameFinished("bust");
          }
        } else {
          let aCard = getCard();
          let aCardVal = `${aCard}`.substring(1);
          if (aCardVal == "J" || aCardVal == "Q" || aCardVal == "K") {
            aCardVal = 10;
          } else if (aCardVal == "A") {
            aCardVal = 11;
          }
          dealersCards.push(aCard);
          dTotalNum = dTotalNum - 0 + (aCardVal - 0);
          dealerTurn(dTotalNum);
        }
      }
      dealerTurn(dTotalNum);
    }
    async function gameFinished(reason) {
      if (reason == "timeout") {
        message.channel.send({
          content: "Game ended because time ran out. You lost: `$" + bet + "`",
        });
      } else if (reason == "bust") {
        message.channel.send({
          content: "Game ended because of bust. You lost: `$" + bet + "`",
        });
      } else if (reason == "invalid") {
        message.channel.send({
          content:
            "Game ended because of invalid input. You lost: `$" + bet + "`",
        });
      } else if (reason == "dblackjack") {
        const info = await connect.fetch("currency", message.author.id);
        message.channel.send({
          content:
            "Game ended because the dealer got a blackjack. You lost: `$" +
            bet * 2 +
            "`",
        });
        connect.update(
          "currency",
          message.author.id,
          info.amountw - 0 - (bet - 0)
        );
      } else if (reason == "blackjack") {
        const info = await connect.fetch("currency", message.author.id);
        connect.update(
          "currency",
          message.author.id,
          info.amountw - 0 + bet * 2
        );
        message.channel.send({
          content:
            "Game ended because the player got a blackjack. You win: `$" +
            bet * 2 +
            "`",
        });
        message.channel.send({
          content: "`$" + bet * 2 + "` has been added to your account",
        });
      } else if (reason == "dealerwin") {
        message.channel.send({
          content:
            "Game ended because the dealer got a blackjack or got closest to a blackjack. You lost: `$" +
            bet +
            "`",
        });
      } else if (reason == "playerwin") {
        const info = await connect.fetch("currency", message.author.id);
        connect.update(
          "currency",
          message.author.id,
          info.amountw - 0 + bet * 2
        );
        message.channel.send({
          content:
            "Game ended because the player got a blackjack or got closest to a blackjack. You win: `$" +
            bet * 2 +
            "`",
        });
        message.channel.send({
          content: "`$" + bet * 2 + "` has been added to your account",
        });
      } else if (reason == "push") {
        const info = await connect.fetch("currency", message.author.id);
        connect.update("currency", message.author.id, info.amountw - 0 + bet);
        message.channel.send({
          content:
            "Game ended because both the dealer and the player got a blackjack, busted or have the same card value. You didn't lose anything.",
        });
      }
      const newMoney = await connect.fetch("currency", message.author.id);
      const wallet = "" + newMoney.amountw;
      if (wallet.includes("-")) {
        message.channel.send({
          content:
            "**Oh shoot! You're in the negatives, work to earn back your money!**",
        });
      }
      message.channel.send({
        content: "Your balance is now: `$" + newMoney.amountw + "`",
      });

      await connect.end(true);
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
