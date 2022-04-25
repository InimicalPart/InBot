"use strict";

var commandInfo = {
  primaryName: "rayblackjack",
  // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["rayblackjack", "rbj", "raysbj"],
  // These are all commands that will trigger this command.
  help: "Play a game of blackjack against the bot",
  // This is the general description pf the command.
  aliases: ["rbj", "raysbj"],
  // These are command aliases that help.js will use
  usage: "[COMMAND]",
  // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
  slashCommand: null,
};

function runCommand(message, args, RM) {
  var queue2,
    queue3,
    queue,
    games,
    ops,
    stripIndents,
    _require,
    shuffle,
    verify,
    db,
    Discord,
    suits,
    faces,
    hitWords,
    standWords,
    deckCount,
    user,
    bal,
    amount,
    newBal,
    newBal2,
    advamount,
    current,
    dealerHand,
    playerHand,
    dealerInitialTotal,
    playerInitialTotal,
    playerTurn,
    win,
    reason,
    hit,
    card,
    total,
    inital,
    _card,
    _total,
    playerTotal,
    generateDeck,
    draw,
    calculate;

  return regeneratorRuntime.async(
    function runCommand$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            calculate = function _ref3(hand) {
              return hand
                .sort(function (a, b) {
                  return a.value - b.value;
                })
                .reduce(function (a, b) {
                  var value = b.value;
                  if (value === 11 && a + value > 21) value = 1;
                  return a + value;
                }, 0);
            };

            draw = function _ref2(channel, hand) {
              var deck = ops.games.get(channel.id).data;
              var card = deck[0];
              deck.shift();
              hand.push(card);
              return card;
            };

            generateDeck = function _ref(deckCount) {
              var deck = [];

              for (var i = 0; i < deckCount; i++) {
                for (var _i = 0, _suits = suits; _i < _suits.length; _i++) {
                  var suit = _suits[_i];
                  deck.push({
                    value: 11,
                    display: "".concat(suit, " A"),
                  });

                  for (var j = 2; j <= 10; j++) {
                    deck.push({
                      value: j,
                      display: "".concat(suit, " ").concat(j),
                    });
                  }

                  for (
                    var _i2 = 0, _faces = faces;
                    _i2 < _faces.length;
                    _i2++
                  ) {
                    var face = _faces[_i2];
                    deck.push({
                      value: 10,
                      display: "".concat(suit, " ").concat(face),
                    });
                  }
                }
              }

              return shuffle(deck);
            };

            if (require("../../../config.js").cmdRayispog) {
              _context.next = 5;
              break;
            }

            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription("Command disabled by Administrators.")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Command Disabled"),
                ],
              })
            );

          case 5:
            queue2 = global.sQueue2;
            queue3 = global.sQueue3;
            queue = global.sQueue;
            games = global.games;
            ops = {
              queue2: queue2,
              queue: queue,
              queue3: queue3,
              games: games,
            };
            stripIndents = RM.common.stripIndents; //change it to RM.common in index.js - done alr restart this beitch

            (_require = require("../../../functions")),
              (shuffle = _require.shuffle),
              (verify = _require.verify);
            db = RM.db;
            Discord = RM.Discord;
            suits = ["♠", "♥", "♦", "♣"];
            faces = ["J", "Q", "K"];
            hitWords = ["hit", "h"];
            standWords = ["stand", "s"]; //if (!args[0]) return message.channel.send('**Please Enter Your Deck Amount!**')
            //let deckCount = a random number from 1 - 8

            deckCount = Math.floor(Math.random() * 8) + 1; //let deckCount = parseInt(args[0])
            //if (isNaN(args[0])) return message.channel.send('**Please Enter A Number!**')
            // if (deckCount <= 0 || deckCount >= 9) return message.channel.send("**Please Enter A Number Between 1 - 8!**")

            user = message.author;
            bal = db.fetch("money_".concat(user.id));
            if (!bal === null) bal = 0;

            if (args[0]) {
              _context.next = 24;
              break;
            }

            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription("**Please Enter Your Bet!**")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Error"),
                ],
              })
            );

          case 24:
            amount = parseInt(args[0]);

            if (!isNaN(args[0])) {
              _context.next = 27;
              break;
            }

            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription("**Please Enter A Number!**")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Error"),
                ],
              })
            );

          case 27:
            newBal = bal + amount;
            newBal2 = bal - amount;
            advamount = amount;

            if (newBal.toString().length > 3) {
              newBal = newBal
                .toString()
                .split("")
                .reverse()
                .join("")
                .match(/.{1,3}/g)
                .join(",")
                .split("")
                .reverse()
                .join("");
            }

            if (newBal2.toString().length > 3) {
              newBal2 = newBal2
                .toString()
                .split("")
                .reverse()
                .join("")
                .match(/.{1,3}/g)
                .join(",")
                .split("")
                .reverse()
                .join("");
            }

            if (advamount.toString().length > 3) {
              advamount = advamount
                .toString()
                .split("")
                .reverse()
                .join("")
                .match(/.{1,3}/g)
                .join(",")
                .split("")
                .reverse()
                .join("");
            }

            if (!(amount > 10000)) {
              _context.next = 35;
              break;
            }

            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription(
                      "**Please Enter A Number Less Than Or Equal To 10,000!**"
                    )
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Error"),
                ],
              })
            );

          case 35:
            if (!(amount < 1000)) {
              _context.next = 37;
              break;
            }

            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription(
                      "**Please Enter A Bet Between `$1,000 - $10,000`**"
                    )
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Error"),
                ],
              })
            );

          case 37:
            if (!(bal < amount)) {
              _context.next = 39;
              break;
            }

            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription(
                      "**You Don't Have `$" + amount + "` In Your Balance!**"
                    )
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Error"),
                ],
              })
            );

          case 39:
            current = ops.games.get(message.channel.id);

            if (!current) {
              _context.next = 42;
              break;
            }

            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription(
                      "**Please Wait Until The Current Game Of `".concat(
                        current.name,
                        "` Is Finished!**"
                      )
                    )
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("Error"),
                ],
              })
            );

          case 42:
            _context.prev = 42;
            ops.games.set(message.channel.id, {
              name: "blackjack",
              data: generateDeck(deckCount),
            });
            dealerHand = [];
            draw(message.channel, dealerHand);
            draw(message.channel, dealerHand);
            playerHand = [];
            draw(message.channel, playerHand);
            draw(message.channel, playerHand);
            dealerInitialTotal = calculate(dealerHand);
            playerInitialTotal = calculate(playerHand);

            if (!(dealerInitialTotal === 21 && playerInitialTotal === 21)) {
              _context.next = 57;
              break;
            }

            ops.games["delete"](message.channel.id);
            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("WHITE")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription("**Both Of You Just Hit Blackjack!**")
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("DRAW"),
                ],
              })
            );

          case 57:
            if (!(dealerInitialTotal === 21)) {
              _context.next = 63;
              break;
            }

            ops.games["delete"](message.channel.id);
            db.subtract("money_".concat(user.id), amount);
            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription(
                      "**The Dealer Hit Blackjack Right Away!\nNew Balance - **` ".concat(
                        newBal2,
                        "`"
                      )
                    )
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("You Lost!"),
                ],
              })
            );

          case 63:
            if (!(playerInitialTotal === 21)) {
              _context.next = 67;
              break;
            }

            ops.games["delete"](message.channel.id);
            db.add("money_".concat(user.id), amount);
            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription(
                      "**You Hit Blackjack Right Away!\nNew Balance -**\u235F".concat(
                        newBal
                      )
                    )
                    .setThumbnail(message.guild.iconURL())
                    .setTitle("YOU WON"),
                ],
              })
            );

          case 67:
            playerTurn = true;
            win = false;

          case 69:
            if (win) {
              _context.next = 119;
              break;
            }

            if (!playerTurn) {
              _context.next = 90;
              break;
            }

            _context.next = 73;
            return regeneratorRuntime.awrap(
              message.channel.send({
                content:
                  "What do you want to do?\nType `h` to **hit** or type `s` to **stand**",
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("#000000")
                    .addFields(
                      {
                        name: "**".concat(message.author.username, "**"),
                        value: "Cards - "
                          .concat(
                            playerHand
                              .map(function (card) {
                                return "[`".concat(
                                  card.display,
                                  "`](https://google.com)"
                                );
                              })
                              .join("  "),
                            "\nTotal - `"
                          )
                          .concat(calculate(playerHand), "`"),
                        inline: true,
                      },
                      {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true,
                      },
                      {
                        name: "**The III Project**",
                        value: "Cards - [**`".concat(
                          dealerHand[0].display,
                          "`**](https://google.com/) `?`\nTotal - `?`"
                        ),
                        inline: true,
                      }
                    )
                    .setFooter("K, Q, J = 10  |  A = 1 or 11")
                    .setAuthor({
                      name: "".concat(
                        message.author.username,
                        "'s blackjack game"
                      ),
                      iconURL: message.author.avatarURL(),
                    }),
                ],
              })
            );

          case 73:
            _context.next = 75;
            return regeneratorRuntime.awrap(
              verify(message.channel, message.author, {
                extraYes: hitWords,
                extraNo: standWords,
              })
            );

          case 75:
            hit = _context.sent;

            if (!hit) {
              _context.next = 87;
              break;
            }

            card = draw(message.channel, playerHand);
            total = calculate(playerHand);

            if (!(total > 21)) {
              _context.next = 84;
              break;
            }

            reason = "You Drew "
              .concat(card.display, ", Total Of ")
              .concat(total, "! Bust");
            return _context.abrupt("break", 119);

          case 84:
            if (total === 21) {
              reason = "You Drew ".concat(card.display, " And Hit 21!");
              win = true;
            }

          case 85:
            _context.next = 88;
            break;

          case 87:
            // const dealerTotal = calculate(dealerHand);
            //await message.channel.send(
            //    `**Dealer's Second Card Is ${dealerHand[1].display}, Total Of ${dealerTotal}!**`
            //);
            playerTurn = false;

          case 88:
            _context.next = 117;
            break;

          case 90:
            inital = calculate(dealerHand);
            _card = void 0;
            if (inital < 17) _card = draw(message.channel, dealerHand);
            _total = calculate(dealerHand);

            if (!(_total > 21)) {
              _context.next = 99;
              break;
            }

            reason = "Your opponent busted!";
            win = true;
            _context.next = 117;
            break;

          case 99:
            if (!(_total >= 17)) {
              _context.next = 115;
              break;
            }

            playerTotal = calculate(playerHand);

            if (!(_total === playerTotal)) {
              _context.next = 106;
              break;
            }

            reason = ""
              .concat(
                _card
                  ? "Dealer Drew [**`".concat(
                      _card.display,
                      "`**](https://google.com), Making It "
                    )
                  : ""
              )
              .concat(playerTotal, "-")
              .concat(_total);
            return _context.abrupt("break", 119);

          case 106:
            if (!(_total > playerTotal)) {
              _context.next = 111;
              break;
            }

            reason = ""
              .concat(
                _card
                  ? "Dealer Drew [**`".concat(
                      _card.display,
                      "`**](https://google.com), Making It "
                    )
                  : ""
              )
              .concat(playerTotal, "-`")
              .concat(_total, "`");
            return _context.abrupt("break", 119);

          case 111:
            reason = ""
              .concat(
                _card
                  ? "Dealer Drew [**`".concat(
                      _card.display,
                      "`**](https://google.com), Making It "
                    )
                  : "",
                "`"
              )
              .concat(playerTotal, "`-")
              .concat(_total);
            win = true;

          case 113:
            _context.next = 117;
            break;

          case 115:
            _context.next = 117;
            return regeneratorRuntime.awrap(
              message.channel.send({
                content: "**Dealer Drew [`"
                  .concat(_card.display, "`](https://google.com), Total Of ")
                  .concat(_total, "!**"),
              })
            );

          case 117:
            _context.next = 69;
            break;

          case 119:
            db.add("games_".concat(user.id), 1);
            ops.games["delete"](message.channel.id);

            if (!win) {
              _context.next = 126;
              break;
            }

            db.add("money_".concat(user.id), amount);
            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(
                      "".concat(message.author.username, "'s blackjack game"),
                      message.author.avatarURL()
                    )
                    .setDescription(
                      "**You Win! "
                        .concat(reason, " **\nYou won **\u235F")
                        .concat(advamount, "**. You now have \u235F")
                        .concat(newBal)
                    )
                    .addFields(
                      {
                        name: "**".concat(message.author.username, "**"),
                        value: "Cards - "
                          .concat(
                            playerHand
                              .map(function (card) {
                                return "[`".concat(
                                  card.display,
                                  "`](https://google.com)"
                                );
                              })
                              .join("  "),
                            "\nTotal - `"
                          )
                          .concat(calculate(playerHand), "`"),
                        inline: true,
                      },
                      {
                        name: "**The III Project**",
                        value: "Cards - "
                          .concat(
                            dealerHand
                              .map(function (card) {
                                return "[`".concat(
                                  card.display,
                                  "`](https://google.com)"
                                );
                              })
                              .join("  "),
                            "\nTotal - `"
                          )
                          .concat(calculate(dealerHand), "`"),
                        inline: true,
                      }
                    ),
                ],
              })
            );

          case 126:
            db.subtract("money_".concat(user.id), amount);
            return _context.abrupt(
              "return",
              message.channel.send({
                embeds: [
                  new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(
                      "".concat(message.author.username, "'s blackjack game"),
                      message.author.avatarURL()
                    )
                    .setDescription(
                      "**You Lose! "
                        .concat(reason, " **\nYou lost **\u235F")
                        .concat(advamount, "**. You now have \u235F")
                        .concat(newBal)
                    )
                    .addFields(
                      {
                        name: "**".concat(message.author.username, "**"),
                        value: "Cards - "
                          .concat(
                            playerHand
                              .map(function (card) {
                                return "[`".concat(
                                  card.display,
                                  "`](https://google.com)"
                                );
                              })
                              .join("  "),
                            "\nTotal - `"
                          )
                          .concat(calculate(playerHand), "`"),
                        inline: true,
                      },
                      {
                        name: "**The III Project**",
                        value: "Cards - "
                          .concat(
                            dealerHand
                              .map(function (card) {
                                return "[`".concat(
                                  card.display,
                                  "`](https://google.com)"
                                );
                              })
                              .join("  "),
                            "\nTotal - `"
                          )
                          .concat(calculate(dealerHand), "`"),
                        inline: true,
                      }
                    ),
                ],
              })
            );

          case 128:
            _context.next = 134;
            break;

          case 130:
            _context.prev = 130;
            _context.t0 = _context["catch"](42);
            ops.games["delete"](message.channel.id);
            throw _context.t0;

          case 134:
          case "end":
            return _context.stop();
        }
      }
    },
    null,
    null,
    [[42, 130]]
  );
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
/* */

/* */

/* */

/* */

/* */

/* */

/* */

/* */

/* */

/* */

/* */

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
