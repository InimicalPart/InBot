const commandInfo = {
	"possibleTriggers": ["embed", "info"]
}

async function runCommand(message, args, RM) {

	const Discord = RM.Discord;
	const setImageLinks = RM.setImageLinks
	const randomLink = setImageLinks[Math.floor(Math.random() * setImageLinks.length)]
	const embed = new Discord.MessageEmbed()
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setColor(0x00AE86)
		.setDescription("**III Project** Invite: [**Click me!**](https://discord.gg/iii) ")
		.setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
		.setImage(randomLink)//"https://cdn.discordapp.com/attachments/857343827223117827/858120350633951272/III_29.png")
		//.setThumbnail("http://i.imgur.com/p2qNFag.png")
		.setTimestamp()
		.setURL("https://discord.js.org/#/docs/main/v12/class/MessageEmbed")
		.addFields({
			name: "This is a field title, it can hold 256 characters",
			value: "This is a field value, it can hold 1024 characters."
		})
		.addFields({ name: "Inline Field", value: "They can also be inline.", inline: true })
		.addFields({ name: '\u200b', value: '\u200b' })
		.addFields({ name: "More information", value: "More information is available [**here**](https://www.github.com/InimicalPart/TheIIIProject)", inline: true });


	message.channel.send(embed);


}
function commandAlias() {
	return commandInfo.possibleTriggers;
}
module.exports = { runCommand, commandAlias }

console.log("[I] EMBED initialized [I]")
/* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /*
------------------[Instruction]------------------

1. Make a directory in commands/ with your command name
2. Inside that directory, make a "<command name>.js" file
3. Copy the contents of TEMPLATE.js and paste it in the <command name>.js file and modify it to your needs.
4. In index.js add to the top:
"const cmd<cmdNameHere> = require('./commands/<command name>/<command name>.js');" at the top.

-------------------------------------------------

To get all possible triggers, from index.js call
"cmd<cmdname>.commandAlias()"

To call the command, from index.js call
"cmd<cmdname>.runCommand(message, arguments, requiredModules);"

To check if possible triggers has the command call
"cmd<cmdname>.commandAlias().includes(command)"

------------------[Instruction]------------------
*/ /* */ /* */ /* */ /* */ /* */ /* */ /* */ /* */