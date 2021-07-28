const commandInfo = {
	primaryName: "restart", // This is the command name used by help.js (gets uppercased).
	possibleTriggers: ["refresh"], // These are all commands that will trigger this command.
	help: "restarts the bot ", // This is the general description pf the command.
	aliases: ["refresh"], // These are command aliases that help.js will use
	usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
	category: "admin",
};

async function runCommand(message, args, RM) {
//create a new command that will restart the bot and disconnect it from the database
 if (!isBotOwner)
 return;
    mongoose.connection.close();
    message.channel.sendMessage("Restarting...").then(msg => {
        client.destroy().then(() => {
            client.login(process.env.NotMyToken);
            mongoose.connect(process.env.MONGODB_SRV);
            msg.edit(`Restarted!`);
        }
        );
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
};