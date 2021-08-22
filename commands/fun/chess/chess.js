const commandInfo = {
  primaryName: "chess", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["chess"], // These are all commands that will trigger this command.
  help: "Play chess with someone!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <user> [FEN of game]", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdChess) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription("Command disabled by Administrators.")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Command Disabled"),
      ],
    });
  }
  // const valid = ["301062520679170066", "814623079346470993"]
  // if (!valid.includes(message.author.id))
  // 	return

  if (global.chessList.includes(message.author.id))
    return message.channel.send({
      embeds: [
        RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription("You are already playing chess with someone!")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Chess"),
      ],
    });

  if (!args[0]) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription("You need to specify a user to play chess with!")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Error"),
      ],
    });
  }

  const { Chess } = require("chess.js");
  const chess = new Chess(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const FTI = require("fen-to-image");
  const path = require("path");
  let round = 0;
  let totalResult = "0-0";
  let user =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]) ||
    message.guild.members.cache.find(
      (r) =>
        r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
    ) ||
    message.guild.members.cache.find(
      (r) => r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
    ) ||
    (await message.guild.members.fetch(args[0])) ||
    null;
  if (user == null) {
    m.edit({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription("**Error:** User not found!")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Error"),
      ],
    });
    return;
  }
  if (user.user) {
    user = user.user;
  }
  if (user.id === message.author.id) {
    message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription("You cannot play chess with yourself!")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Error"),
      ],
    });
    return;
  }
  if (global.chessList.includes(user.id)) {
    return message.channel.send({
      embeds: [
        RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setDescription(
            user.username + " is already playing chess with someone!"
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Chess"),
      ],
    });
  }

  message.channel
    .send({
      content: `<@${user.id}>! <@${message.author.id}> is inviting you to a :sparkles: fancy :sparkles: game of chess! Accept invite?`,
    })
    .then(async (m) => {
      try {
        await m.react("✅");
        await m.react("❌");
      } catch (e) {
        console.log("emoji react error");
      }
      // let filter
      // try {
      // 	filter = (reaction, user2) => {
      // 		console.log(reaction.emoji.name)
      // 		return ['✅', '❌'].includes(reaction.emoji.name) && user2.id === user.id;
      // 	};
      // } catch (e) {
      // 	console.log("filter error")
      // }
      let whiteUser;
      let blackUser;
      const filter = (reaction, user2) =>
        ["✅", "❌"].includes(reaction.emoji.name) && user2.id === user.id;
      m.awaitReactions({ filter, max: 1, time: 60000 })
        .then((collected) => {
          if (collected.size === 0) {
            return message.channel.send({
              content:
                user.username +
                " declined your invitation to a fancy game of chess. (Timeout)",
            });
          } else {
            const reaction = collected.first();
            if (reaction.emoji.name === "✅") {
              message.channel
                .send({ content: "Setting up..." })
                .then((m) => {
                  whiteUser = message.author;
                  blackUser = user;
                  global.chessList.push(message.author.id);
                  global.chessList.push(user.id);
                  if (args[1]) {
                    const fen = args.slice(1).join(" ");
                    if (!chess.validate_fen(fen).valid) {
                      return message.channel.send({
                        embeds: [
                          new RM.Discord.MessageEmbed()
                            .setColor("RED")
                            .setAuthor(
                              message.author.tag,
                              message.author.avatarURL()
                            )
                            .setDescription("The provided FEN was invalid.")
                            .setThumbnail(message.guild.iconURL())
                            .setTitle("Error"),
                        ],
                      });
                    } else {
                      message.channel.send({ content: "FEN validated!" });
                      chess.load(fen);
                    }
                  }
                  m.edit({
                    content:
                      "Starting game between " +
                      whiteUser.username +
                      " (as White) and " +
                      blackUser.username +
                      " (as Black)\nFEN: `" +
                      chess.fen() +
                      "`",
                  });
                  round++;
                  continueC(whiteUser, blackUser);
                })
                .catch(console.error);
            } else {
              return message.channel.send({
                embeds: [
                  user.username +
                  " declined your invitation to a fancy game of chess.",
                ],
              });
            }
          }
        })
        .catch(console.error);
    })
    .catch(console.error);
  // cmd stuff here
  async function continueC(whiteUser, blackUser) {
    await FTI({
      fen: chess.fen(), //The FEN of game!
      color: "white", //The color of the side you want to see!
      whiteCheck: false, //If white is in check!
      blackCheck: false, //If black is in check!
      lastMove: false, //The last move that happened so far; d4: where the piece was; d5: where the piece went; put false for not place!
      dirsave: path.join(__dirname, "board.png"), //Where the image will be saved!
    })
      .then(async () => {
        await message.channel
          .send({
            files: [
              {
                attachment: path.join(__dirname, "board.png"),
                name: "board.png",
              },
            ],
          })
          .then(() => {
            setTimeout(() => {
              require("fs").unlinkSync(path.join(__dirname, "board.png"));
            }, 500);
          })
          .catch(console.error);
        message.channel.send({
          content: whiteUser.username + " (White) is starting!",
        });
        chess.header(
          "Event",
          "Casual Game",
          "Site",
          "The III Project",
          "Date",
          new Date().toISOString().split("T")[0].replace(/-/g, "."),
          "Round",
          1,
          "White",
          whiteUser.username,
          "Black",
          blackUser.username,
          "Result",
          totalResult
        );
      })
      .catch(console.error);
    let activeColor;
    let whitecheck = false;
    let blackcheck = false;
    let lastmove = false;
    let engineEnabled = false;
    let engineLevel = 3;
    let engineAutoPlayLevel = 3;
    let engineAutoPlay = "none";
    let engineHelpColors = "both";
    var filter = (m) => [message.author.id, user.id].includes(m.author.id);
    const collector = message.channel.createMessageCollector(filter);
    collector.on("collect", async (messageNext) => {
      try {
        const msg = messageNext.content.split(" ");
        if (msg[0] === "resign") {
          // add 1 to blackUsers win score in the database

          // add 1 to whiteusers loss score in the database
          let result;
          if (messageNext.author == whiteUser) {
            result = "0-1";
          } else {
            result = "1-0";
          }
          let color = messageNext.author == whiteUser ? "white" : "black";
          let opposite = messageNext.author == whiteUser ? "Black" : "White";
          chess.header("Result", result);
          message.channel.send({
            content: color.toUpperCase() + " RESIGNED! " + opposite + " wins!",
          });
          const endFEN = chess.fen();
          const moves = chess.history().length;
          const whoWon = opposite;
          const embed = new RM.Discord.MessageEmbed()
            .setTitle("Chess Stats")
            .setDescription(`${whiteUser.username} vs ${blackUser.username}`)
            .addField("Round", round)
            .addField("Moves", moves)
            .addField("Winner", whoWon)
            .addField("End FEN", endFEN)
            .addField("PGN", chess.pgn({ newline_char: "\n" }));
          message.channel.send({ embeds: [embed] });
          for (var i = 0; i < global.chessList.length; i++) {
            if (global.chessList[i] === message.author.id) {
              global.chessList.splice(i, 1);
              i--;
            }
          }
          for (var i = 0; i < global.chessList.length; i++) {
            if (global.chessList[i] === user.id) {
              global.chessList.splice(i, 1);
              i--;
            }
          }
          return collector.stop();
        }
        const response = messageNext.content.toLowerCase();
        if (response === "fen") {
          message.channel.send({ content: chess.fen() });
        } else if (response === "ascii") {
          message.channel.send({ content: "```" + chess.ascii() + "```" });
        } else if (response === "image") {
          if (chess.fen().split(" ")[1] === "w") {
            activeColor = "white";
          } else {
            activeColor = "black";
          }
          if (chess.in_check()) {
            if (activeColor === "white") {
              whitecheck = true;
            }
            if (activeColor === "black") {
              blackcheck = true;
            }
          } else {
            if (activeColor === "white") {
              whitecheck = false;
            }
            if (activeColor === "black") {
              blackcheck = false;
            }
          }

          await FTI({
            fen: chess.fen(), //The FEN of game!
            color: "white", //The color of the side you want to see!
            whiteCheck: whitecheck, //If white is in check!
            blackCheck: blackcheck, //If black is in check!
            lastMove: lastmove, //The last move that happened so far; d4: where the piece was; d5: where the piece went; put false for not place!
            dirsave: path.join(__dirname, "board.png"), //Where the image will be saved!
          })
            .then(async () => {
              await message.channel
                .send({
                  files: [
                    {
                      attachment: path.join(__dirname, "board.png"),
                      name: "board.png",
                    },
                  ],
                })
                .then(() => {
                  setTimeout(() => {
                    require("fs").unlinkSync(path.join(__dirname, "board.png"));
                  }, 400);
                })
                .catch(console.error);
              whitecheck = false;
              blackcheck = false;
            })
            .catch(console.error);
        } else if (response == "warning") {
          await message.channel.send({
            content:
              ":warning: WARNING: When promoting, supply another argument which can be `n,b,r,q` (Knight, Bishop, Rook, Queen). If another argument is not supplied, queen will automatically be chosen.",
          });
        } else if (response.split(" ")[0] === "move") {
          const moves = messageNext.content.split(" ");
          if (chess.turn() === "w") {
            activeColor = "white";
          } else {
            activeColor = "black";
          }
          if (activeColor === "white") {
            if (whiteUser !== messageNext.author) {
              message.channel.send({ content: "It's not your turn." });
              return;
            }
          }
          if (activeColor === "black") {
            if (blackUser !== messageNext.author) {
              message.channel.send({ content: "It's not your turn." });
              return;
            }
          }
          if (!moves[3]) {
            if (chess.get(moves[1]) === null) {
              message.channel.send({
                content:
                  "Invalid move. (Piece you're trying to move is an empty space)",
              });
              return;
            }
            if (activeColor === "white") {
              if (chess.get(moves[1]).color !== "w") {
                message.channel.send({
                  content:
                    "Invalid move. (Player character doesnt belong to player)",
                });
                return;
              }
            }
            if (activeColor === "black") {
              if (chess.get(moves[1]).color !== "b") {
                message.channel.send({
                  content:
                    "Invalid move. (Player character doesnt belong to player)",
                });
                return;
              }
            }
            if (activeColor === "black" && engineAutoPlay == "black") {
              message.channel.send({
                content: "Telling engine to make a move",
              });
              return run();
            }
            if (activeColor === "white" && engineAutoPlay == "white") {
              message.channel.send({
                content: "Telling engine to make a move",
              });
              return run();
            }
            const success = chess.move({
              from: moves[1],
              to: moves[2],
              promotion: "q",
            });
            if (success == null) {
              return message.channel.send({ content: "Invalid move" });
            }
            lastmove = success.from + success.to;
          } else {
            if (chess.get(moves[1]) === null) {
              message.channel.send({
                content:
                  "Invalid move. (Piece you're trying to move is an empty space)",
              });
              return;
            }
            if (activeColor === "white") {
              if (chess.get(moves[1]).color !== "w") {
                message.channel.send({
                  content:
                    "Invalid move. (Player character doesnt belong to player)",
                });
                return;
              }
            }
            if (activeColor === "black") {
              if (chess.get(moves[1]).color !== "b") {
                message.channel.send({
                  content:
                    "Invalid move. (Player character doesnt belong to player)",
                });
                return;
              }
            }
            if (activeColor === "black" && engineAutoPlay == "black") {
              message.channel.send({
                content: "Telling engine to make a move",
              });
              return run();
            }
            if (activeColor === "white" && engineAutoPlay == "white") {
              message.channel.send({
                content: "Telling engine to make a move",
              });
              return run();
            }
            const success = chess.move({
              from: moves[1],
              to: moves[2],
              promotion: moves[3],
            });
            if (success == null) {
              return message.channel.send({
                content: "Invalid move or invalid promotion.",
              });
            }
            lastmove = success.from + success.to;
          }
          async function autoPlay(from, to) {
            const success = chess.move({
              from: from.toLowerCase(),
              to: to.toLowerCase(),
              promotion: "q",
            });
            if (success == null) {
              return message.channel.send({ content: "Invalid move" });
            }
            lastmove = success.from + success.to;
            rest();
          }
          async function rest() {
            if (chess.turn() === "w") {
              activeColor = "white";
            } else {
              activeColor = "black";
            }
            if (chess.in_check()) {
              if (activeColor === "white") {
                whitecheck = true;
              }
              if (activeColor === "black") {
                blackcheck = true;
              }
            } else {
              whitecheck = false;
              blackcheck = false;
            }
            await FTI({
              fen: chess.fen(), //The FEN of game!
              color: "white", //The color of the side you want to see!
              whiteCheck: whitecheck, //If white is in check!
              blackCheck: blackcheck, //If black is in check!
              lastMove: lastmove, //The last move that happened so far; d4: where the piece was; d5: where the piece went; put false for not place!
              dirsave: path.join(__dirname, "board.png"), //Where the image will be saved!
            })
              .then(async () => {
                if (chess.in_checkmate()) {
                  collector.stop();
                  await message.channel
                    .send({
                      content: ":warning: CHECKMATE :warning:",
                      files: [
                        {
                          attachment: path.join(__dirname, "board.png"),
                          name: "board.png",
                        },
                      ],
                    })
                    .then(() => {
                      setTimeout(() => {
                        require("fs").unlinkSync(
                          path.join(__dirname, "board.png")
                        );
                      }, 400);
                    })
                    .catch(console.error);
                  if (chess.fen().split(" ")[1] === "w") {
                    activeColor = "white";
                  } else {
                    activeColor = "black";
                  }
                  if (activeColor === "white") {
                    message.channel.send({
                      content:
                        "White's king is checkmated! " +
                        blackUser.username +
                        " wins!",
                    });
                  } else {
                    message.channel.send({
                      content:
                        "Black's king is checkmated! " +
                        whiteUser.username +
                        " wins!",
                    });
                  }
                  message.channel
                    .send({
                      embeds: [
                        new RM.Discord.MessageEmbed().setDescription(
                          "Loading stats..."
                        ),
                      ],
                    })
                    .then((m) => {
                      const endFEN = chess.fen();
                      const moves = chess.history().length;
                      const isCheckmate = chess.in_checkmate();
                      let whoWon;
                      if (chess.in_draw()) {
                        whoWon = "draw";
                      } else {
                        whoWon = chess.turn() === "w" ? "black" : "white";
                      }
                      let info = totalResult.split("-");

                      if (whoWon === "white") {
                        if (info[0].includes("½")) {
                          let clone = info[0];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1 + "½";
                          info[0] = clone;
                        } else {
                          info[0] = parseInt(info[0]) + 1;
                        }
                      } else if (whoWon === "black") {
                        if (info[1].includes("½")) {
                          let clone = info[1];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1 + "½";
                          info[1] = clone;
                        } else {
                          info[1] = parseInt(info[1]) + 1;
                        }
                      } else {
                        if (info[0].includes("½")) {
                          let clone = info[0];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1;
                          info[0] = clone;
                        } else {
                          info[0] = parseInt(info[0]) + "½";
                        }
                        if (info[1].includes("½")) {
                          let clone = info[1];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1;
                          info[1] = clone;
                        } else {
                          info[1] = parseInt(info[1]) + "½";
                        }
                        totalResult = info[0] + "-" + info[1];
                      }
                      const isStalemate = chess.in_stalemate();
                      const isDraw = chess.in_draw();
                      const isInsufficientMaterial =
                        chess.insufficient_material();

                      const embed = new RM.Discord.MessageEmbed()
                        .setTitle("Chess Stats")
                        .setDescription(
                          `${whiteUser.username} vs ${blackUser.username}`
                        )
                        .addField("Round", round)
                        .addField("Moves", moves)
                        .addField("End FEN", endFEN)
                        .addField("Checkmate", isCheckmate ? "Yes" : "No")
                        .addField("Stalemate", isStalemate ? "Yes" : "No")
                        .addField("Draw", isDraw ? "Yes" : "No")
                        .addField(
                          "Insufficient Material",
                          isInsufficientMaterial ? "Yes" : "No"
                        )
                        .addField("Winner", whoWon)
                        .addField("PGN", chess.pgn({ newline_char: "\n" }))
                        .setFooter(
                          "Use https://lichess.org/paste to analyze your game!"
                        );
                      m.edit({ embeds: [embed] });

                      for (var i = 0; i < global.chessList.length; i++) {
                        if (global.chessList[i] === message.author.id) {
                          global.chessList.splice(i, 1);
                          i--;
                        }
                      }
                      for (var i = 0; i < global.chessList.length; i++) {
                        if (global.chessList[i] === user.id) {
                          global.chessList.splice(i, 1);
                          i--;
                        }
                      }
                      //offerRematch(message, user)
                    })
                    .catch(console.error);
                } else if (chess.in_check()) {
                  await message.channel
                    .send({
                      content: ":warning: CHECK :warning:",
                      files: [
                        {
                          attachment: path.join(__dirname, "board.png"),
                          name: "board.png",
                        },
                      ],
                    })
                    .then(() => {
                      setTimeout(() => {
                        require("fs").unlinkSync(
                          path.join(__dirname, "board.png")
                        );
                      }, 400);
                      if (chess.fen().split(" ")[1] === "w") {
                        activeColor = "white";
                      } else {
                        activeColor = "black";
                      }
                      if (activeColor === "white") {
                        message.channel.send({
                          content: whiteUser.username + "'s (White) turn!",
                        });
                      } else {
                        message.channel.send({
                          content: blackUser.username + "'s (Black) turn!",
                        });
                      }
                      if (engineEnabled) {
                        message.channel
                          .send({
                            embeds: [
                              new RM.Discord.MessageEmbed()
                                .setTitle("Chess Engine")
                                .setDescription("Calculating the best move..."),
                            ],
                          })
                          .then(async (m) => {
                            const jsChessEngine = require("js-chess-engine");
                            const engine = new jsChessEngine.Game(chess.fen());
                            const bestMove = await engine.aiMove(engineLevel);
                            const color =
                              chess.turn() === "w" ? "WHITE" : "BLACK";
                            for (let i in bestMove) {
                              m.edit({
                                embeds: [
                                  new RM.Discord.MessageEmbed()
                                    .setTitle("Chess Engine")
                                    .setDescription(
                                      "The engine predicted `" +
                                      i +
                                      " -> " +
                                      bestMove[i] +
                                      "` to be the best move for: " +
                                      color
                                    ),
                                ],
                              });
                            }
                          })
                          .catch(console.error);
                      }
                    })
                    .catch(console.error);
                } else if (chess.in_stalemate()) {
                  collector.stop();
                  await message.channel
                    .send({
                      content: ":warning: STALEMATE :warning:",
                      files: [
                        {
                          attachment: path.join(__dirname, "board.png"),
                          name: "board.png",
                        },
                      ],
                    })
                    .then(() => {
                      setTimeout(() => {
                        require("fs").unlinkSync(
                          path.join(__dirname, "board.png")
                        );
                      }, 400);
                    })
                    .catch(console.error);
                  message.channel.send({ content: "Stalemate, no one wins." });
                  message.channel
                    .send({
                      embeds: [
                        new RM.Discord.MessageEmbed().setDescription(
                          "Loading stats..."
                        ),
                      ],
                    })
                    .then((m) => {
                      const endFEN = chess.fen();
                      const moves = chess.history().length;
                      const isCheckmate = chess.in_checkmate();
                      let whoWon;
                      if (chess.in_draw()) {
                        whoWon = "draw";
                      } else {
                        whoWon = chess.turn() === "w" ? "black" : "white";
                      }
                      let info = totalResult.split("-");

                      if (whoWon === "white") {
                        if (info[0].includes("½")) {
                          let clone = info[0];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1 + "½";
                          info[0] = clone;
                        } else {
                          info[0] = parseInt(info[0]) + 1;
                        }
                      } else if (whoWon === "black") {
                        if (info[1].includes("½")) {
                          let clone = info[1];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1 + "½";
                          info[1] = clone;
                        } else {
                          info[1] = parseInt(info[1]) + 1;
                        }
                      } else {
                        if (info[0].includes("½")) {
                          let clone = info[0];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1;
                          info[0] = clone;
                        } else {
                          info[0] = parseInt(info[0]) + "½";
                        }
                        if (info[1].includes("½")) {
                          let clone = info[1];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1;
                          info[1] = clone;
                        } else {
                          info[1] = parseInt(info[1]) + "½";
                        }
                        totalResult = info[0] + "-" + info[1];
                      }
                      const isStalemate = chess.in_stalemate();
                      const isDraw = chess.in_draw();
                      const isInsufficientMaterial =
                        chess.insufficient_material();

                      const embed = new RM.Discord.MessageEmbed()
                        .setTitle("Chess Stats")
                        .setDescription(
                          `${whiteUser.username} vs ${blackUser.username}`
                        )
                        .addField("Round", round)
                        .addField("Moves", moves)
                        .addField("End FEN", endFEN)
                        .addField("Checkmate", isCheckmate ? "Yes" : "No")
                        .addField("Stalemate", isStalemate ? "Yes" : "No")
                        .addField("Draw", isDraw ? "Yes" : "No")
                        .addField(
                          "Insufficient Material",
                          isInsufficientMaterial ? "Yes" : "No"
                        )
                        .addField("Winner", whoWon)
                        .addField("PGN", chess.pgn({ newline_char: "\n" }))
                        .setFooter(
                          "Use https://lichess.org/paste to analyze your game!"
                        );
                      m.edit({ embeds: [embed] });
                      for (var i = 0; i < global.chessList.length; i++) {
                        if (global.chessList[i] === message.author.id) {
                          global.chessList.splice(i, 1);
                          i--;
                        }
                      }
                      for (var i = 0; i < global.chessList.length; i++) {
                        if (global.chessList[i] === user.id) {
                          global.chessList.splice(i, 1);
                          i--;
                        }
                      }
                      //offerRematch(message, user)
                    })
                    .catch(console.error);
                } else if (chess.in_draw()) {
                  collector.stop();
                  await message.channel
                    .send({
                      content: ":warning: DRAW :warning:",
                      files: [
                        {
                          attachment: path.join(__dirname, "board.png"),
                          name: "board.png",
                        },
                      ],
                    })
                    .then(() => {
                      setTimeout(() => {
                        require("fs").unlinkSync(
                          path.join(__dirname, "board.png")
                        );
                      }, 400);
                    })
                    .catch(console.error);
                  message.channel.send({ content: "Draw, no one wins." });
                  message.channel
                    .send({
                      embeds: [
                        new RM.Discord.MessageEmbed().setDescription(
                          "Loading stats..."
                        ),
                      ],
                    })
                    .then((m) => {
                      const endFEN = chess.fen();
                      const moves = chess.history().length;
                      const isCheckmate = chess.in_checkmate();
                      let whoWon;
                      if (chess.in_draw()) {
                        whoWon = "draw";
                      } else {
                        whoWon = chess.turn() === "w" ? "black" : "white";
                      }
                      let info = totalResult.split("-");

                      if (whoWon === "white") {
                        if (info[0].includes("½")) {
                          let clone = info[0];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1 + "½";
                          info[0] = clone;
                        } else {
                          info[0] = parseInt(info[0]) + 1;
                        }
                      } else if (whoWon === "black") {
                        if (info[1].includes("½")) {
                          let clone = info[1];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1 + "½";
                          info[1] = clone;
                        } else {
                          info[1] = parseInt(info[1]) + 1;
                        }
                      } else {
                        if (info[0].includes("½")) {
                          let clone = info[0];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1;
                          info[0] = clone;
                        } else {
                          info[0] = parseInt(info[0]) + "½";
                        }
                        if (info[1].includes("½")) {
                          let clone = info[1];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1;
                          info[1] = clone;
                        } else {
                          info[1] = parseInt(info[1]) + "½";
                        }
                        totalResult = info[0] + "-" + info[1];
                      }
                      const isStalemate = chess.in_stalemate();
                      const isDraw = chess.in_draw();
                      const isInsufficientMaterial =
                        chess.insufficient_material();

                      const embed = new RM.Discord.MessageEmbed()
                        .setTitle("Chess Stats")
                        .setDescription(
                          `${whiteUser.username} vs ${blackUser.username}`
                        )
                        .addField("Round", round)
                        .addField("Moves", moves)
                        .addField("End FEN", endFEN)
                        .addField("Checkmate", isCheckmate ? "Yes" : "No")
                        .addField("Stalemate", isStalemate ? "Yes" : "No")
                        .addField("Draw", isDraw ? "Yes" : "No")
                        .addField(
                          "Insufficient Material",
                          isInsufficientMaterial ? "Yes" : "No"
                        )
                        .addField("Winner", whoWon)
                        .addField("PGN", chess.pgn({ newline_char: "\n" }))
                        .setFooter(
                          "Use https://lichess.org/paste to analyze your game!"
                        );
                      m.edit({ embeds: [embed] });
                      for (var i = 0; i < global.chessList.length; i++) {
                        if (global.chessList[i] === message.author.id) {
                          global.chessList.splice(i, 1);
                          i--;
                        }
                      }
                      for (var i = 0; i < global.chessList.length; i++) {
                        if (global.chessList[i] === user.id) {
                          global.chessList.splice(i, 1);
                          i--;
                        }
                      }
                      //offerRematch(message, user)
                    })
                    .catch(console.error);
                } else if (chess.insufficient_material()) {
                  collector.stop();
                  await message.channel
                    .send({
                      content: ":warning: INSUFFICIENT MATERIAL :warning:",
                      files: [
                        {
                          attachment: path.join(__dirname, "board.png"),
                          name: "board.png",
                        },
                      ],
                    })
                    .then(() => {
                      setTimeout(() => {
                        require("fs").unlinkSync(
                          path.join(__dirname, "board.png")
                        );
                      }, 400);
                    })
                    .catch(console.error);
                  message.channel.send({ content: "Draw, no one wins." });
                  message.channel
                    .send({
                      embeds: [
                        new RM.Discord.MessageEmbed().setDescription(
                          "Loading stats..."
                        ),
                      ],
                    })
                    .then((m) => {
                      const endFEN = chess.fen();
                      const moves = chess.history().length;
                      const isCheckmate = chess.in_checkmate();
                      let whoWon;
                      if (chess.in_draw()) {
                        whoWon = "draw";
                      } else {
                        whoWon = chess.turn() === "w" ? "black" : "white";
                      }
                      let info = totalResult.split("-");

                      if (whoWon === "white") {
                        if (info[0].includes("½")) {
                          let clone = info[0];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1 + "½";
                          info[0] = clone;
                        } else {
                          info[0] = parseInt(info[0]) + 1;
                        }
                      } else if (whoWon === "black") {
                        if (info[1].includes("½")) {
                          let clone = info[1];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1 + "½";
                          info[1] = clone;
                        } else {
                          info[1] = parseInt(info[1]) + 1;
                        }
                      } else {
                        if (info[0].includes("½")) {
                          let clone = info[0];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1;
                          info[0] = clone;
                        } else {
                          info[0] = parseInt(info[0]) + "½";
                        }
                        if (info[1].includes("½")) {
                          let clone = info[1];
                          clone = clone.replace("½", "");
                          clone = parseInt(clone) + 1;
                          info[1] = clone;
                        } else {
                          info[1] = parseInt(info[1]) + "½";
                        }
                        totalResult = info[0] + "-" + info[1];
                      }
                      const isStalemate = chess.in_stalemate();
                      const isDraw = chess.in_draw();
                      const isInsufficientMaterial =
                        chess.insufficient_material();
                      const embed = new RM.Discord.MessageEmbed()
                        .setTitle("Chess Stats")
                        .setDescription(
                          `${whiteUser.username} vs ${blackUser.username}`
                        )
                        .addField("Round", round)
                        .addField("Moves", moves)
                        .addField("End FEN", endFEN)
                        .addField("Checkmate", isCheckmate ? "Yes" : "No")
                        .addField("Stalemate", isStalemate ? "Yes" : "No")
                        .addField("Draw", isDraw ? "Yes" : "No")
                        .addField(
                          "Insufficient Material",
                          isInsufficientMaterial ? "Yes" : "No"
                        )
                        .addField("Winner", whoWon)
                        .addField("PGN", chess.pgn({ newline_char: "\n" }))
                        .setFooter(
                          "Use https://lichess.org/paste to analyze your game!"
                        );
                      m.edit({ embeds: [embed] });
                      for (var i = 0; i < global.chessList.length; i++) {
                        if (global.chessList[i] === message.author.id) {
                          global.chessList.splice(i, 1);
                          i--;
                        }
                      }
                      for (var i = 0; i < global.chessList.length; i++) {
                        if (global.chessList[i] === user.id) {
                          global.chessList.splice(i, 1);
                          i--;
                        }
                      }
                      // offerRematch(message, user)
                    })
                    .catch(console.error);
                } else {
                  let color;
                  let username;
                  if (chess.fen().split(" ")[1] === "w") {
                    activeColor = "white";
                  } else {
                    activeColor = "black";
                  }
                  if (activeColor === "white") {
                    color = "White";
                    username = whiteUser.username;
                  } else {
                    color = "Black";
                    username = blackUser.username;
                  }
                  message.channel
                    .send({
                      content: username + "'s (" + color + ") turn!",
                      files: [
                        {
                          attachment: path.join(__dirname, "board.png"),
                          name: "board.png",
                        },
                      ],
                    })
                    .then(async () => {
                      setTimeout(() => {
                        require("fs").unlinkSync(
                          path.join(__dirname, "board.png")
                        );
                      }, 400);

                      if (engineEnabled) {
                        run();
                      }
                    })
                    .catch(console.error);
                }
              })
              .catch(console.error);
          }
          rest();
          async function run() {
            const jsChessEngine = require("js-chess-engine");
            const engine = new jsChessEngine.Game(chess.fen());
            const color = chess.turn() === "w" ? "WHITE" : "BLACK";
            let bestMove = undefined;

            if (engineAutoPlay === "white" && color.toLowerCase() === "white") {
              message.channel.send({
                content: "Engine playing for WHITE is thinking...",
              });
              bestMove = await engine.aiMove(engineAutoPlayLevel);
            } else if (
              engineAutoPlay === "black" &&
              color.toLowerCase() === "black"
            ) {
              message.channel.send({
                content: "Engine playing for BLACK is thinking...",
              });
              bestMove = await engine.aiMove(engineAutoPlayLevel);
            }

            if (
              (engineHelpColors === "white" &&
                color.toLowerCase() === "white") ||
              (engineHelpColors === "black" && color.toLowerCase() === "black")
            ) {
              message.channel
                .send({
                  embeds: [
                    new RM.Discord.MessageEmbed()
                      .setTitle("Chess Engine")
                      .setDescription(
                        "Calculating the best move... (May take a bit of time)"
                      ),
                  ],
                })
                .then(async (m) => {
                  bestMove = await engine.aiMove(engineLevel);

                  for (let i in bestMove) {
                    return m.edit({
                      embeds: [
                        new RM.Discord.MessageEmbed()
                          .setTitle("Chess Engine")
                          .setDescription(
                            "The engine predicted `" +
                            i +
                            " -> " +
                            bestMove[i] +
                            "` to be the best move for: " +
                            color
                          ),
                      ],
                    });
                  }
                })
                .catch(console.error);
            } else if (engineHelpColors === "both") {
              message.channel
                .send({
                  embeds: [
                    new RM.Discord.MessageEmbed()
                      .setTitle("Chess Engine")
                      .setDescription("Calculating the best move..."),
                  ],
                })
                .then(async (m) => {
                  bestMove = await engine.aiMove(engineLevel);
                  for (let i in bestMove) {
                    return m.edit({
                      embeds: [
                        new RM.Discord.MessageEmbed()
                          .setTitle("Chess Engine")
                          .setDescription(
                            "The engine predicted `" +
                            i +
                            " -> " +
                            bestMove[i] +
                            "` to be the best move for: " +
                            color
                          ),
                      ],
                    });
                  }
                })
                .catch(console.error);
            }
            for (let i in bestMove) {
              if (
                engineAutoPlay === "white" &&
                color.toLowerCase() === "white"
              ) {
                autoPlay(i, bestMove[i]);
              }
              if (
                engineAutoPlay === "black" &&
                color.toLowerCase() === "black"
              ) {
                autoPlay(i, bestMove[i]);
              }
            }
          }
        } else if (response === "history") {
          let history = "";
          if (chess.history({ verbose: true }).length < 1) {
            history = "No history found.";
          } else {
            for (let i in chess.history({ verbose: true })) {
              history +=
                JSON.stringify(chess.history({ verbose: true })[i]) + "\n";
            }
            history +=
              "\n\n=====================\nFlags:\n" +
              "'n' - a non - capture\n" +
              "'b' - a pawn push of two squares\n" +
              "'e' - an en passant capture\n" +
              "'c' - a standard capture\n" +
              "'p' - a promotion\n" +
              "'k' - kingside castling\n" +
              "'q' - queenside castling";
          }
          message.channel.send({ content: "```json\n" + history + "```" });
        } else if (response.split(" ")[0] === "settings") {
          const settings = new RM.Discord.MessageEmbed()
            .setTitle("Chess Game Settings")
            .setDescription("Change the game settings such as the engine")
            .addField("♟️ Chess Engine", "Engine Settings. ID: `engine`", true)
            .setAuthor(
              messageNext.author.username,
              messageNext.author.avatarURL()
            )
            .setFooter("Type the option you want to change.");
          message.channel.send({ embeds: [settings] });
          var filter = (m) =>
            [message.author.id, user.id].includes(m.author.id);
          message.channel
            .awaitMessages({ filter, max: 1, time: 30000 })
            .then((messageOther) => {
              if (messageOther.size < 1) {
                return;
              }
              messageOther = messageOther.first();
              const response = messageOther.content.toLowerCase();
              if (response === "engine") {
                const embed = new RM.Discord.MessageEmbed()
                  .setTitle("Chess Engine Settings")
                  .addField(
                    "Enabled",
                    "Current Status: " + engineEnabled + ". ID: `enabled`"
                  )
                  .addField(
                    "Help Level 0-4",
                    "Current Level: " + engineLevel + ". ID: `level`"
                  )
                  .addField(
                    "Auto-Play (none/black/white)",
                    "Current Setting: " + engineAutoPlay + ". ID: `autoplay`"
                  )
                  .addField(
                    "Auto-Play Level 0-4",
                    "Current Level: " +
                    engineAutoPlayLevel +
                    ". ID: `autoplaylevel`"
                  )
                  .addField(
                    "Help Colors (none/white/black/both)",
                    "Current Status: " + engineHelpColors + ". ID: `helpcolors`"
                  )
                  .setFooter("Select one of the ids and their new value");
                message.channel.send({ embeds: [embed] });
                var filter = (m) =>
                  [message.author.id, user.id].includes(m.author.id);
                message.channel
                  .awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                  })
                  .then((messageOther2) => {
                    if (messageOther2.size < 1) {
                      return;
                    }
                    messageOther2 = messageOther2.first();
                    let response = messageOther2.content.toLowerCase();
                    response = response.split(",");
                    for (let i in response) {
                      const wanted = response[i].trimEnd().trimStart();
                      const name = wanted.split(" ")[0];
                      const value = wanted.split(" ")[1];
                      if (name === "enabled") {
                        if (!value) {
                          return message.channel.send({
                            content:
                              "You need to specify a boolean for this value! (true/false)",
                          });
                        }
                        if (typeof Boolean(value) !== "boolean") {
                          return message.channel.send({
                            content:
                              "You need to specify a boolean for this value! (true/false)",
                          });
                        }
                        if (Boolean(value) === engineEnabled) {
                          return message.channel.send({
                            content:
                              "The engine is already set to: " + engineEnabled,
                          });
                        }
                        if (Boolean(value) === true) {
                          engineEnabled = true;
                          message.channel.send({
                            content: "The engine is now enabled!",
                          });
                        } else {
                          engineEnabled = false;
                          message.channel.send({
                            content: "The engine is now disabled!",
                          });
                        }
                      } else if (name === "level") {
                        if (!value) {
                          return message.channel.send({
                            content:
                              "You need to specify a number for this value! (0-4)",
                          });
                        }
                        if (typeof Number(value) !== "number") {
                          return message.channel.send({
                            content:
                              "You need to specify a number for this value! (0-4)",
                          });
                        }
                        if (Number(value) === engineLevel) {
                          return message.channel.send({
                            content:
                              "The engine is already set to: " + engineLevel,
                          });
                        }
                        if (Number(value) >= 0 && Number(value) <= 4) {
                          engineLevel = Number(value);
                          message.channel.send({
                            content:
                              "The engine is now set to level: " + engineLevel,
                          });
                        } else {
                          return message.channel.send({
                            content: "Invalid number!",
                          });
                        }
                      } else if (name === "autoplay") {
                        if (
                          value !== "none" &&
                          value !== "black" &&
                          value !== "white"
                        ) {
                          return message.channel.send({
                            content: "Invalid value! (none/black/white)",
                          });
                        }
                        if (engineAutoPlay === value) {
                          return message.channel.send({
                            content:
                              "AutoPlay is already set to: " + engineAutoPlay,
                          });
                        }
                        if (value === "none") {
                          engineAutoPlay = "none";
                          message.channel.send({
                            content: "The engine will not AutoPlay. (none)",
                          });
                        }
                        if (value === "black") {
                          engineAutoPlay = "black";
                          message.channel.send(
                            "The engine will now AutoPlay for: " +
                            engineAutoPlay.toUpperCase()
                          );
                        }
                        if (value === "white") {
                          engineAutoPlay = "white";
                          message.channel.send({
                            content:
                              "The engine will now AutoPlay for: " +
                              engineAutoPlay.toUpperCase(),
                          });
                        }
                      } else if (name === "autoplaylevel") {
                        if (!value) {
                          return message.channel.send({
                            content:
                              "You need to specify a number for this value! (0-4)",
                          });
                        }
                        if (typeof Number(value) !== "number") {
                          return message.channel.send({
                            content:
                              "You need to specify a number for this value! (0-4)",
                          });
                        }
                        if (Number(value) === engineAutoPlayLevel) {
                          return message.channel.send({
                            content:
                              "The engine is already set to: " +
                              engineAutoPlayLevel,
                          });
                        }
                        if (Number(value) >= 0 && Number(value) <= 4) {
                          engineAutoPlayLevel = Number(value);
                          message.channel.send({
                            content:
                              "The engine will now AutoPlay with level: " +
                              engineAutoPlayLevel,
                          });
                        } else {
                          return message.channel.send({
                            content: "Invalid number!",
                          });
                        }
                      } else if (name === "helpcolors") {
                        if (
                          value !== "none" &&
                          value !== "black" &&
                          value !== "white" &&
                          value !== "both"
                        ) {
                          return message.channel.send({
                            content: "Invalid value! (none/black/white/both)",
                          });
                        }
                        if (engineHelpColors === value) {
                          return message.channel.send({
                            content:
                              "HelpColors is already set to: " +
                              engineHelpColors,
                          });
                        }
                        if (value === "none") {
                          engineHelpColors = "none";
                          message.channel.send({
                            content:
                              "The engine will not help any colors. (none)",
                          });
                        } else if (value === "black") {
                          engineHelpColors = "black";
                          message.channel.send({
                            content: "The engine will now help black. (black)",
                          });
                        } else if (value === "white") {
                          engineHelpColors = "white";
                          message.channel.send({
                            content: "The engine will now help white. (white)",
                          });
                        } else if (value === "both") {
                          engineHelpColors = "both";
                          message.channel.send({
                            content:
                              "The engine will now help both colors. (both)",
                          });
                        }
                      }
                    }
                  })
                  .catch(console.error);
              } else if (response === "exit") {
                message.channel.send({ content: "Exiting settings" });
              }
            })
            .catch(console.error);
        } else if (response.split(" ")[0] === "predict") {
          if (!engineEnabled) {
            return message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed().setDescription(
                  "The engine is currently disabled."
                ),
              ],
            });
          }
          const jsChessEngine = require("js-chess-engine");
          const engine = new jsChessEngine.Game(chess.fen());
          const color = chess.turn() === "w" ? "WHITE" : "BLACK";
          let bestMove;

          if (
            (engineHelpColors === "white" && color.toLowerCase() === "white") ||
            (engineHelpColors === "black" && color.toLowerCase() === "black") ||
            engineHelpColors === "both"
          ) {
            message.channel
              .send({
                embeds: [
                  new RM.Discord.MessageEmbed()
                    .setTitle("Chess Engine")
                    .setDescription(
                      "Calculating the best move... (May take a bit of time)"
                    ),
                ],
              })
              .then(async (m) => {
                bestMove = await engine.aiMove(engineLevel);

                for (let i in bestMove) {
                  return m.edit({
                    embeds: [
                      new RM.Discord.MessageEmbed()
                        .setTitle("Chess Engine")
                        .setDescription(
                          "The engine predicted `" +
                          i +
                          " -> " +
                          bestMove[i] +
                          "` to be the best move for: " +
                          color
                        ),
                    ],
                  });
                }
              })
              .catch(console.error);
          } else {
            return message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setTitle("Chess Engine")
                  .setDescription(
                    "The engine will not help your color. Change that in the settings to get results."
                  ),
              ],
            });
          }
        } else if (response.split(" ")[0] === "pgn") {
          message.channel.send({ content: "```\n" + chess.pgn() + "```" });
        }
      } catch (e) {
        return message.channel.send({ content: "Error: " + e.message });
      }
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
