const Discord = require("discord.js");
require("dotenv").config();
const prefix = process.env.prefix
const token = process.env.NotMyToken
const submissionChannelID = "858140842798743603"
const submissionQueueID = "858140842798743603"
if (token == null) {
	console.log("Token is missing, please make sure you have the .env file in the directory with the correct information. Please see https://github.com/InimicalPArt/TheIIIProject for more information.")
	process.exit(1)
} else if (prefix == null) {
	console.log("Prefix is missing, The consequences of this will be that the bot wont have a prefix and will react to messages like 'test'. please make sure you have the .env file in the directory with the correct information. Please see https://github.com/InimicalPart/TheIIIProject for more information.")
}
const botOwners = ["745783548241248286", "301062520679170066", "426826826220961821"]
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
	"https://cdn.discordapp.com/attachments/857343827223117827/858124182981050408/Twitter_Header_2.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858124182209691708/Web_1920_64.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858124139042308096/Web_1920_61.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858124138597842964/Web_1920_57.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858124125063479296/Web_1920_58.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858124099062726696/Web_1920_60.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858124099422781451/Web_1920_63.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858124026190102558/Web_1920_59.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123979444322334/Web_1920_67.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123946850648094/Web_1920_55.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123924831076362/Web_1920_56.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123889539678228/Web_1920_54.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123885995753472/Web_1920_47.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123870626906122/Web_1920_44.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123863103897630/Web_1920_53.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123863308107776/Web_1920_51.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123859566657566/Web_1920_52.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123857653923881/Web_1920_46.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123848398405632/Web_1920_50.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123842840035378/Web_1920_43.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123842944892965/Web_1920_42.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123827754172436/Web_1920_45.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123820619268116/Web_1920_41.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123813157208114/Web_1920_40.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123807402360852/Web_1920_38.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123805209919528/Web_1920_39.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123795708903434/Web_1920_36.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123781310513163/Web_1920_34.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123781280497704/Web_1920_35.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123771767816203/Web_1920_32.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123765728280576/Web_1920_30.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123765112111124/Web_1920_37.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123757842071552/Web_1920_31.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123736146640936/Web_1920_29.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123735998267392/Web_1920_33.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123699764985856/Web_1920_27.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123695191752714/Web_1920_26.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123693007962172/Web_1920_28.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123686049742858/Web_1920_25.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123673645875210/Web_1920_23.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123668755447859/Web_1920_24.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123645461594162/Web_1920_22.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123632353214464/Web_1920_21.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123617854291978/Web_1920_20.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123604033273876/Web_1920_19.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123581354934272/Web_1920_18.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123570508726292/Web_1920_16.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123562703519795/Web_1920_17.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123553614725120/Web_1920_15.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123547737325608/Web_1920_13.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123533603438592/Web_1920_14.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123524749393940/Web_1920_12.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123513566855208/Web_1920_11.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123500489146368/Web_1920_10.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123499629051914/Web_1920_9.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123488999768085/Web_1920_8.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123487951978506/Web_1920_7.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123480855216148/Web_1920_5.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123473021042718/Web_1920_6.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123460580737024/Web_1920_4.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123438262190100/Web_1920_3.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123433627746334/Web_1920_2.png",
	"https://cdn.discordapp.com/attachments/857343827223117827/858123412149239818/Web_1920_1.png",
]


const client = new Discord.Client();
function between(min, max) {
	return Math.floor(
		Math.random() * (max - min + 1) + min
	)
}
async function findMessage(message, ID) {
	let channels = message.guild.channels.cache.filter(c => c.type == 'text').array();
	for (let current of channels) {
		let target = await current.messages.fetch(ID);
		if (target) { console.log(target); return target; }
	}
}

