const commandInfo = {
  primaryName: "run", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["run"], // These are all commands that will trigger this command.
  help: "Owner only command to execute commands.", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <commands>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "developer",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdRun) {
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
  const valid = ["301062520679170066", "814623079346470993"];
  if (!valid.includes(message.author.id)) return;
  const { fork, spawn } = require("child_process");
  if (args.length < 1) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription("You need to specify a command to run!")
          .setThumbnail(message.guild.iconURL())
          .setTitle("Error"),
      ],
    });
  }
  let nodecode;
  let executionStats = false;
  if (args.includes("--iii-exec-stats")) {
    //copy args and remove --iii-exec-stats
    let newArgs = args.slice();
    newArgs.splice(newArgs.indexOf("--iii-exec-stats"), 1);
    nodecode = newArgs;
    executionStats = true;
  } else nodecode = args;
  nodecode = nodecode.join(" ");
  require("fs").writeFile("execute.js", nodecode, function (err, result) {
    if (err) console.log("error", err);
  });
  message.channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:869354366803509299> *Code is running...*"
        ),
      ],
    })
    .then(async (m) => {
      var dataToSend;
      var errorToSend;

      let timeTaken = new Date().getTime();
      const nodefile = spawn("node", ["execute.js"]);
      nodefile.stdout.on("data", function (data) {
        dataToSend = data.toString();
      });
      nodefile.stderr.on("data", function (data) {
        errorToSend = data.toString();
      });
      nodefile.on("close", (code) => {
        timeTaken = new Date().getTime() - timeTaken;
        if (dataToSend != undefined) {
          m.edit({
            content: "```javascript\n" + dataToSend + "\n```",
            embeds: [],
          });
          if (executionStats) {
            message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setTitle("Execution Stats")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setColor("GREEN")
                  .addField("Status", "Success")
                  .addField("Process PID", String(nodefile.pid))
                  .addField("Execution Time", require("pretty-ms")(timeTaken)),
              ],
            });
          }
        }
        if (errorToSend != undefined) {
          m.edit({
            content: "```javascript\n" + errorToSend + "\n```",
            embeds: [],
          });
          if (executionStats) {
            message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setTitle("Execution Stats")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setColor("RED")
                  .addField("Status", "Failure")
                  .addField("Process PID", String(nodefile.pid))
                  .addField("Execution Time", require("pretty-ms")(timeTaken)),
              ],
            });
          }
        }
        if (dataToSend == undefined && errorToSend == undefined) {
          m.edit({
            content:
              "```yaml\n" +
              "[CMDEXEC] The command didn't output anything." +
              "\n```",
            embeds: [],
          });
          if (executionStats) {
            message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setTitle("Execution Stats")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setColor("YELLOW")
                  .addField("Status", "Unknown (No output)")
                  .addField("Process PID", String(nodefile.pid))
                  .addField("Execution Time", require("pretty-ms")(timeTaken)),
              ],
            });
          }
        }
      });
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
