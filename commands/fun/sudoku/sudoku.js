const commandInfo = {
  primaryName: "sudoku", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["sudoku"], // These are all commands that will trigger this command.
  help: "Play sudoku!", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <difficulty> <size>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdSudoku) {
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
  if (global.sudokuList.includes(message.author.id)) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("You are already playing a game of Sudoku!")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Already Playing"),
      ],
    });
  }

  const log = console.log;
  console.log = function () {};
  global.sudokuList.push(message.author.id);
  const SudokuGenerator = require("js-sudoku-generator").SudokuGenerator;
  const genBoard = SudokuGenerator.generate(1)[0];
  let loadBoard = SudokuGenerator.loadBoard(genBoard.signature);
  let difficulty = 1;
  if (args[0]) {
    if (args[0].toLowerCase() === "easy" || args[0].toLowerCase() === "1") {
      difficulty = 0;
      message.channel.send({ content: "Difficulty set to: EASY" });
    } else if (
      args[0].toLowerCase() === "normal" ||
      args[0].toLowerCase() === "2"
    ) {
      difficulty = 1;
      message.channel.send({ content: "Difficulty set to: NORMAL" });
    } else if (
      args[0].toLowerCase() === "hard" ||
      args[0].toLowerCase() === "3"
    ) {
      difficulty = 2;
      message.channel.send({ content: "Difficulty set to: HARD" });
    } else {
      difficulty = 1;
      message.channel.send({ content: "Default difficulty chosen: NORMAL" });
    }
  } else {
    message.channel.send({ content: "Default difficulty chosen: NORMAL" });
  }
  const board = genBoard.getSheet(difficulty);
  console.log = log;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "") {
        board[i][j] = ".";
      }
    }
  }
  let mistakes = 0;
  let moves = 0;
  const timeStarted = new Date().getTime();
  message.channel.send({
    content:
      "Moves: " +
      moves +
      " | Mistakes: " +
      mistakes +
      "/3 ```js\n" +
      renderBoard(board) +
      "```",
  });
  var filter = (m) => [message.author.id].includes(m.author.id);
  const collector = message.channel.createMessageCollector(filter);
  collector.on("collect", async (messageNext) => {
    const msg = messageNext.content.toLowerCase().split(" ");
    if (msg[0] === "set") {
      if (!msg[1]) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid input.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Input"),
          ],
        });
      }
      if (!msg[2]) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid input.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Input"),
          ],
        });
      }
      if (isNaN(parseInt(msg[2]))) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid input.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Input"),
          ],
        });
      }
      const row = parseInt(msg[1].split(":")[0]);
      const col = parseInt(msg[1].split(":")[1]);
      const val = parseInt(msg[2]);
      if (isNaN(row) || isNaN(col)) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid input.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Input"),
          ],
        });
      }
      if (row < 1 || row > 9 || col < 1 || col > 9) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid input.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Input"),
          ],
        });
      }
      if (val < 1 || val > 9) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid input.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Input"),
          ],
        });
      }
      if (board[row - 1][col - 1] !== ".") {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid board spot.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid spot"),
          ],
        });
      }
      let clone = JSON.parse(JSON.stringify(board));
      clone[row - 1][col - 1] = val;
      console.log(clone.join("\n"));
      if (!isValidSudoku(clone)) {
        mistakes++;
        if (mistakes === 3) {
          collector.stop();
          return message.channel.send({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You lost! Too many mistakes")
                .setThumbnail(message.guild.iconURL())
                .setTitle("You lost!"),
            ],
          });
        }
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(":x: The number `" + val + "` is incorrect.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Input")
              .setFooter({
                text: "You have " + (3 - mistakes) + " tries left.",
              }),
          ],
        });
      } else {
        board[row - 1][col - 1] = val;
        moves++;
        if (isSodokuFinished(board)) {
          const timeEnded = new Date().getTime();
          const timeTaken = timeEnded - timeStarted;
          collector.stop();
          const embed = new RM.Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              ":white_check_mark: You solved the sudoku in `" +
                RM.pretty_ms(timeTaken) +
                "`\nMistakes: `" +
                mistakes +
                "`" +
                "\nMoves: `" +
                moves +
                "`"
            )
            .setThumbnail(message.guild.iconURL())
            .setTitle("Solved!");

          for (var i = 0; i < global.sudokuList.length; i++) {
            if (global.sudokuList[i] === message.author.id) {
              global.sudokuList.splice(i, 1);
              i--;
            }
          }
          message.channel.send({ embeds: [embed] });
          return;
        }
        message.channel.send({
          content:
            "Moves: " +
            moves +
            " | Mistakes: " +
            mistakes +
            "/3 ```js\n" +
            renderBoard(board) +
            "```",
        });
      }
    } else if (msg[0] === "giveup") {
      const endTime = new Date().getTime();
      const timeTaken = endTime - timeStarted;
      collector.stop();
      message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("You gave up!")
            .setThumbnail(message.guild.iconURL())
            .setTitle("You gave up!")
            .setFooter({
              text:
                RM.pretty_ms(timeTaken) +
                " | You had " +
                moves +
                " moves and " +
                mistakes +
                " mistakes.",
            }),
        ],
      });
      for (var i = 0; i < global.sudokuList.length; i++) {
        if (global.sudokuList[i] === message.author.id) {
          global.sudokuList.splice(i, 1);
          i--;
        }
      }
    } else if (msg[0] === "board") {
      message.channel.send({
        content:
          "Moves: " +
          moves +
          " | Mistakes: " +
          mistakes +
          "/3 ```js\n" +
          renderBoard(board) +
          "```",
      });
    }
  });
}
function renderBoard(board) {
  const line1 =
    "1 | " +
    board[0][0] +
    " | " +
    board[0][1] +
    " | " +
    board[0][2] +
    " | | " +
    board[0][3] +
    " | " +
    board[0][4] +
    " | " +
    board[0][5] +
    " | | " +
    board[0][6] +
    " | " +
    board[0][7] +
    " | " +
    board[0][8] +
    " |";
  const line2 =
    "2 | " +
    board[1][0] +
    " | " +
    board[1][1] +
    " | " +
    board[1][2] +
    " | | " +
    board[1][3] +
    " | " +
    board[1][4] +
    " | " +
    board[1][5] +
    " | | " +
    board[1][6] +
    " | " +
    board[1][7] +
    " | " +
    board[1][8] +
    " |";
  const line3 =
    "3 | " +
    board[2][0] +
    " | " +
    board[2][1] +
    " | " +
    board[2][2] +
    " | | " +
    board[2][3] +
    " | " +
    board[2][4] +
    " | " +
    board[2][5] +
    " | | " +
    board[2][6] +
    " | " +
    board[2][7] +
    " | " +
    board[2][8] +
    " |";
  const line4 =
    "4 | " +
    board[3][0] +
    " | " +
    board[3][1] +
    " | " +
    board[3][2] +
    " | | " +
    board[3][3] +
    " | " +
    board[3][4] +
    " | " +
    board[3][5] +
    " | | " +
    board[3][6] +
    " | " +
    board[3][7] +
    " | " +
    board[3][8] +
    " |";
  const line5 =
    "5 | " +
    board[4][0] +
    " | " +
    board[4][1] +
    " | " +
    board[4][2] +
    " | | " +
    board[4][3] +
    " | " +
    board[4][4] +
    " | " +
    board[4][5] +
    " | | " +
    board[4][6] +
    " | " +
    board[4][7] +
    " | " +
    board[4][8] +
    " |";
  const line6 =
    "6 | " +
    board[5][0] +
    " | " +
    board[5][1] +
    " | " +
    board[5][2] +
    " | | " +
    board[5][3] +
    " | " +
    board[5][4] +
    " | " +
    board[5][5] +
    " | | " +
    board[5][6] +
    " | " +
    board[5][7] +
    " | " +
    board[5][8] +
    " |";
  const line7 =
    "7 | " +
    board[6][0] +
    " | " +
    board[6][1] +
    " | " +
    board[6][2] +
    " | | " +
    board[6][3] +
    " | " +
    board[6][4] +
    " | " +
    board[6][5] +
    " | | " +
    board[6][6] +
    " | " +
    board[6][7] +
    " | " +
    board[6][8] +
    " |";
  const line8 =
    "8 | " +
    board[7][0] +
    " | " +
    board[7][1] +
    " | " +
    board[7][2] +
    " | | " +
    board[7][3] +
    " | " +
    board[7][4] +
    " | " +
    board[7][5] +
    " | | " +
    board[7][6] +
    " | " +
    board[7][7] +
    " | " +
    board[7][8] +
    " |";
  const line9 =
    "9 | " +
    board[8][0] +
    " | " +
    board[8][1] +
    " | " +
    board[8][2] +
    " | | " +
    board[8][3] +
    " | " +
    board[8][4] +
    " | " +
    board[8][5] +
    " | | " +
    board[8][6] +
    " | " +
    board[8][7] +
    " | " +
    board[8][8] +
    " |";
  return (
    "    1   2   3     4   5   6     7   8   9\n" +
    "  +---+---+---+ +---+---+---+ +---+---+---+\n" +
    line1 +
    "\n" +
    line2 +
    "\n" +
    line3 +
    "\n  +---+---+---+ +---+---+---+ +---+---+---+\n" +
    line4 +
    "\n" +
    line5 +
    "\n" +
    line6 +
    "\n  +---+---+---+ +---+---+---+ +---+---+---+\n" +
    line7 +
    "\n" +
    line8 +
    "\n" +
    line9 +
    "\n  +---+---+---+ +---+---+---+ +---+---+---+"
  );
}
function isValidSudoku(board) {
  let rows = [];
  let columns = [];
  let boxes = [];
  for (let i = 0; i < 9; i++) {
    rows.push([]);
    columns.push([]);
    boxes.push([]);
  }
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      let cell = board[i][j];

      if (cell !== ".") {
        if (rows[i].includes(cell)) {
          return false;
        } else rows[i].push(cell);

        if (columns[j].includes(cell)) {
          return false;
        } else columns[j].push(cell);

        let boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

        if (boxes[boxIndex].includes(cell)) {
          return false;
        } else boxes[boxIndex].push(cell);
      }
    }
  }

  return true;
}
function isSodokuFinished(board) {
  if (isValidSudoku(board)) {
    for (let i in board) {
      for (let j in board[i]) {
        if (board[i][j] === ".") {
          return false;
        }
      }
    }
    return true;
  } else {
    return false;
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
