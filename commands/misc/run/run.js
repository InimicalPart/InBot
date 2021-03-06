const commandInfo = {
  primaryName: "run", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["run"], // These are all commands that will trigger this command.
  help: "Owner only command to execute commands.", // This is the general description of the command.
  aliases: [], // These are command aliases that help.js will use
  usage: "[COMMAND] <commands>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "developer",
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
  if (!global?.app?.botOwners?.includes(message.author.id)) return;
  const { spawn } = require("child_process");
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
  let dmMode;
  let newArgs = args.slice();
  if (args.includes("--inbot-exec-stats")) {
    //copy args and remove --inbot-exec-stats
    newArgs.splice(newArgs.indexOf("--inbot-exec-stats"), 1);
    executionStats = true;
  }
  if (args.includes("--inbot-dm")) {
    //copy args and remove --inbot-dm
    newArgs.splice(newArgs.indexOf("--inbot-dm"), 1);
    dmMode = true;
  }
  nodecode = newArgs;
  nodecode = nodecode.join(" ");
  require("fs").writeFile("execute.js", nodecode, function (err, result) {
    if (err) console.log("error", err);
  });
  let channel = message.channel;
  if (dmMode) channel = message.author;
  channel
    .send({
      embeds: [
        new RM.Discord.MessageEmbed().setDescription(
          "<a:loading:980471497057501205> *Code is running...*"
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
      nodefile.on("close", async (code) => {
        timeTaken = new Date().getTime() - timeTaken;
        if (dataToSend != undefined) {
          m.edit({
            content: "```javascript\n" + dataToSend + "\n```",
            embeds: [],
            components: [
              new RM.Discord.MessageActionRow().addComponents(
                new RM.Discord.MessageButton()
                  .setLabel("Delete Output")
                  .setStyle("DANGER")
                  .setCustomId("delete-" + message.id),
                new RM.Discord.MessageButton()
                  .setLabel("Save Output")
                  .setStyle("PRIMARY")
                  .setCustomId("save-" + message.id)
              ),
            ],
          });
          if (dmMode)
            message.channel.send({
              content: "Result sent in DMs",
              reply: { messageReference: message.id },
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
          if (errorToSend != undefined) {
            let components = [];
            if (!dmMode)
              components = [
                new RM.Discord.MessageActionRow().addComponents(
                  new RM.Discord.MessageButton()
                    .setLabel("Delete Output")
                    .setStyle("DANGER")
                    .setCustomId("delete-" + message.id),
                  new RM.Discord.MessageButton()
                    .setLabel("Save Output")
                    .setStyle("PRIMARY")
                    .setCustomId("save-" + message.id)
                ),
              ];
            m.edit({
              content: "```javascript\n" + errorToSend + "\n```",
              embeds: [],
              components: components,
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
                    .addField(
                      "Execution Time",
                      require("pretty-ms")(timeTaken)
                    ),
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
              components: [
                new RM.Discord.MessageActionRow().addComponents(
                  new RM.Discord.MessageButton()
                    .setLabel("Delete Output")
                    .setStyle("DANGER")
                    .setCustomId("delete-" + message.id),
                  new RM.Discord.MessageButton()
                    .setLabel("Save Output")
                    .setStyle("PRIMARY")
                    .setCustomId("save-" + message.id)
                ),
              ],
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
                    .addField(
                      "Execution Time",
                      require("pretty-ms")(timeTaken)
                    ),
                ],
              });
            }
          }
          let output =
            dataToSend ||
            errorToSend ||
            "[CMDEXEC] The command didn't output anything.";
          let componentFilter = (component) => {
            if (
              component.customId.includes(message.id) &&
              ["save", "delete"].includes(component.customId.split("-")[0])
            )
              return true;
            return false;
          };
          let collector = await message.channel.createMessageComponentCollector(
            {
              filter: componentFilter,
              time: 60000,
            }
          );
          collector.on("collect", (component) => {
            if (component.customId.includes("save-")) {
              let fileran = new RM.Discord.MessageAttachment(
                Buffer.from(nodecode),
                "executed-" + message.id + ".js"
              );
              let fileoutput = new RM.Discord.MessageAttachment(
                Buffer.from(output, "utf8"),
                "output-" + message.id + ".txt"
              );
              component.user.send({
                content: "Saved execution:",
                files: [fileran, fileoutput],
              });
              component.reply({ content: "Saved in DMs.", ephemeral: true });
            } else if (component.customId.includes("delete-")) {
              if (component.user.id !== message.author.id) return false;
              m.delete();
              message.delete();
              m = null;
              component.reply({
                content: "Deleted execution.",
                ephemeral: true,
              });
            }
          });
          collector.on("end", () => {
            if (m && !dmMode) {
              m.edit({ components: [] });
            }
          });
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
