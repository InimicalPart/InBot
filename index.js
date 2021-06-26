const Discord = require("discord.js");
require("dotenv").config();
const prefix = process.env.prefix
const token = process.env.NotMyToken
if (token == null) {
	console.log("Token is missing, please make sure you have the .env file in the directory with the correct information. Please see https://github.com/InimicalPArt/TheIIIProject for more information.")
	process.exit(1)
} else if (prefix == null) {
	console.log("Prefix is missing, The consequences of this will be that the bot wont have a prefix and will react to messages like 'test'. please make sure you have the .env file in the directory with the correct information. Please see https://github.com/InimicalPart/TheIIIProject for more information.")
}
const botOwners = ["ray.#2021", "InimicalPart ©#0001", "lethal.#0111"]
function attachIsImage(msgAttach) {
	var url = msgAttach.url;
	//True if this url is a png image.
	if (url.indexOf("png", url.length - "png".length /*or 3*/) !== -1) {
		return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
	} else if (url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1) {
		return url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
	} else if (url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1) {
		return url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1;
	} else if (url.indexOf("webm", url.length - "webm".length /*or 3*/) !== -1) {
		return url.indexOf("webm", url.length - "webm".length /*or 3*/) !== -1;
	}
}
const setImageLinks = [
	"https://cdn.discordapp.com/attachments/857343827223117827/858120350633951272/III_29.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123412149239818/Web_1920_1.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123433627746334/Web_1920_2.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123438262190100/Web_1920_3.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123460580737024/Web_1920_4.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123473021042718/Web_1920_6.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123480855216148/Web_1920_5.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123487951978506/Web_1920_7.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123488999768085/Web_1920_8.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123924831076362/Web_1920_56.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123863103897630/Web_1920_53.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123857653923881/Web_1920_46.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123842944892965/Web_1920_42.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123820619268116/Web_1920_41.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123795708903434/Web_1920_36.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123699764985856/Web_1920_27.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123645461594162/Web_1920_22.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123632353214464/Web_1920_21.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123547737325608/Web_1920_13.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123553614725120/Web_1920_15.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858124139042308096/Web_1920_61.png",
]


const client = new Discord.Client();
function between(min, max) {
	return Math.floor(
		Math.random() * (max - min + 1) + min
	)
}
client.on('message', async (message) => {
	if (message.author.bot) return;
	const args = message.content.split(' ').shift();
	if (message.content.startsWith(prefix + "test")) {
		if (botOwners.includes(message.author.tag)) {
			message.channel.send("Hi! My brain tells me that you are one of my owners :)")
		} else {
			message.channel.send("Hmm... You're not my owner! >:(")
		}
	} else if (message.content.startsWith(prefix + "embed")) {
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

	} else if (message.content.startsWith(prefix + "post")) {
		message.channel.send("Please send the image you want to post")
		let url;
		let title;
		var filter = m => m.author.id === message.author.id
		message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000,
			errors: ['time']
		}).then(messageNext => {
			messageNext = messageNext.first()
			if (messageNext.attachments.size > 0 && messageNext.attachments.size < 2) {
				if (messageNext.attachments.every(attachIsImage)) {
					messageNext.attachments.forEach(attachment => {
						url = attachment.url;
						message.channel.send("Wow! What's this amazing picture called?")
						var filter2 = m => m.author.id === message.author.id
						message.channel.awaitMessages(filter2, {
							max: 1,
							time: 30000,
							errors: ['time']
						}).then(messageNext => {
							messageNext = messageNext.first()
							if (messageNext.content.length > 75) {
								return message.channel.send("This title is too long! Try again with a shorter title");
							} else {
								title = messageNext.content;
								const submissionChannel = client.channels.cache.get("858140842798743603");
								/*submissionChannel.send("**" + title + "**");
								submissionChannel.send(url);
								submissionChannel.send("Amazing picture by: <@" + message.author + ">")
								*/
								const subEmbed = new Discord.MessageEmbed()
									.setAuthor(message.author.tag, message.author.avatarURL())
									.setImage(url)
									.setColor("#FFFF00")
									.addField("Title:", "**" + title + "**")
									.addField("Amazing picture by:", "<@" + message.author + ">");

								submissionChannel.send(subEmbed)
									.then(function (messagea) {
										messagea.react("👍")
										messagea.react("👎")
									}).catch(function (err) {
										console.error("ERROR: " + err.message)
									});

								message.channel.send("Your image was sent to <#" + submissionChannel.id + ">")
							}
						});
					});
				} else {
					return message.channel.send("Not an image.")
				}
			} else {
				return message.channel.send("You did not send an image.")
			}
		});

	}
})
client.on('ready', () => {
	console.log(client.user.tag + " is ready!")
})

client.login(token)