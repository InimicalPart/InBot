const Discord = require("discord.js");
const db = require("quick.db")
require("dotenv").config();
if (process.env.NotMyToken == null) {
	console.log("Token is missing, please make sure you have the .env file in the directory with the correct information. Please see https://github.com/InimicalPart/TheIIIProject for more information.")
	process.exit(1)
}
const client = new Discord.Client();
const requiredModules = {
	"cmdTest": require('./commands/test/test.js'),
	"cmdPost": require('./commands/post/post.js'),
	"cmdApprove": require('./commands/approve/approve.js'),
	"cmdDeny": require('./commands/deny/deny.js'),
	"cmdRemove": require('./commands/remove/remove.js'),
	"cmdEmbed": require('./commands/embed/embed.js'),
	"cmdRestore": require('./commands/restore/restore.js'),
	"cmdRandom": require('./commands/random/random.js'),
	"cmdHelp": require('./commands/help/help.js'),
	"cmdCalculate": require('./commands/calculate/calculate.js'),
	"cmdRoast": require('./commands/roast/roast.js'),
	"cmdMotivation": require('./commands/motivation/motivation.js'),
	"cmdBan": require('./commands/ban/ban.js'),
	"cmdModlog": require('./commands/modlog/modlog.js'),
	"cmdUnban": require('./commands/unban/unban.js'),
	"Discord": Discord,
	"process_env": process.env,
	"pretty_ms": require("pretty-ms"),
	"client": client,
	"db": db,
	"submissionChannelID": "858140842798743603",
	"submissionQueueID": "858356481556611122",
	"logsID": "858357212828925952",
	"iiiPostingID": "858161576561606697",
	"botOwners": ["745783548241248286", "301062520679170066", "426826826220961821"],
	"setImageLinks": ["https://cdn.discordapp.com/attachments/857343827223117827/858124182981050408/Twitter_Header_2.png", "https://cdn.discordapp.com/attachments/857343827223117827/858124182209691708/Web_1920_64.png", "https://cdn.discordapp.com/attachments/857343827223117827/858124139042308096/Web_1920_61.png", "https://cdn.discordapp.com/attachments/857343827223117827/858124138597842964/Web_1920_57.png", "https://cdn.discordapp.com/attachments/857343827223117827/858124125063479296/Web_1920_58.png", "https://cdn.discordapp.com/attachments/857343827223117827/858124099062726696/Web_1920_60.png", "https://cdn.discordapp.com/attachments/857343827223117827/858124099422781451/Web_1920_63.png", "https://cdn.discordapp.com/attachments/857343827223117827/858124026190102558/Web_1920_59.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123979444322334/Web_1920_67.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123946850648094/Web_1920_55.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123924831076362/Web_1920_56.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123889539678228/Web_1920_54.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123885995753472/Web_1920_47.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123870626906122/Web_1920_44.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123863103897630/Web_1920_53.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123863308107776/Web_1920_51.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123859566657566/Web_1920_52.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123857653923881/Web_1920_46.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123848398405632/Web_1920_50.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123842840035378/Web_1920_43.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123842944892965/Web_1920_42.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123827754172436/Web_1920_45.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123820619268116/Web_1920_41.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123813157208114/Web_1920_40.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123807402360852/Web_1920_38.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123805209919528/Web_1920_39.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123795708903434/Web_1920_36.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123781310513163/Web_1920_34.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123781280497704/Web_1920_35.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123771767816203/Web_1920_32.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123765728280576/Web_1920_30.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123765112111124/Web_1920_37.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123757842071552/Web_1920_31.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123736146640936/Web_1920_29.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123735998267392/Web_1920_33.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123699764985856/Web_1920_27.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123695191752714/Web_1920_26.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123693007962172/Web_1920_28.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123686049742858/Web_1920_25.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123673645875210/Web_1920_23.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123668755447859/Web_1920_24.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123645461594162/Web_1920_22.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123632353214464/Web_1920_21.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123617854291978/Web_1920_20.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123604033273876/Web_1920_19.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123581354934272/Web_1920_18.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123570508726292/Web_1920_16.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123562703519795/Web_1920_17.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123553614725120/Web_1920_15.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123547737325608/Web_1920_13.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123533603438592/Web_1920_14.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123524749393940/Web_1920_12.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123513566855208/Web_1920_11.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123500489146368/Web_1920_10.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123499629051914/Web_1920_9.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123488999768085/Web_1920_8.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123487951978506/Web_1920_7.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123480855216148/Web_1920_5.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123473021042718/Web_1920_6.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123460580737024/Web_1920_4.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123438262190100/Web_1920_3.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123433627746334/Web_1920_2.png", "https://cdn.discordapp.com/attachments/857343827223117827/858123412149239818/Web_1920_1.png",],
	"math": require("mathjs")
}
client.on('message', async (message) => {
	if (message.author.bot || !message.content.startsWith(process.env.prefix)) return;
	for (let i in requiredModules) {
		if (i.startsWith("cmd"))
			if (requiredModules[i].commandAlias().includes(message.content.split(" ")[0].replace(process.env.prefix, "")))
				requiredModules[i].runCommand(message, message.content.split(" ").slice(1), requiredModules);

	}
})
client.on('ready', () => {
	client.user.setPresence({ activity: { name: `III V3`, type: "WATCHING" }, status: 'dnd' })
	console.log("------------------------\n" + client.user.tag + " is ready!")
})
client.login(process.env.NotMyToken)