const commandInfo = {
	primaryName: "balance", // This is the command name used by help.js (gets uppercased).
	possibleTriggers: ["balance", "wallet", "bal"], // These are all commands that will trigger this command.
	help: "Shows Your or a User's Current Balance ", // This is the general description pf the command.
	aliases: ["bal", "wallet"], // These are command aliases that help.js will use
	usage: "[COMMAND] [username | nickname | mention | ID]", // [COMMAND] gets replaced with the command and correct prefix later
	category: "economy",
};

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdBalance) {
		return message.channel.send(
			new RM.Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.username, message.author.avatarURL())
				.setDescription("Command disabled by Administrators.")
				.setThumbnail(message.guild.iconURL())
				.setTitle("Command Disabled")
		);
	}

	const Discord = RM.Discord;
	const client = RM.client;

	message.channel.send(
		new Discord.MessageEmbed()
		.setDescription(
			"<a:loading:869354366803509299> *Working on it...*"
			)).then(async (m) => {
		const user =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				r =>
					r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
			) ||
			message.guild.members.cache.find(
				r => r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
			) ||
			message.member;

				

		if (!user) {
			return m.edit(new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`${args[0]} is not a valid user.`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("User Not Found")
			)
		}
		const username = user.user.username || user.username
		
		const newProfile = {
			userID: user.id,
			username: user.user.tag
		};
		const profile = await client.getProfile(user).catch((err) => {
			console.log(`^^`);
		})
		// if there is no profile create one and send a message saying that they have been added to the data base
		if (!profile) {
			await client.createProfile(newProfile);
		m.edit(
			new Discord.MessageEmbed()
				.setColor("GREEN")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`Welcome to The III Project's Economy System!\n\nYou have been added to the database, please re-use the command`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("WELCOME")
		)} 
		
		

		//if (await connect.fetch("currency", user.id) === null) {
		//	await connect.add("currency", user.id, 0, 0)
		//}
		// const info = await connect.fetch("currency", user.id)

		const bal = parseInt(profile.coins);	
		const bank = parseInt(profile.bank); 
		const bankSpace = parseInt(profile.bankSpace);

		
		//create a variable that will calculate how much is in the bank, max allowed = bankSpace. convert it to percent up to 2 decimal places 
		const bankPercent = (bank / bankSpace) * 100;

		//create a variable that gets the day month and year of a user
		const date = new Date();
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();





		if (user) {
			let embed = new Discord.MessageEmbed()
				.setColor("BLACK")
				.setTitle(`${username}'s Balance`)
				.setDescription(`**Wallet**: ⍟ ${bal}\n**Bank**: ⍟ ${bank}/${bankSpace} (\`${bankPercent}%\`)`)
				.setFooter(`😏 • ${day}/${month}/${year}`) //set footer to the day month and year
			return m.edit(embed);
		} else {
			return m.edit(
				new Discord.MessageEmbed()
					.setColor("RED")
					.setAuthor(message.author.username, message.author.avatarURL())
					.setDescription(
						"Could not find user. Please make sure you are using a mention, nickname, or ID."
					)
					.setThumbnail(message.guild.iconURL())
					.setTitle("Error")
					.setTimestamp()
			);
		}
	})
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
