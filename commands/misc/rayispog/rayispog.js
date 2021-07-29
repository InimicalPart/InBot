const commandInfo = {
	"primaryName": "rayispog", // This is the command name used by help.js (gets uppercased).
	"possibleTriggers": ["rayispog", "rbj", "raysbj"], // These are all commands that will trigger this command.
	"help": "Play a game of blackjack against the bot", // This is the general description of the command.
	"aliases": ["rbj", "raysbj"], // These are command aliases that help.js will use
	"usage": "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
	"category": "misc"
}

async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdRayispog) {
		return message.channel.send(new RM.Discord.MessageEmbed()
			.setColor("RED")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
				"Command disabled by Administrators."
			)
			.setThumbnail(message.guild.iconURL())
			.setTitle("Command Disabled")
		)
	}

	const { connect } = require("../../../databasec")
	await connect()
	await connect.create("currency")
	const queue2 = global.sQueue2;
	const queue3 = global.sQueue3;
	const queue = global.sQueue;
	const games = global.games

	let ops = {
		queue2: queue2,
		queue: queue,
		queue3: queue3,
		games: games
	}

	const { stripIndents } = RM.common;
	const { shuffle, verify } = require("../../../functions");

	const Discord = RM.Discord
	const suits = ["♤", "♡", "♢", "♧"];
	const faces = ['Jack', 'Queen', 'King'];
	const hitWords = ['hit', 'h'];
	const standWords = ['stand', 's'];

	if (!args[0]) return message.channel.send('**Please Enter Your Deck Amount!**')
	let deckCount = parseInt(args[0])
	if (isNaN(args[0])) return message.channel.send('**Please Enter A Number!**')
	if (deckCount <= 0 || deckCount >= 9) return message.channel.send("**Please Enter A Number Between 1 - 8!**")

	let user = message.author;
	let bal = await connect.fetch("currency", message.author.id)
	bal = bal.amountw
	if (await connect.fetch("currency", user.id) === null) {
		await connect.add("currency", user.id, 0, 0)
	}
	if (!args[1]) return message.channel.send("**Please Enter Your Bet!**")

	let amount = parseInt(args[1])
	if (isNaN(args[1])) return message.channel.send("**Please Enter A Number**")
	if (amount > 10000) return message.channel.send("**Cannot Place Bet More Than \`$10,000\`**")
	if (amount < 1000) return message.channel.send("**Cannot Place Bet Less Than \`$1,000\`. sry not sry**")

	if (bal < amount) return message.channel.send("**You Are Betting More Than You Have!**")
	const current = ops.games.get(message.channel.id);
	if (current) return message.channel.send(`**Please Wait Until The Current Game Of \`${current.name}\` Is Finished!**`);
	try {
		ops.games.set(message.channel.id, { name: 'blackjack', data: generateDeck(deckCount) });
		const dealerHand = [];
		draw(message.channel, dealerHand);
		draw(message.channel, dealerHand);
		const playerHand = [];
		draw(message.channel, playerHand);
		draw(message.channel, playerHand);
		const dealerInitialTotal = calculate(dealerHand);
		const playerInitialTotal = calculate(playerHand);

		if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
			ops.games.delete(message.channel.id);
			return message.channel.send('**Both Of You Just Hit Blackjack!**');
		} else if (dealerInitialTotal === 21) {
			ops.games.delete(message.channel.id);
			await connect.update(`currency`, message.author.id, parseInt(bal - amount));
			return message.channel.send(`**The Dealer Hit Blackjack Right Away!\nNew Balance - **\` ${bal - amount}\``);
		} else if (playerInitialTotal === 21) {
			ops.games.delete(message.channel.id);
			await connect.update(`currency`, message.author.id, parseInt(bal) + parseInt(amount));
			return message.channel.send(`**You Hit Blackjack Right Away!\nNew Balance -**\`${bal + amount}\``);
		}

		let playerTurn = true;
		let win = false;
		let reason;
		while (!win) {
			if (playerTurn) {
				await message.channel.send(
					new Discord.MessageEmbed()
						.setColor("#000000")
						.setAuthor(message.author.tag, message.author.avatarURL())
						.setDescription(
							`**Dealer's First Card -** ${dealerHand[0].display}\n\n**You [${calculate(playerHand)}] -** ${playerHand.map(card => card.display).join(' | ')}`
						)
						.setFooter("[Hit / Stand]")
						.setThumbnail(message.guild.iconURL())
						.setTitle("Blackjack")
				);

				const hit = await verify(message.channel, message.author, { extraYes: hitWords, extraNo: standWords });
				if (hit) {
					const card = draw(message.channel, playerHand);
					const total = calculate(playerHand);
					if (total > 21) {
						reason = `You Drew ${card.display}, Total Of ${total}! Bust`;
						break;
					} else if (total === 21) {
						reason = `You Drew ${card.display} And Hit 21!`;
						win = true;
					}
				} else {
					const dealerTotal = calculate(dealerHand);
					await message.channel.send(`**Second Dealer Card Is ${dealerHand[1].display}, Total Of ${dealerTotal}!**`);
					playerTurn = false;
				}
			} else {
				const inital = calculate(dealerHand);
				let card;
				if (inital < 17) card = draw(message.channel, dealerHand);
				const total = calculate(dealerHand);
				if (total > 21) {
					reason = `Dealer Drew ${card.display}, Total Of ${total}! Dealer Bust`;
					win = true;
				} else if (total >= 17) {
					const playerTotal = calculate(playerHand);
					if (total === playerTotal) {
						reason = `${card ? `Dealer Drew ${card.display}, Making It ` : ''}${playerTotal}-${total}`;
						break;
					} else if (total > playerTotal) {
						reason = `${card ? `Dealer Drew ${card.display}, Making It ` : ''}${playerTotal}-\`${total}\``;
						break;
					} else {
						reason = `${card ? `Dealer Drew ${card.display}, Making It ` : ''}\`${playerTotal}\`-${total}`;
						win = true;
					}
				} else {
					await message.channel.send(`**Dealer Drew ${card.display}, Total Of ${total}!**`);
				}
			}
		}
		//db.add(`games_${user.id}`, 1) | InimicalPart Note: commented because i dont see why it is neccesary. -: Ray Note: i mean because of the database change i dont think it will matter but it was for profile stats.
		ops.games.delete(message.channel.id);
		if (win) {
			db.add(`money_${user.id}`, amount);
			return message.channel.send(`**${reason}, You Won ${amount}!**`);
		} else {
			db.subtract(`money_${user.id}`, amount);
			return message.channel.send(`**${reason}, You Lost ${amount}!**`);
		}
	} catch (err) {
		ops.games.delete(message.channel.id);
		throw err;
	}

	function generateDeck(deckCount) {
		const deck = [];
		for (let i = 0; i < deckCount; i++) {
			for (const suit of suits) {
				deck.push({
					value: 11,
					display: `${suit} Ace!`
				});
				for (let j = 2; j <= 10; j++) {
					deck.push({
						value: j,
						display: `${suit} ${j}`
					});
				}
				for (const face of faces) {
					deck.push({
						value: 10,
						display: `${suit} ${face}`
					});
				}
			}
		}
		return shuffle(deck);
	}

	function draw(channel, hand) {
		const deck = ops.games.get(channel.id).data;
		const card = deck[0];
		deck.shift();
		hand.push(card);
		return card;
	}

	function calculate(hand) {
		return hand.sort((a, b) => a.value - b.value).reduce((a, b) => {
			let { value } = b;
			if (value === 11 && a + value > 21) value = 1;
			return a + value;
		}, 0);
	}
	/*
	
	------------------------------USAGE----------------------------\\
	
	Initializor:
		const { connect } = require("../../../databasec")
		await connect()
		await connect.create("currency")
	
	
	Create a table in the database:
		await connect.create(table_name)
	
	
	Add a user to the money database:
		await connect.add("currency", message.author.id, 0, 0)
	
	Fetch a users information:
		const result = await connect.fetch("currency", message.author.id)
	
		result.id // the DB ID of the user
		result.userid // Discord User ID of the user
		result.amountw // Amount of money the user has in their wallet
		result.amountb // Amount of money the user has in their bank
	
	
	Update a users information:
		await connect.update("currency", message.author.id, new wallet, new bank)
	
		Update users new bank:
			await connect.update("currency", message.author.id, undefined, new bank)
	
		Update users new wallet:
			await connect.update("currency", message.author.id, new wallet)
	
	
	Remove a user from a table:
		await connect.remove("currency", message.author.id)
	
	
	Clear a users information from a table: // sets users wallet to 0 and bank to 0
		await connect.clear("currency", message.author.id)
	
	
	*/
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
	commandCategory
}


/* */
/* */
/* */ /* */ /* */ /* */ /* */ /* */
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
/* */ /* */ /* */ /* */ /* */ /* */ /* */