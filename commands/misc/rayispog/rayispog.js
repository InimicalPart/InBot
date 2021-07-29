const commandInfo = {
	primaryName: "rayispog", // This is the command name used by help.js (gets uppercased).
	possibleTriggers: ["rayispog", "rbj", "raysbj"], // These are all commands that will trigger this command.
	help: "Play a game of blackjack against the bot", // This is the general description pf the command.
	aliases: ["rbj", "raysbj"], // These are command aliases that help.js will use
	usage: "[COMMAND]", // [COMMAND] gets replaced with the command and correct prefix later
	category: "misc",
  };
  
  async function runCommand(message, args, RM) {
	//Check if command is disabled
	if (!require("../../../config.js").cmdRayispog) {
	  return message.channel.send(
		new RM.Discord.MessageEmbed()
		  .setColor("RED")
		  .setAuthor(message.author.tag, message.author.avatarURL())
		  .setDescription("Command disabled by Administrators.")
		  .setThumbnail(message.guild.iconURL())
		  .setTitle("Command Disabled")
	  );
	}
  
	const queue2 = global.sQueue2;
	const queue3 = global.sQueue3;
	const queue = global.sQueue;
	const games = global.games;
  
	let ops = {
	  queue2: queue2,
	  queue: queue,
	  queue3: queue3,
	  games: games,
	};
  
	const { stripIndents } = RM.common; //change it to RM.common in index.js - done alr restart this beitch
	const { shuffle, verify } = require("../../../functions");
	const db = RM.db;
  
	const Discord = RM.Discord;
	const client = RM.client;
	const suits = ["♠", "♥", "♦", "♣"];
	const faces = ["J", "Q", "K"];
	const hitWords = ["hit", "h"];
	const standWords = ["stand", "s"];
  
	//if (!args[0]) return message.channel.send('**Please Enter Your Deck Amount!**')
	//let deckCount = a random number from 1 - 8
	let deckCount = Math.floor(Math.random() * 8) + 1;
	//let deckCount = parseInt(args[0])
	//if (isNaN(args[0])) return message.channel.send('**Please Enter A Number!**')
	// if (deckCount <= 0 || deckCount >= 9) return message.channel.send("**Please Enter A Number Between 1 - 8!**")
  
	let user = message.author;
	const newProfile = {
		userID: user.id,
		username: message.author.tag,
	  };
	  const profile = await client.getProfile(user).catch((err) => {
		console.log("^^");
	  });
  
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
		);
	  }
  
	  const bal = parseInt(profile.coins);	
	if (!args[0])
	  return message.channel.send(
		new Discord.MessageEmbed()
		  .setColor("RED")
		  .setAuthor(message.author.tag, message.author.avatarURL())
		  .setDescription("**Please Enter Your Bet!**")
		  .setThumbnail(message.guild.iconURL())
		  .setTitle("Error")
	  );
  
	let amount = parseInt(args[0]);
	if (isNaN(args[0]))
	  return message.channel.send(
		new Discord.MessageEmbed()
		  .setColor("RED")
		  .setAuthor(message.author.tag, message.author.avatarURL())
		  .setDescription("**Please Enter A Number!**")
		  .setThumbnail(message.guild.iconURL())
		  .setTitle("Error")
	  );
  
	  //add a random little multiplier to the amount
	  let multi = Math.ceil(amount * (Math.random() + 0.35) + amount);
	  let advamount = amount // with , every 3 digits
	  let winnings = multi;  // with , every 3 digits
	  let newBal = bal + multi; // with , every 3 digits
	  let newBal2 = bal - amount // with , every 3 digits
  
	  if (newBal.toString().length > 3) {
		newBal = newBal.toString().split("").reverse().join("").match(/.{1,3}/g).join(",").split("").reverse().join("");
	  }
	  if (newBal2.toString().length > 3) {
		newBal2 = newBal2.toString().split("").reverse().join("").match(/.{1,3}/g).join(",").split("").reverse().join("");
	  }
	  if (advamount.toString().length > 3) {
		advamount = advamount.toString().split("").reverse().join("").match(/.{1,3}/g).join(",").split("").reverse().join("");
	  }
	  if (winnings.toString().length > 3) {
		  winnings = winnings.toString().split("").reverse().join("").match(/.{1,3}/g).join(",").split("").reverse().join("");
	  }

  
  
  
	if (amount > 10000)
	  return message.channel.send(
		new Discord.MessageEmbed()
		  .setColor("RED")
		  .setAuthor(message.author.tag, message.author.avatarURL())
		  .setDescription(
			"**Please Enter A Number Less Than Or Equal To 10,000!**"
		  )
		  .setThumbnail(message.guild.iconURL())
		  .setTitle("Error")
	  );
	if (amount < 1000)
	  return message.channel.send(
		new Discord.MessageEmbed()
		  .setColor("RED")
		  .setAuthor(message.author.tag, message.author.avatarURL())
		  .setDescription("**Please Enter A Bet Between `$1,000 - $10,000`**")
		  .setThumbnail(message.guild.iconURL())
		  .setTitle("Error")
	  );
  
	if (bal < amount)
	  return message.channel.send(
		new Discord.MessageEmbed()
		  .setColor("RED")
		  .setAuthor(message.author.tag, message.author.avatarURL())
		  .setDescription("**You Don't Have `$" + amount + "` In Your Balance!**")
		  .setThumbnail(message.guild.iconURL())
		  .setTitle("Error")
	  );
	const current = ops.games.get(message.channel.id);
	if (current)
	  return message.channel.send(
		new Discord.MessageEmbed()
		  .setColor("RED")
		  .setAuthor(message.author.tag, message.author.avatarURL())
		  .setDescription(
			`**Please Wait Until The Current Game Of \`${current.name}\` Is Finished!**`
		  )
		  .setThumbnail(message.guild.iconURL())
		  .setTitle("Error")
	  );
	try {
	  ops.games.set(message.channel.id, {
		name: "blackjack",
		data: generateDeck(deckCount),
	  });
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
		return message.channel.send(
		  new Discord.MessageEmbed()
			.setColor("WHITE")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription("You tied with your opponent!")
			.setThumbnail(message.guild.iconURL())
			.setTitle("DRAW")
		);
	  } else if (dealerInitialTotal === 21) {
		ops.games.delete(message.channel.id);
		await client.updateProfile(user, { coins: bal - amount });
		return message.channel.send(
		  new Discord.MessageEmbed()
			.setColor("RED")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
			  `**The Dealer Hit Blackjack Right Away!\nNew Balance - **\` ${newBal2}\``
			)
			.setThumbnail(message.guild.iconURL())
			.setTitle("You Lost!")
		);
	  } else if (playerInitialTotal === 21) {
		ops.games.delete(message.channel.id);
		await client.updateProfile(user, { coins: bal + multi });
		return message.channel.send(
		  new Discord.MessageEmbed()
			.setColor("GREEN")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setDescription(
			  `**You Hit Blackjack Right Away!\nNew Balance - **⍟${newBal}`
			)
			.setThumbnail(message.guild.iconURL())
			.setTitle("YOU WON")
		);
	  }
  
	  let playerTurn = true;
	  let win = false;
	  let reason;
	  while (!win) {
		if (playerTurn) {
		  await message.channel.send("What do you want to do?\nType \`h\` to **hit** or type \`s\` to **stand**",
			new Discord.MessageEmbed()
			  .setColor("#000000")
			  .addFields(
				{
				  name: `**${message.author.username}**`,
				  value: `Cards - ${playerHand.map((card) => `[\`${card.display}\`](https://google.com)`).join('  ')}\nTotal - \`${calculate(playerHand)}\``,
				  inline: true,
				},
  
				{
				  name: "\u200B",
				  value: "\u200B",
				  inline: true,
				},
  
				{
				  name: `**The III Project**`,
				  value: `Cards - [**\`${dealerHand[0].display}\`**](https://google.com/) \`?\`\nTotal - \`?\``,
				  inline: true,
				}
			  )
			  .setFooter("K, Q, J = 10  |  A = 1 or 11")
			  .setAuthor(
				`${message.author.username}'s blackjack game`,
				message.author.avatarURL()
			  )
		  );
  
		  const hit = await verify(message.channel, message.author, {
			extraYes: hitWords,
			extraNo: standWords,
		  });
		  if (hit) {
			const card = draw(message.channel, playerHand);
			const total = calculate(playerHand);
			if (total > 21) {
			  reason = `Busted!`;
			  break;
			} else if (total === 21) {
			  reason = `You reached 21 before your opponent`;
			  win = true;
			}
		  } else {
			// const dealerTotal = calculate(dealerHand);
			//await message.channel.send(
		  //    `**Dealer's Second Card Is ${dealerHand[1].display}, Total Of ${dealerTotal}!**`
			//);
			playerTurn = false;
		  }
		} else {
		  const inital = calculate(dealerHand);
		  let card;
		  if (inital < 17) card = draw(message.channel, dealerHand);
		  const total = calculate(dealerHand);
		  if (total > 21) {
			reason = `Your opponent busted!`;
			win = true;
		  } else if (total >= 17) {
			const playerTotal = calculate(playerHand);
			if (total === playerTotal) {
			  reason = `You tied with your opponent! Im taking the bet cuz i look hotter fuck you.`;
			  break;
			} else if (total > playerTotal) {
			  reason = `${
				card ? `You have ` : ""
			  }${playerTotal}, Dealer has ${total}.`;
			  break;
			} else {
				reason = `${
					card ? `You have ` : ""
				  }${playerTotal}, Dealer has ${total}.`;
			  win = true;
			}
		  } else {
			await new Discord.MessageEmbed()
				.setColor("RED")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					`**Dealer Drew [\`${card.display}\`](https://google.com), Total Of ${total}!**`
				)
				.setThumbnail(message.guild.iconURL())
				.setTitle("Dealers Second Card")
			.setFooter(`${message.author.username}'s blackjack game`)
			.setTimestamp()
			.setURL(message.channel.id)
			}
		  }
		}
	  db.add(`games_${user.id}`, 1);
	  ops.games.delete(message.channel.id);
	  if (win) {
		await client.updateProfile(user, { coins: bal + multi });
		return message.channel.send(
			new Discord.MessageEmbed()
				 .setColor("GREEN")
			  .setAuthor(`${message.author.username}'s blackjack game`, message.author.avatarURL())
			  .setDescription(
				  `**You Win! ${reason} **\nYou won **⍟ ${winnings}**. You now have ⍟ ${newBal}`
			  )
			  .addFields(
				  {
					name: `**${message.author.username}**`,
					value: `Cards - ${playerHand.map((card) => `[\`${card.display}\`](https://google.com)`).join('  ')}\nTotal - \`${calculate(playerHand)}\``,
					inline: true,
				  },
	
				  {
					name: `**The III Project**`,
					value: `Cards - ${dealerHand.map((card) => `[\`${card.display}\`](https://google.com)`).join('  ')}\nTotal - \`${calculate(dealerHand)}\``,
					inline: true,
				  }
				)
			  );
	  } else {
		await client.updateProfile(user, { coins: bal - amount });
		return message.channel.send(
		  new Discord.MessageEmbed()
			.setColor("RED")
			.setAuthor(`${message.author.username}'s blackjack game`, message.author.avatarURL())
			.setDescription(
			  `**You Lose! ${reason} **\nYou lost **⍟ ${advamount}**. You now have ⍟ ${newBal2}`
			)
			.addFields(
			  { 
				name: `**${message.author.username}**`,
				value: `Cards - ${playerHand.map((card) => `[\`${card.display}\`](https://google.com)`).join('  ')}\nTotal - \`${calculate(playerHand)}\``,
				inline: true,
			  },
		   
			  {
				name: `**The III Project**`,
				value: `Cards - ${dealerHand.map((card) => `[\`${card.display}\`](https://google.com)`).join('  ')}\nTotal - \`${calculate(dealerHand)}\``,
				inline: true,
			  }
			)
		);
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
			display: `${suit} A`,
		  });
		  for (let j = 2; j <= 10; j++) {
			deck.push({
			  value: j,
			  display: `${suit} ${j}`,
			});
		  }
		  for (const face of faces) {
			deck.push({
			  value: 10,
			  display: `${suit} ${face}`,
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
	  return hand
		.sort((a, b) => a.value - b.value)
		.reduce((a, b) => {
		  let { value } = b;
		  if (value === 11 && a + value > 21) value = 1;
		  return a + value;
		}, 0);
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
  