client.on('message', async (message) => {
	if (message.author.bot) return;
	let args = []
	args = message.content.split(" ").slice(1);//.split(" ");
	if (message.content.startsWith(prefix + "test" == "ping")) {
		if (botOwners.includes(message.author.id)) {
			message.channel.send(" this i kinda feel bad if you can see").then (async (msg) =>{
				msg.delete()
				const embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setDescription(`<:bitelip:857350270513971221> | Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\` and API Latency is \`${Math.round(client.ws.ping)}ms\``)
				message.channel.send(embed);
			})
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
								const submissionChannel = client.channels.cache.get(submissionChannelID);
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

	} else if (message.content.startsWith(prefix + "remove")) {
		if (!botOwners.includes(message.author.id)) return message.channel.send("Hmm... You don't seem to have enough permissions to do that.")

		if (!args[0]) {
			return message.channel.send("Please provide the message to remove")
		}
		const submissionChannel = client.channels.cache.get(submissionChannelID);
		const messageID = args[0];
		let m = await submissionChannel.messages.fetch(messageID).catch((err) => {
			return message.channel.send("Invalid Message ID.")
		})
		if (m == undefined) {
			return message.channel.send("Invalid Message ID.");
		}


		//return message.channel.send(messageID + "s content is: " + m.content)
		m.delete().then(() => message.channel.send("Successfully deleted " + messageID)).catch((err) => message.channel.send("ERROR: " + err));

	} else if (message.content.startsWith(prefix + "deny")) {
		if (!botOwners.includes(message.author.id)) return //message.channel.send("Hmm... You don't seem to have enough permissions to do that.")
		message.delete();
		if (!args[0]) {
			return message.channel.send("Please provide the message to deny")
		}
		if (!args[1]) {
			return message.channel.send("Please provide the reason for the deny")
		}
		const submissionChannel = client.channels.cache.get(submissionChannelID);
		const messageID = args[0];
		const reason = args.slice(1).join(" ");
		let m = await submissionChannel.messages.fetch(messageID).catch((err) => {
			return message.channel.send("Invalid Message ID.")
		})
		if (m == undefined) {
			return message.channel.send("Invalid Message ID.");
		}


		//return message.channel.send(messageID + "s content is: " + m.content)
		if (!m.editable) return message.channel.send("I cannot edit that message.")
		if (m.embeds.length < 1) return message.channel.send("This isn't an image submission.")
		const url = m.embeds[0].image.url
		const authorID = m.embeds[0].author.iconURL.match(/[0-9]{18}/gmi)
		let title = null;
		for (let field of m.embeds[0].fields) {
			if (field.name == 'Title:') {
				title = field.value;
				break
			}
		}
		if (title == null) {
			return message.channel.send("This isn't an image submission.")
		}
		const author = await client.users.fetch(String(authorID));

		//console.log(url, authorID, title, author.tag)
		let exists = null;
		for (let field of m.embeds[0].fields) {
			if (field.name == 'Information:') {
				exists = field.value;
				break
			}
		}
		//console.log(exists)
		if (exists != null) {
			return message.channel.send("This message has already been denied or approved.")
		}
		const newEmbed = new Discord.MessageEmbed()
			.setAuthor(author.tag, author.avatarURL())
			.setImage(url)
			.setColor("#FFFF00")
			.addField("Title:", "**" + title + "**")
			.addField("Amazing picture by:", "<@" + message.author + ">")
			.addField('\u200b', '\u200b')
			.addField('Information:', ':x: | Denied by Moderator: ' + reason);
		m.edit(newEmbed)
		await author.send("Your image submission was denied: " + reason).then(() => {
			message.channel.send("DM Sent.")
		}).catch(() => {
			message.channel.send("User has DMs closed / No mutual servers");
		});
	} else if (message.content.startsWith(prefix + "approve")) {
		if (!botOwners.includes(message.author.id)) return// message.channel.send("Hmm... You don't seem to have enough permissions to do that.")
		message.delete();
		if (!args[0]) {
			return message.channel.send("Please provide the message to approval")
		}
		if (!args[1]) {
			return message.channel.send("Please provide the reason for the approval")
		}
		const submissionChannel = client.channels.cache.get(submissionChannelID);
		const messageID = args[0];
		const reason = args.slice(1).join(" ");
		let m = await submissionChannel.messages.fetch(messageID).catch((err) => {
			return message.channel.send("Invalid Message ID.")
		})
		if (m == undefined) {
			return message.channel.send("Invalid Message ID.");
		}


		//return message.channel.send(messageID + "s content is: " + m.content)
		if (!m.editable) return message.channel.send("I cannot edit that message.")
		if (m.embeds.length < 1) return message.channel.send("This isn't an image submission.")
		const url = m.embeds[0].image.url
		const authorID = m.embeds[0].author.iconURL.match(/[0-9]{18}/gmi)
		let title = null;
		for (let field of m.embeds[0].fields) {
			if (field.name == 'Title:') {
				title = field.value;
				break
			}
		}
		if (title == null) {
			return message.channel.send("This isn't an image submission.")
		}
		const author = await client.users.fetch(String(authorID));

		//console.log(url, authorID, title, author.tag)
		let exists = null;
		for (let field of m.embeds[0].fields) {
			if (field.name == 'Information:') {
				exists = field.value;
				break
			}
		}
		//console.log(exists)
		if (exists != null) {
			return message.channel.send("This message has already been denied or approved.")
		}
		const newEmbed = new Discord.MessageEmbed()
			.setAuthor(author.tag, author.avatarURL())
			.setImage(url)
			.setColor("#FFFF00")
			.addField("Title:", "**" + title + "**")
			.addField("Amazing picture by:", "<@" + message.author + ">")
			.addField('\u200b', '\u200b')
			.addField('Information:', ':white_check_mark: | Approved by Moderator: ' + reason);
		m.edit(newEmbed)
		await author.send("Your image submission was approved!: " + reason).then(() => {
			message.channel.send("DM Sent.")
		}).catch(() => {
			message.channel.send("User has DMs closed / No mutual servers");
		});
	} else if (message.content.startsWith(prefix + "restore")) {
		if (!botOwners.includes(message.author.id)) return// message.channel.send("Hmm... You don't seem to have enough permissions to do that.")
		message.delete();
		if (!args[0]) {
			return message.channel.send("Please provide the message to restore")
		}
		const submissionChannel = client.channels.cache.get(submissionChannelID);
		const messageID = args[0];
		let m = await submissionChannel.messages.fetch(messageID).catch((err) => {
			return message.channel.send("Invalid Message ID.")
		})
		if (m == undefined) {
			return message.channel.send("Invalid Message ID.");
		}


		//return message.channel.send(messageID + "s content is: " + m.content)
		if (!m.editable) return message.channel.send("I cannot edit that message.")
		if (m.embeds.length < 1) return message.channel.send("This isn't an image submission.")
		const url = m.embeds[0].image.url
		const authorID = m.embeds[0].author.iconURL.match(/[0-9]{18}/gmi)
		let title = null;
		for (let field of m.embeds[0].fields) {
			if (field.name == 'Title:') {
				title = field.value;
				break
			}
		}
		if (title == null) {
			return message.channel.send("This isn't an image submission.")
		}
		const author = await client.users.fetch(String(authorID));

		//console.log(url, authorID, title, author.tag)
		let exists = null;
		for (let field of m.embeds[0].fields) {
			if (field.name == 'Information:') {
				exists = field.value;
				break
			}
		}
		//console.log(exists)
		const newEmbed = new Discord.MessageEmbed()
			.setAuthor(author.tag, author.avatarURL())
			.setImage(url)
			.setColor("#FFFF00")
			.addField("Title:", "**" + title + "**")
			.addField("Amazing picture by:", "<@" + message.author + ">")
		m.edit(newEmbed).then((msg) => {
			msg.reactions.removeAll()
			msg.react("👍")
			msg.react("👎")
		}).catch(function (err) {
			console.error("ERROR: " + err.message)
		});
	}

})


client.on('ready', () => {
	console.log(client.user.tag + " is ready!")
})

client.login(token)