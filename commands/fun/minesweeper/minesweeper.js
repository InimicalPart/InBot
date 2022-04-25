/**
 *
 *  Written by InimicalPart
 *
 *  Discord: InimicalPart ©#4542
 *  GitHub: https://www.github.com/InimicalPart
 *
 *  Copyright © 2022 InimicalPart
 *
 **/

const commandInfo = {
  primaryName: "minesweeper", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["minesweeper", "ms"], // These are all commands that will trigger this command.
  help: "Play minesweeper!", // This is the general description of the command.
  aliases: ["ms"], // These are command aliases that help.js will use
  usage: "[COMMAND] <size:bombs>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdMinesweeper) {
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
  if (global.mineSweeperList.includes(message.author.id)) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("You are already playing a game of minesweeper!")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Already Playing"),
      ],
    });
  }
  const { Board } = require("minesweeper-board");
  let size = 10;
  let bombs = 20;
  if (args[0]) {
    const sizebombs = args[0].split(":");
    if (!Number.isNaN(parseInt(sizebombs[0]))) {
      if (parseInt(sizebombs[0]) > 18 || parseInt(sizebombs[0]) < 7) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Size must be between 7 and 18")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Size Error"),
          ],
        });
      } else {
        size = parseInt(sizebombs[0]);
      }
    } else {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("Invalid size")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Invalid Size"),
        ],
      });
    }
    if (!Number.isNaN(parseInt(sizebombs[1]))) {
      if (parseInt(sizebombs[1]) >= size * size) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid bombs")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Bombs"),
          ],
        });
      } else if (
        parseInt(sizebombs[1]) < 10 ||
        calcPercent(75, parseInt(size * size)) < parseInt(sizebombs[1])
      ) {
        return message.channel.send(
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              "Invalid bombs. Must be between 10-" +
                calcPercent(75, parseInt(size * size)) +
                " for size: " +
                size +
                "x" +
                size
            )
            .setThumbnail(message.guild.iconURL())
            .setTitle("Invalid Bombs")
        );
      }
      bombs = parseInt(sizebombs[1]);
    } else {
      return message.channel.send(
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("Invalid bomb amount")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid bomb amount")
      );
    }
  }
  const gameTime = new Date().getTime();
  global.mineSweeperList.push(message.author.id);
  let board = new Board(size, bombs);
  let bombsLeft = bombs;
  let boardInteracted = false;
  let textBoard = [];
  let revealedBoard = [];
  let flagBoard = [];
  for (let row in board.board) {
    textBoard[row] = [];
    revealedBoard[row] = [];
    flagBoard[row] = [];
    for (let col in board.board[row]) {
      if (board.board[row][col].hasMine === true) {
        textBoard[row].push("x");
      } else {
        textBoard[row].push(".");
      }
      revealedBoard[row].push(false);
      flagBoard[row].push(".");
    }
  }

  newTextBoard = [];
  for (let row in textBoard) {
    newTextBoard[row] = [];
    for (let col in textBoard[row]) {
      if (textBoard[row][col] !== "x") {
        let neighbors = surroundings(textBoard, col, row);
        let neighborCount = 0;
        if (neighbors.up.type !== null && neighbors.up.type === "x") {
          neighborCount++;
        }
        if (neighbors.upRight.type !== null && neighbors.upRight.type === "x") {
          neighborCount++;
        }
        if (neighbors.right.type !== null && neighbors.right.type === "x") {
          neighborCount++;
        }
        if (
          neighbors.downRight.type !== null &&
          neighbors.downRight.type === "x"
        ) {
          neighborCount++;
        }
        if (neighbors.down.type !== null && neighbors.down.type === "x") {
          neighborCount++;
        }
        if (
          neighbors.downLeft.type !== null &&
          neighbors.downLeft.type === "x"
        ) {
          neighborCount++;
        }
        if (neighbors.left.type !== null && neighbors.left.type === "x") {
          neighborCount++;
        }
        if (neighbors.upLeft.type !== null && neighbors.upLeft.type === "x") {
          neighborCount++;
        }
        newTextBoard[row].push(neighborCount);
      } else {
        newTextBoard[row].push(textBoard[row][col]);
      }
    }
  }
  textBoard = newTextBoard;

  //console.log(textBoard);
  const boardToShow = [];
  for (let row in textBoard) {
    boardToShow[row] = [];
    for (let col in textBoard[row]) {
      if (revealedBoard[row][col] === true) {
        boardToShow[row].push(textBoard[row][col]);
      } else if (flagBoard[row][col] === "F") {
        boardToShow[row].push("F");
      } else {
        boardToShow[row].push(".");
      }
    }
  }
  const timetaken = new Date().getTime() - gameTime;
  message.channel.send({
    content:
      "Time: `" +
      RM.pretty_ms(timetaken) +
      "`. Bombs left: " +
      bombsLeft +
      " ```js\n" +
      renderBoard(boardToShow) +
      "```",
  });

  var filter = (m) => [message.author.id].includes(m.author.id);
  let uncoverZeroAuto = false;
  const collector = message.channel.createMessageCollector(filter);
  collector.on("collect", async (messageNext) => {
    const msg = messageNext.content.toLowerCase().split(" ");
    if (msg[0] === "r" || msg[0] === "reveal") {
      if (!msg[1]) {
        return message.channel.send({
          content: "You need to enter the position!",
        });
      }
      let positions = msg[1].split(":");
      let x = positions[0];
      let y = positions[1];
      let xnum = convertToNum(x);
      let ynum = convertToNum(y);
      function reveal(x, y) {
        if (!msg[1]) {
          return message.channel.send({
            content: "You need to enter the position!",
          });
        }
        positions = msg[1].split(":");
        x = positions[0];
        y = positions[1];
        xnum = convertToNum(x);
        ynum = convertToNum(y);
        if (revealedBoard[xnum - 1][ynum - 1] === true) {
          return message.channel.send({
            content: "You have already revealed this space!",
          });
        }
        if (flagBoard[xnum - 1][ynum - 1] === "F") {
          return message.channel.send({
            content: "You cannot reveal a flagged space!",
          });
        }
        if (
          textBoard[xnum - 1][ynum - 1] === "x" &&
          boardInteracted === false
        ) {
          board = new Board(size, bombs);
          boardInteracted = false;
          bombsLeft = bombs;
          textBoard = [];
          revealedBoard = [];
          flagBoard = [];
          for (let row in board.board) {
            textBoard[row] = [];
            revealedBoard[row] = [];
            flagBoard[row] = [];
            for (let col in board.board[row]) {
              if (board.board[row][col].hasMine === true) {
                textBoard[row].push("x");
              } else {
                textBoard[row].push(".");
              }
              revealedBoard[row].push(false);
              flagBoard[row].push(".");
            }
          }

          newTextBoard = [];
          for (let row in textBoard) {
            newTextBoard[row] = [];
            for (let col in textBoard[row]) {
              if (textBoard[row][col] !== "x") {
                let neighbors = surroundings(textBoard, col, row);
                let neighborCount = 0;
                if (neighbors.up.type !== null && neighbors.up.type === "x") {
                  neighborCount++;
                }
                if (
                  neighbors.upRight.type !== null &&
                  neighbors.upRight.type === "x"
                ) {
                  neighborCount++;
                }
                if (
                  neighbors.right.type !== null &&
                  neighbors.right.type === "x"
                ) {
                  neighborCount++;
                }
                if (
                  neighbors.downRight.type !== null &&
                  neighbors.downRight.type === "x"
                ) {
                  neighborCount++;
                }
                if (
                  neighbors.down.type !== null &&
                  neighbors.down.type === "x"
                ) {
                  neighborCount++;
                }
                if (
                  neighbors.downLeft.type !== null &&
                  neighbors.downLeft.type === "x"
                ) {
                  neighborCount++;
                }
                if (
                  neighbors.left.type !== null &&
                  neighbors.left.type === "x"
                ) {
                  neighborCount++;
                }
                if (
                  neighbors.upLeft.type !== null &&
                  neighbors.upLeft.type === "x"
                ) {
                  neighborCount++;
                }
                newTextBoard[row].push(neighborCount);
              } else {
                newTextBoard[row].push(textBoard[row][col]);
              }
            }
          }
          textBoard = newTextBoard;

          reveal(xnum, ynum);
          return;
        }
        boardInteracted = true;

        if (textBoard[xnum - 1][ynum - 1] === "x" && boardInteracted === true) {
          // game over
          collector.stop();
          const time = new Date().getTime() - gameTime;
          for (var i = 0; i < global.mineSweeperList.length; i++) {
            if (global.mineSweeperList[i] === message.author.id) {
              global.mineSweeperList.splice(i, 1);
              i--;
            }
          }
          return message.channel.send({
            content:
              "You lost! You hit a mine. Time: " +
              RM.pretty_ms(time) +
              " ```js\n" +
              renderBoard(textBoard) +
              "```",
          });
        }

        if (textBoard[xnum - 1][ynum - 1] === 0) {
          revealedBoard[xnum - 1][ynum - 1] = true;
          const around = surroundings(textBoard, ynum - 1, xnum - 1);
          const autoReveal = [];
          if (
            around.up.type !== null &&
            revealedBoard[around.up.x][around.up.y] === false
          ) {
            autoReveal.push(around.up.x + ":" + around.up.y);
          }
          if (
            around.upRight.type !== null &&
            revealedBoard[around.upRight.x][around.upRight.y] === false
          ) {
            autoReveal.push(around.upRight.x + ":" + around.upRight.y);
          }
          if (
            around.right.type !== null &&
            revealedBoard[around.right.x][around.right.y] === false
          ) {
            autoReveal.push(around.right.x + ":" + around.right.y);
          }
          if (
            around.downRight.type !== null &&
            revealedBoard[around.downRight.x][around.downRight.y] === false
          ) {
            autoReveal.push(around.downRight.x + ":" + around.downRight.y);
          }
          if (
            around.down.type !== null &&
            revealedBoard[around.down.x][around.down.y] === false
          ) {
            autoReveal.push(around.down.x + ":" + around.down.y);
          }
          if (
            around.downLeft.type !== null &&
            revealedBoard[around.downLeft.x][around.downLeft.y] === false
          ) {
            autoReveal.push(around.downLeft.x + ":" + around.downLeft.y);
          }
          if (
            around.left.type !== null &&
            revealedBoard[around.left.x][around.left.y] === false
          ) {
            autoReveal.push(around.left.x + ":" + around.left.y);
          }
          if (
            around.upLeft.type !== null &&
            revealedBoard[around.upLeft.x][around.upLeft.y] === false
          ) {
            autoReveal.push(around.upLeft.x + ":" + around.upLeft.y);
          }
          if (autoReveal.length > 0) {
            const movesA = [];
            for (let i in autoReveal) {
              let item = autoReveal[i].split(":");
              movesA.push(
                numToSSColumn(parseInt(item[0]) + 1) +
                  ":" +
                  numToSSColumn(parseInt(item[1]) + 1)
              );
            }

            message.channel.send({
              content:
                "`" +
                numToSSColumn(xnum) +
                ":" +
                numToSSColumn(ynum) +
                "` is a `0`, Do you want to automatically uncover: `" +
                movesA.join(", ") +
                "`? yes/y/no/n",
            });
            message.channel
              .awaitMessages({ filter: filter, max: 1 })
              .then((messageNext2) => {
                const msg2 = messageNext2
                  .first()
                  .content.toLowerCase()
                  .split(" ");
                if (msg2[0] === "yes" || msg2[0] === "y") {
                  for (let i in autoReveal) {
                    let positions = autoReveal[i].split(":");
                    let x = positions[0];
                    let xnum = parseInt(x);
                    let y = positions[1];
                    let ynum = parseInt(y);
                    revealedBoard[xnum][ynum] = true;
                  }
                  message.channel.send({
                    content: "Revealed: `" + movesA.join(", ") + "`",
                  });
                  const boardToShow = [];
                  for (let row in textBoard) {
                    boardToShow[row] = [];
                    for (let col in textBoard[row]) {
                      if (revealedBoard[row][col] === true) {
                        boardToShow[row].push(textBoard[row][col]);
                      } else if (flagBoard[row][col] === "F") {
                        boardToShow[row].push("F");
                      } else {
                        boardToShow[row].push(".");
                      }
                    }
                  }
                  const timetaken = new Date().getTime() - gameTime;
                  message.channel.send({
                    content:
                      "Bombs left: " +
                      bombsLeft +
                      " ```js\n" +
                      renderBoard(boardToShow) +
                      "```",
                  });
                } else if (msg2[0] === "no" || msg2[0] === "n") {
                  message.channel.send({ content: "Ok, not revealed!" });
                  const boardToShow = [];
                  for (let row in textBoard) {
                    boardToShow[row] = [];
                    for (let col in textBoard[row]) {
                      if (revealedBoard[row][col] === true) {
                        boardToShow[row].push(textBoard[row][col]);
                      } else if (flagBoard[row][col] === "F") {
                        boardToShow[row].push("F");
                      } else {
                        boardToShow[row].push(".");
                      }
                    }
                  }
                  const timetaken = new Date().getTime() - gameTime;
                  message.channel.send({
                    content:
                      "Bombs left: " +
                      bombsLeft +
                      " ```js\n" +
                      renderBoard(boardToShow) +
                      "```",
                  });
                }
              })
              .catch(console.error);
          }
        } else {
          revealedBoard[xnum - 1][ynum - 1] = true;
          const boardToShow = [];
          for (let row in textBoard) {
            boardToShow[row] = [];
            for (let col in textBoard[row]) {
              if (revealedBoard[row][col] === true) {
                boardToShow[row].push(textBoard[row][col]);
              } else if (flagBoard[row][col] === "F") {
                boardToShow[row].push("F");
              } else {
                boardToShow[row].push(".");
              }
            }
          }
          const timetaken = new Date().getTime() - gameTime;
          message.channel.send({
            content:
              "Time: `" +
              RM.pretty_ms(timetaken) +
              "`, Bombs left: " +
              bombsLeft +
              " ```js\n" +
              renderBoard(boardToShow) +
              "```",
          });
        }
      }
      reveal(xnum, ynum);
    } else if (msg[0] === "f" || msg[0] === "flag") {
      if (!msg[1]) {
        return message.channel.send({
          content: "You need to enter the position!",
        });
      }
      const positions = msg[1].split(":");
      const x = positions[0];
      const y = positions[1];
      const xnum = convertToNum(x);
      const ynum = convertToNum(y);
      if (revealedBoard[xnum - 1][ynum - 1] === true) {
        return message.channel.send({
          content: "You cannot flag a space that you have already revealed!",
        });
      }
      if (flagBoard[xnum - 1][ynum - 1] === "F") {
        flagBoard[xnum - 1][ynum - 1] = textBoard[xnum - 1][ynum - 1];
        bombsLeft++;
      } else {
        if (bombsLeft === 0) {
          return message.channel.send({
            content: "There have no more flags available!",
          });
        }
        bombsLeft--;
        flagBoard[xnum - 1][ynum - 1] = "F";
      }
      let bombPlaces = [];
      let flagPlaces = [];
      for (let row in textBoard) {
        for (let col in textBoard[row]) {
          if (textBoard[row][col] === "x") {
            bombPlaces.push(row + ":" + col);
          }
        }
      }
      for (let row in flagBoard) {
        for (let col in flagBoard[row]) {
          if (flagBoard[row][col] === "F") {
            flagPlaces.push(row + ":" + col);
          }
        }
      }
      if (bombPlaces.every((elem) => flagPlaces.includes(elem))) {
        collector.stop();
        const timetaken = new Date().getTime() - gameTime;
        message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setTitle("You won!")
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.avatarURL,
              })
              .setDescription(
                "You beat minesweeper in: `" + RM.pretty_ms(timetaken) + "`"
              )
              .setColor("GREEN"),
          ],
        });
        for (var i = 0; i < global.mineSweeperList.length; i++) {
          if (global.mineSweeperList[i] === message.author.id) {
            global.mineSweeperList.splice(i, 1);
            i--;
          }
        }
        return;
      }

      const boardToShow = [];
      for (let row in textBoard) {
        boardToShow[row] = [];
        for (let col in textBoard[row]) {
          if (revealedBoard[row][col] === true) {
            boardToShow[row].push(textBoard[row][col]);
          } else if (flagBoard[row][col] === "F") {
            boardToShow[row].push("F");
          } else {
            boardToShow[row].push(".");
          }
        }
      }
      const timetaken = new Date().getTime() - gameTime;
      message.channel.send({
        content:
          "Time: `" +
          RM.pretty_ms(timetaken) +
          "`, Bombs left: " +
          bombsLeft +
          " ```js\n" +
          renderBoard(boardToShow) +
          "```",
      });
    } else if (msg[0] === "board") {
      const boardToShow = [];
      for (let row in textBoard) {
        boardToShow[row] = [];
        for (let col in textBoard[row]) {
          if (revealedBoard[row][col] === true) {
            boardToShow[row].push(textBoard[row][col]);
          } else if (flagBoard[row][col] === "F") {
            boardToShow[row].push("F");
          } else {
            boardToShow[row].push(".");
          }
        }
      }
      const timetaken = new Date().getTime() - gameTime;
      message.channel.send({
        content:
          "Time: `" +
          RM.pretty_ms(timetaken) +
          "`, Bombs left: " +
          bombsLeft +
          " ```js\n" +
          renderBoard(boardToShow) +
          "```",
      });
    } else if (msg[0] === "clear0s" || msg[0] === "c0") {
      if (!msg[1]) {
        return message.channel.send({
          content: "You need to enter the position!",
        });
      }
      const positions = msg[1].split(":");
      const x = positions[0];
      const y = positions[1];
      const xnum = convertToNum(x);
      const ynum = convertToNum(y);
      if (getCell(textBoard, xnum - 1, ynum - 1) !== 0) {
        return message.channel.send({ content: "Selected space is not a 0!" });
      }
      const around = surroundings(textBoard, ynum - 1, xnum - 1);
      const autoReveal = [];
      if (
        around.up.type !== null &&
        revealedBoard[around.up.x][around.up.y] === false
      ) {
        autoReveal.push(around.up.x + ":" + around.up.y);
      }
      if (
        around.upRight.type !== null &&
        revealedBoard[around.upRight.x][around.upRight.y] === false
      ) {
        autoReveal.push(around.upRight.x + ":" + around.upRight.y);
      }
      if (
        around.right.type !== null &&
        revealedBoard[around.right.x][around.right.y] === false
      ) {
        autoReveal.push(around.right.x + ":" + around.right.y);
      }
      if (
        around.downRight.type !== null &&
        revealedBoard[around.downRight.x][around.downRight.y] === false
      ) {
        autoReveal.push(around.downRight.x + ":" + around.downRight.y);
      }
      if (
        around.down.type !== null &&
        revealedBoard[around.down.x][around.down.y] === false
      ) {
        autoReveal.push(around.down.x + ":" + around.down.y);
      }
      if (
        around.downLeft.type !== null &&
        revealedBoard[around.downLeft.x][around.downLeft.y] === false
      ) {
        autoReveal.push(around.downLeft.x + ":" + around.downLeft.y);
      }
      if (
        around.left.type !== null &&
        revealedBoard[around.left.x][around.left.y] === false
      ) {
        autoReveal.push(around.left.x + ":" + around.left.y);
      }
      if (
        around.upLeft.type !== null &&
        revealedBoard[around.upLeft.x][around.upLeft.y] === false
      ) {
        autoReveal.push(around.upLeft.x + ":" + around.upLeft.y);
      }
      if (autoReveal.length > 0) {
        const movesA = [];
        for (let i in autoReveal) {
          let item = autoReveal[i].split(":");
          movesA.push(
            numToSSColumn(parseInt(item[0]) + 1) +
              ":" +
              numToSSColumn(parseInt(item[1]) + 1)
          );
        }
        for (let i in autoReveal) {
          let positions = autoReveal[i].split(":");
          let x = positions[0];
          let xnum = parseInt(x);
          let y = positions[1];
          let ynum = parseInt(y);
          revealedBoard[xnum][ynum] = true;
        }
        message.channel.send({
          content: "Revealed: `" + movesA.join(", ") + "`",
        });
        const boardToShow = [];
        for (let row in textBoard) {
          boardToShow[row] = [];
          for (let col in textBoard[row]) {
            if (revealedBoard[row][col] === true) {
              boardToShow[row].push(textBoard[row][col]);
            } else if (flagBoard[row][col] === "F") {
              boardToShow[row].push("F");
            } else {
              boardToShow[row].push(".");
            }
          }
        }

        const timetaken = new Date().getTime() - gameTime;
        message.channel.send({
          content:
            "Bombs left: " +
            bombsLeft +
            " ```js\n" +
            renderBoard(boardToShow) +
            "```",
        });
      }
    } else if (msg[0] === "stop" || msg[0] === "end") {
      // end game
      message.channel.send({
        content: "Are you sure you want to end the game? (y/n)",
      });
      message.channel
        .awaitMessages({ filter, max: 1 })
        .then((messageNext2) => {
          const msg2 = messageNext2.first().content.toLowerCase().split(" ");
          if (msg2[0] === "yes" || msg2[0] === "y") {
            message.channel.send({
              content:
                "Game ended! Time: `" +
                RM.pretty_ms(new Date().getTime() - gameTime) +
                "`",
            });
            for (var i = 0; i < global.mineSweeperList.length; i++) {
              if (global.mineSweeperList[i] === message.author.id) {
                global.mineSweeperList.splice(i, 1);
                i--;
              }
            }
            message.channel.send({
              content: "```js\n" + renderBoard(textBoard) + "```",
            });
            collector.stop();
            return;
          } else if (msg2[0] === "no" || msg2[0] === "n") {
            message.channel.send({ content: "Ok." });
          }
        })
        .catch(console.error);
    } else if (msg[0] === "settings") {
      if (msg[1] === "set") {
        if (msg[2] === "uncoverzeroauto") {
          if (msg[3] === "true") {
            uncoverZeroAuto = true;
          } else if (msg[3] === "false") {
            uncoverZeroAuto = false;
          }
        }
      }
    }
  });
  // cmd stuff here
}
function convertToNum(a) {
  return (
    [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ].indexOf(a.toLowerCase()) + 1
  );
}
function calcPercent(percent, number) {
  return parseInt((percent / 100) * number);
}
function renderBoard(board) {
  let newBoard = JSON.parse(JSON.stringify(board));
  const a = newBoard.join("\n").replace(/,/g, " | ").trimEnd().split("\n");
  const newerBoard = [];
  let top = " ";
  for (let i in a) {
    top += "   " + numToSSColumn(parseInt(i) + 1);
  }
  top += "\n  +";
  for (let i in a) {
    top += "---+";
  }
  let bottom = "  +";
  for (let i in a) {
    bottom += "---+";
  }
  bottom += "\n ";
  for (let i in a) {
    bottom += "   " + numToSSColumn(parseInt(i) + 1);
  }
  newerBoard.push(top);

  for (let i in a) {
    newerBoard.push(
      numToSSColumn(parseInt(i) + 1) +
        " | " +
        a[i] +
        " | " +
        numToSSColumn(parseInt(i) + 1)
    );
  }
  newerBoard.push(bottom);
  return newerBoard.join("\n");
}
function addzeros(number, length) {
  var my_string = "" + number;
  while (my_string.length < length) {
    my_string = "0" + my_string;
  }
  return my_string;
}
function getCell(array, x, y) {
  x = parseInt(x);
  y = parseInt(y);
  var NO_VALUE = null;
  var value, hasValue;

  try {
    hasValue = array[x][y] !== undefined;
    value = hasValue ? array[x][y] : NO_VALUE;
  } catch (e) {
    value = NO_VALUE;
  }
  return value;
}
function revealZeros(array, rArray, x, y, callback) {
  rArray[x][y] = true;
  var around = surroundings(array, y, x);
  if (around.up.type !== null && around.up.type === 0) {
    revealZeros(array, rArray, around.up.x, around.up.y);
  }
  if (around.down.type !== null && around.down.type === 0) {
    revealZeros(array, rArray, around.down.x, around.down.y);
  }
  if (around.left.type !== null && around.left.type === 0) {
    revealZeros(array, rArray, around.left.x, around.left.y);
  }
  if (around.right.type !== null && around.right.type === 0) {
    revealZeros(array, rArray, around.right.x, around.right.y);
  }
  //maybe remove later
  if (around.upRight.type !== null && around.upRight.type === 0) {
    revealZeros(array, rArray, around.upRight.x, around.upRight.y);
  }
  if (around.downLeft.type !== null && around.downLeft.type === 0) {
    revealZeros(array, rArray, around.downLeft.x, around.downLeft.y);
  }
  if (around.downRight.type !== null && around.downRight.type === 0) {
    revealZeros(array, rArray, around.downRight.x, around.downRight.y);
  }
  if (around.upLeft.type !== null && around.upLeft.type === 0) {
    revealZeros(array, rArray, around.upLeft.x, around.upLeft.y);
  }
  if (callback) {
    callback();
  } else {
    return;
  }
}

function surroundings(array, y, x) {
  // Directions are clockwise

  x = parseInt(x);
  y = parseInt(y);
  return {
    up: { type: getCell(array, x, y + 1), x: x, y: y + 1 },
    upRight: { type: getCell(array, x + 1, y + 1), x: x + 1, y: y + 1 },
    right: { type: getCell(array, x + 1, y), x: x + 1, y: y },
    downRight: { type: getCell(array, x + 1, y - 1), x: x + 1, y: y - 1 },
    down: { type: getCell(array, x, y - 1), x: x, y: y - 1 },
    downLeft: { type: getCell(array, x - 1, y - 1), x: x - 1, y: y - 1 },
    left: { type: getCell(array, x - 1, y), x: x - 1, y: y },
    upLeft: { type: getCell(array, x - 1, y + 1), x: x - 1, y: y + 1 },
  };
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
function numToSSColumn(num) {
  let s = "",
    t;

  while (num >= 1) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
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
