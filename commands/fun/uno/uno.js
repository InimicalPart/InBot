const commandInfo = {
  primaryName: "uno",
  // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["uno"],
  // These are all commands that will trigger this command.
  help: "Starts a game of UNO!",
  // This is the general description of the command.
  aliases: [],
  // These are command aliases that help.js will use
  usage: "[COMMAND] <required> [optional]",
  // [COMMAND] gets replaced with the command and correct prefix later
  category: "fun",
  slashCommand: null,
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdUno) {
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
  let UNOEngine = require("uno-engine-updated");
  let game;
  let joinedUsers = [];
  let userIds = [];
  let mergeImg = require("merge-img");
  let UNOFriendlyUsernames = [];

  let collector = null;
  let colorFix = {
    RED: 1,
    GREEN: 2,
    BLUE: 3,
    YELLOW: 4,
    1: "RED",
    2: "GREEN",
    3: "BLUE",
    4: "YELLOW",
  };
  let UNOCards = {
    // "BLUE"
    BLUE_ZERO: { img_path: "./assets/uno/blue0.png" },
    BLUE_ONE: { img_path: "./assets/uno/blue1.png" },
    BLUE_TWO: { img_path: "./assets/uno/blue2.png" },
    BLUE_THREE: { img_path: "./assets/uno/blue3.png" },
    BLUE_FOUR: { img_path: "./assets/uno/blue4.png" },
    BLUE_FIVE: { img_path: "./assets/uno/blue5.png" },
    BLUE_SIX: { img_path: "./assets/uno/blue6.png" },
    BLUE_SEVEN: { img_path: "./assets/uno/blue7.png" },
    BLUE_EIGHT: { img_path: "./assets/uno/blue8.png" },
    BLUE_NINE: { img_path: "./assets/uno/blue9.png" },
    BLUE_DRAW_TWO: { img_path: "./assets/uno/bluedrawtwo.png" },
    BLUE_REVERSE: { img_path: "./assets/uno/bluereverse.png" },
    BLUE_SKIP: { img_path: "./assets/uno/blueblock.png" },

    //   "GREEN"
    GREEN_ZERO: { img_path: "./assets/uno/green0.png" },
    GREEN_ONE: { img_path: "./assets/uno/green1.png" },
    GREEN_TWO: { img_path: "./assets/uno/green2.png" },
    GREEN_THREE: { img_path: "./assets/uno/green3.png" },
    GREEN_FOUR: { img_path: "./assets/uno/green4.png" },
    GREEN_FIVE: { img_path: "./assets/uno/green5.png" },
    GREEN_SIX: { img_path: "./assets/uno/green6.png" },
    GREEN_SEVEN: { img_path: "./assets/uno/green7.png" },
    GREEN_EIGHT: { img_path: "./assets/uno/green8.png" },
    GREEN_NINE: { img_path: "./assets/uno/green9.png" },
    GREEN_DRAW_TWO: { img_path: "./assets/uno/greendrawtwo.png" },
    GREEN_REVERSE: { img_path: "./assets/uno/greenreverse.png" },
    GREEN_SKIP: { img_path: "./assets/uno/greenblock.png" },

    //   "RED"
    RED_ZERO: { img_path: "./assets/uno/red0.png" },
    RED_ONE: { img_path: "./assets/uno/red1.png" },
    RED_TWO: { img_path: "./assets/uno/red2.png" },
    RED_THREE: { img_path: "./assets/uno/red3.png" },
    RED_FOUR: { img_path: "./assets/uno/red4.png" },
    RED_FIVE: { img_path: "./assets/uno/red5.png" },
    RED_SIX: { img_path: "./assets/uno/red6.png" },
    RED_SEVEN: { img_path: "./assets/uno/red7.png" },
    RED_EIGHT: { img_path: "./assets/uno/red8.png" },
    RED_NINE: { img_path: "./assets/uno/red9.png" },
    RED_DRAW_TWO: { img_path: "./assets/uno/reddrawtwo.png" },
    RED_REVERSE: { img_path: "./assets/uno/redreverse.png" },
    RED_SKIP: { img_path: "./assets/uno/redblock.png" },

    //   "YELLOW"
    YELLOW_ZERO: { img_path: "./assets/uno/yellow0.png" },
    YELLOW_ONE: { img_path: "./assets/uno/yellow1.png" },
    YELLOW_TWO: { img_path: "./assets/uno/yellow2.png" },
    YELLOW_THREE: { img_path: "./assets/uno/yellow3.png" },
    YELLOW_FOUR: { img_path: "./assets/uno/yellow4.png" },
    YELLOW_FIVE: { img_path: "./assets/uno/yellow5.png" },
    YELLOW_SIX: { img_path: "./assets/uno/yellow6.png" },
    YELLOW_SEVEN: { img_path: "./assets/uno/yellow7.png" },
    YELLOW_EIGHT: { img_path: "./assets/uno/yellow8.png" },
    YELLOW_NINE: { img_path: "./assets/uno/yellow9.png" },
    YELLOW_DRAW_TWO: { img_path: "./assets/uno/yellowdrawtwo.png" },
    YELLOW_REVERSE: { img_path: "./assets/uno/yellowreverse.png" },
    YELLOW_SKIP: { img_path: "./assets/uno/yellowblock.png" },

    // "OTHER"
    WILD: { img_path: "./assets/uno/wild.png" },
    RED_WILD: { img_path: "./assets/uno/red_wild.png" },
    BLUE_WILD: { img_path: "./assets/uno/blue_wild.png" },
    GREEN_WILD: { img_path: "./assets/uno/green_wild.png" },
    YELLOW_WILD: { img_path: "./assets/uno/yellow_wild.png" },
    WILD_DRAW_FOUR: { img_path: "./assets/uno/draw4.png" },
    RED_WILD_DRAW_FOUR: { img_path: "./assets/uno/red_draw4.png" },
    BLUE_WILD_DRAW_FOUR: { img_path: "./assets/uno/blue_draw4.png" },
    GREEN_WILD_DRAW_FOUR: { img_path: "./assets/uno/green_draw4.png" },
    YELLOW_WILD_DRAW_FOUR: { img_path: "./assets/uno/yellow_draw4.png" },
  };

  let waitingTime = 15000;
  let disableOnNotYourTurn = true;
  let showOnlyPlayableCards = true;
  let lastDraw = 0;
  if (global.UNOList.includes(message.author.id)) {
    message.channel.send(
      `You already have a game in progress. Please wait until it finishes.`
    );
    return;
  }
  //show settings using embed
  const embed = new RM.Discord.MessageEmbed()
    .setTitle("UNO Settings")
    .setDescription("Settings for UNO")
    .addField("Waiting Time", waitingTime / 1000 + " seconds")
    .addField("Disable buttons if not your turn", String(disableOnNotYourTurn))
    .addField("Show only playable cards", String(showOnlyPlayableCards));
  message.channel.send({ embeds: [embed] });
  // message collector
  const settingsCollector = message.channel.createMessageCollector(
    (msg) => msg.author.id === message.author.id
  );
  settingsCollector.on("collect", (msg) => {
    if (msg.content.toLowerCase() === "start") {
      settingsCollector.stop();
      //start game
      main();
    }
  });
  function main() {
    if (global.UNOList.includes(message.author.id)) {
      message.channel.send(
        `You already have a game in progress. Please wait until it finishes.`
      );
      return;
    }
    global.UNOList.push(message.author.id);
    let startingMessage =
      "**" +
      message.author.username +
      "#" +
      message.author.discriminator +
      "** is starting a game of uno!\n" +
      "React with '🚪' to join the game.";
    message.channel
      .send({
        content: startingMessage,
      })
      .then(async (m) => {
        await m.react("🚪");

        let dc = require("discord.js");
        let reactionCollector = new dc.ReactionCollector(m, {
          filter: (reaction, user) =>
            reaction.emoji.name === "🚪" &&
            user.id !== message.author.id &&
            !global.UNOList.includes(user.id) &&
            !user.bot,
          idle: 15000,
          time: 15000,
          maxUsers: 9,
          dispose: true,
        });
        /* prettier-ignore */
        setTimeout((()=>{m.edit({content:startingMessage+"\n\n:clock1:  *Starting in 5*"}),setTimeout((()=>{m.edit({content:startingMessage+"\n\n:clock1:  *Starting in 4*"}),setTimeout((()=>{m.edit({content:startingMessage+"\n\n:clock1:  *Starting in 3*"}),setTimeout((()=>{m.edit({content:startingMessage+"\n\n:clock1:  *Starting in 2*"}),setTimeout((()=>{m.edit({content:startingMessage+"\n\n:clock1:  *Starting in 1*"}),setTimeout((()=>{m.edit({content:startingMessage+"\n\n:clock1:  *Starting now!*"})}),1e3)}),1e3)}),1e3)}),1e3)}),1e3)}),waitingTime-5e3);
        reactionCollector.on("collect", (reaction, user) => {
          message.channel.send({
            content:
              "**" +
              user.username +
              "#" +
              user.discriminator +
              "** joined the game!",
          });
        });
        reactionCollector.on("end", (collected) => {
          joinedUsers.push(message.author);
          collected = collected.map((reaction) => {
            (user) =>
              reaction.users.cache.filter(
                user.id !== message.author.id && user.id !== RM.client.user.id
              );
            console.log(typeof reaction.users.cache);
            //use reaction.users.cache.values() to get the user objects into joinedUsers
            reaction.users.cache.forEach((user) => {
              if (
                user.id !== RM.client.user.id &&
                user.id !== message.author.id
              ) {
                joinedUsers.push(user);
              }
            });
          });
          console.log(joinedUsers);
          if (joinedUsers.length < 2) {
            global.UNOList.splice(global.UNOList.indexOf(message.author.id), 1);
            return message.channel.send({
              embeds: [
                new RM.Discord.MessageEmbed()
                  .setColor("RED")
                  .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.avatarURL(),
                  })
                  .setDescription("Not enough players to start game.")
                  .setThumbnail(message.guild.iconURL())
                  .setTitle("Not Enough Players"),
              ],
            });
          }
          userIds = joinedUsers.map((user) => user.id);
          startGame();
        });
        reactionCollector.on("remove", (_reaction, user) => {
          message.channel.send({
            content:
              "**" +
              user.username +
              "#" +
              user.discriminator +
              "** left the game!",
          });
        });
      });
    async function startGame() {
      for (let i = 0; i < userIds.length; i++) {
        global.UNOList.push(userIds[i]);
      }

      message.channel.send({
        content: "Starting game with **" + joinedUsers.length + "** players",
      });
      console.log("Fixing valid names for UNO");
      for (let i = 0; i < joinedUsers.length; i++) {
        UNOFriendlyUsernames.push(
          joinedUsers[i].username + "#" + joinedUsers[i].discriminator
        );
      }
      console.log("Setting up UNO game");
      // const customRules = [];
      game = new UNOEngine.Game(UNOFriendlyUsernames);
      console.log(game);
      console.log("Setting up message listener");
      collector = message.channel.createMessageCollector((m) =>
        userIds.includes(m.author.id)
      );
      console.log("Creating cards button");
      let messageComponents = new RM.Discord.MessageActionRow().addComponents(
        new RM.Discord.MessageButton()
          .setLabel("Your Cards")
          .setStyle("PRIMARY")
          .setCustomId("getCards")
      );
      console.log("Setting up message component listener..");
      let componentFilter = (component) => {
        return userIds.includes(component.user.id);
      };
      let componmentCollector =
        await message.channel.createMessageComponentCollector({
          filter: componentFilter,
        });
      componmentCollector.on("collect", async (component) => {
        if (component.customId === "getCards") {
          let cardsText;
          if (showOnlyPlayableCards)
            cardsText = convertToWords(
              removeUnPlayableCards(
                game.getPlayer(getUserUNOUsername(component.user)).hand,
                game.discardedCard
              )
            );
          else
            cardsText = convertToWords(
              game.getPlayer(getUserUNOUsername(component.user)).hand
            );

          let cards = await getCards(
            game.getPlayer(getUserUNOUsername(component.user)),
            10
          );
          console.log("cards retuerned");
          let redE,
            greenE,
            blueE,
            yellowE,
            specialE = false;
          console.log(cardsText);
          for (let i = 0; i < cardsText.length; i++) {
            if (!cardsText[i].color) specialE = true;
            else if (cardsText[i]?.color?.toLowerCase() === "green")
              greenE = true;
            else if (cardsText[i]?.color?.toLowerCase() === "red") redE = true;
            else if (cardsText[i]?.color?.toLowerCase() === "blue")
              blueE = true;
            else if (cardsText[i]?.color?.toLowerCase() === "yellow")
              yellowE = true;
          }
          //TODO: show only buttons that match the cards that user has
          let row = new RM.Discord.MessageActionRow();
          let row2 = new RM.Discord.MessageActionRow();
          if (redE)
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("RED")
                .setStyle("SECONDARY")
                .setCustomId("red_cards")
            );
          if (greenE)
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("GREEN")
                .setStyle("SECONDARY")
                .setCustomId("green_cards")
            );
          if (blueE)
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("BLUE")
                .setStyle("SECONDARY")
                .setCustomId("blue_cards")
            );
          if (yellowE)
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("YELLOW")
                .setStyle("SECONDARY")
                .setCustomId("yellow_cards")
            );
          if (specialE)
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("SPECIAL")
                .setStyle("SECONDARY")
                .setCustomId("special_cards")
            );

          // or should we add logic, as in why show all the buttons if its a red card and they only have one red card. yk like they either pick up or play red look here
          let pickupBtn = new RM.Discord.MessageButton()
            .setLabel("PICKUP")
            .setStyle("PRIMARY")
            .setCustomId("pickup");
          if (!checkTurn(component.user)) {
            pickupBtn.setDisabled(true);
          }
          if (!specialE && !greenE && !redE && !blueE && !yellowE)
            row.addComponents(pickupBtn);
          else row2.addComponents(pickupBtn);
          let components = [row];
          if (row2.components.length > 0) components.push(row2);

          component.reply({
            content:
              "The discarded card is a **" +
              convertToWords(game.discardedCard, true) +
              "**",
            files: cards,
            ephemeral: true,
            components: components,
          });
        } else if (component.customId.endsWith("_cards")) {
          // console.log(component.customId + " clicked");
          // console.log(component);
          console.log(
            RM.chalk.white.bold(component.user.username) +
              " clicked " +
              component.customId
          );

          let cards = await getCards(
            game.getPlayer(getUserUNOUsername(component.user)),
            10
          );
          let components = await showWhatUserHas(
            component.user,
            component.customId.replace("_cards", "")
          );
          component.reply({
            content:
              "The discarded card is a **" +
              convertToWords(game.discardedCard, true) +
              "**",

            files: cards,
            ephemeral: true,
            components: components,
          });
        }
        //!--------------------------------------[UNO LOGIC]--------------------------------------!\\
        else if (component.customId === "pickup") {
          if (!checkTurn(component.user)) {
            return component.reply({
              content: "It's not your turn!",
              ephemeral: true,
            });
          }
          let player = game.currentPlayer;
          game.draw(player);
          try {
            game.pass();
          } catch (e) {
            console.log(e);
          }
          let newHand = player.hand;
          let drawnCard = newHand[newHand.length - 1];
          let drawnCardImg = await getCards(player, 10, [drawnCard]);
          component.reply({
            content: "You drew:",
            files: drawnCardImg,
            ephemeral: true,
          });
        } else if (component.customId.startsWith("play_card")) {
          if (!checkTurn(component.user)) {
            return component.reply({
              content: "It's not your turn!",
              ephemeral: true,
            });
          }
          if (component.customId.split("_")[2] === "wild") {
            if (!checkTurn(component.user)) {
              return component.reply({
                content: "It's not your turn!",
                ephemeral: true,
              });
            }

            //ask player about the color
            let row = new RM.Discord.MessageActionRow();
            let type = "";
            let type2 = "";
            if (component.customId == "play_card_wild_draw4") {
              type = "_draw4";
              type2 = "WILD_DRAW_FOUR";
            }
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("RED")
                .setStyle("SECONDARY")
                .setCustomId("wild_red" + type)
            );
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("GREEN")
                .setStyle("SECONDARY")
                .setCustomId("wild_green" + type)
            );
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("BLUE")
                .setStyle("SECONDARY")
                .setCustomId("wild_blue" + type)
            );
            row.addComponents(
              new RM.Discord.MessageButton()
                .setLabel("YELLOW")
                .setStyle("SECONDARY")
                .setCustomId("wild_yellow" + type)
            );
            component.reply({
              content: "Choose a color:",
              files: [
                convertToImg(
                  new UNOEngine.Card(UNOEngine.Values[type2 || "WILD"])
                ),
              ],
              components: [row],
              ephemeral: true,
            });
          } else {
            let color = component.customId.split("_")[2].toUpperCase();
            let value = convertNumToVal(
              parseInt(component.customId.split("_")[3])
            ).toUpperCase();
            let player = game.getPlayer(getUserUNOUsername(component.user));
            console.log(player.hand);
            console.log(color, value);
            console.log(
              new UNOEngine.Card(
                UNOEngine.Values[value],
                UNOEngine.Colors[color]
              )
            );
            console.log(
              new UNOEngine.Card(UNOEngine.Values[value], colorFix[color])
            );
            console.log(
              player.hasCard(
                new UNOEngine.Card(
                  UNOEngine.Values[value],
                  UNOEngine.Colors[color]
                )
              )
            );
            console.log(
              player.hasCard(
                new UNOEngine.Card(UNOEngine.Values[value], colorFix[color])
              )
            );
            let card = player.hasCard(
              new UNOEngine.Card(UNOEngine.Values[value], colorFix[color])
            )
              ? new UNOEngine.Card(UNOEngine.Values[value], colorFix[color])
              : null;
            if (card === null) {
              return component.reply({
                content: "You don't have that card!",
                ephemeral: true,
              });
            }
            game.play(card);
            component.deferUpdate();
          }
        } else if (component.customId.startsWith("wild_")) {
          if (!checkTurn(component.user)) {
            return component.reply({
              content: "It's not your turn!",
              ephemeral: true,
            });
          }
          let color = component.customId.split("_")[1].toUpperCase();
          let isDraw4 = component.customId.split("_")[2] === "draw4";
          let player = game.getPlayer(getUserUNOUsername(component.user));
          let card = player.getCardByValue(
            UNOEngine.Values["WILD" + (isDraw4 ? "_DRAW_FOUR" : "")]
          );
          console.log(card, "WILD" + (isDraw4 ? "_DRAW_FOUR" : ""), player);
          if (!card) {
            return component.reply({
              content: "You don't have that card!",
              ephemeral: true,
            });
          }
          card.color = colorFix[color.toUpperCase()];
          game.play(card);
          component.deferUpdate();
        } else {
          console.log(component.customId + " clicked");
          console.log(
            component.customId.split("_"),
            component.customId.split("_")[0]
          );
        }
        //!--------------------------------------[UNO LOGIC]--------------------------------------!\\
      });

      componmentCollector.on("end", () => {
        if (m) {
          m.edit({ components: [] });
        }
      });
      console.log("Setting up game listeners..");
      game.on("nextplayer", (data) => {
        let nextPlayer = data.player;
        let components = [];
        if (Math.abs(new Date().getTime() - lastDraw) < 500) {
          components.push(messageComponents);
        }
        let cardAmount = [];
        for (let i = 0; i < game.players.length; i++) {
          cardAmount.push(
            "**" +
              game.players[i].name +
              "** has **" +
              game.players[i].hand.length +
              "** cards"
          );
        }
        message.channel.send({
          content:
            `It's now **${nextPlayer.name}**'s turn!\n\n` +
            cardAmount.join("\n"),
          components: components,
        });
      });
      game.on("draw", (data) => {
        let amount =
          data.cards.length > 1 ? "**" + data.cards.length + "**" : "a";
        let plural = data.cards.length > 1 ? "s" : "";
        lastDraw = new Date().getTime();

        message.channel.send({
          content: `**${data.player.name}** drew ${amount} card${plural}!`,
        });
      });
      game.on("cardplay", (data) => {
        message.channel.send({
          content: `**${data.player.name}** played a **${convertToWords(
            data.card,
            true
          ).replace(/_/g, " ")}**`,
          files: [convertToImg(data.card)],
          components: [messageComponents],
        });
      });
      game.on("end", (data) => {
        let winner = data.winner;
        message.channel.send({
          content: `**${winner.name}** won the game! Score: ` + data.score,
        });
      });

      console.log("Announcing discarded card..");

      message.channel.send({
        content: "** " + game.currentPlayer.name + "**'s turn!",
        files: [convertToImg(game.discardedCard)],
        components: [messageComponents],
      });
      collector.on("collect", async (messageNext) => {
        const msg = messageNext.content.split(" ");
        if (msg[0] === "") {
        }
      });
      async function showWhatUserHas(user, color) {
        let cards;
        if (showOnlyPlayableCards)
          cards = convertToWords(
            removeUnPlayableCards(
              game.getPlayer(getUserUNOUsername(user)).hand,
              game.discardedCard
            )
          );
        else
          cards = convertToWords(game.getPlayer(getUserUNOUsername(user)).hand);

        let [row1, row2, row3] = [
          new RM.Discord.MessageActionRow(),
          new RM.Discord.MessageActionRow(),
          new RM.Discord.MessageActionRow(),
        ];
        let [row1Container, row2Container, row3Container] = [[], [], []];
        let cardsInOrder = [];
        let buttonStyle = "PRIMARY";
        if (color.toLowerCase() === "red") buttonStyle = "DANGER";
        else if (color.toLowerCase() === "green") buttonStyle = "SUCCESS";
        else if (color.toLowerCase() === "blue") buttonStyle = "PRIMARY";
        else if (
          color.toLowerCase() === "yellow" ||
          color.toLowerCase() === "special"
        )
          buttonStyle = "SECONDARY";

        //remove duplicates from cards
        console.log(cards);
        cards = cards.filter(
          (thing, index, self) =>
            index ===
            self.findIndex(
              (t) => t.value === thing.value && t.color === thing.color
            )
        );
        console.log(cards);
        for (let i = 0; i < cards.length; i++) {
          if (!cards[i].color && color.toUpperCase() === "SPECIAL")
            cardsInOrder.push(cards[i]);
          else if (cards[i].color === color.toUpperCase())
            cardsInOrder.push(cards[i]);
        }

        //   cardsInOrder.push({
        //     color: undefined,
        //     value: "pickup",
        //   });
        for (let i = 0; i < cardsInOrder.length; i++) {
          if (i < 5) {
            row1Container.push(cardsInOrder[i]);
          } else if (i < 10) {
            row2Container.push(cardsInOrder[i]);
          } else {
            row3Container.push(cardsInOrder[i]);
          }
        }
        console.log(row1Container, row2Container, row3Container);
        setValuesIntoContainer(row1Container, row1, buttonStyle, color, user);
        setValuesIntoContainer(row2Container, row2, buttonStyle, color, user);
        setValuesIntoContainer(row3Container, row3, buttonStyle, color, user);

        if (row1Container.length < 1) return []; // shouldnt happen
        else if (row2Container.length < 1) return [row1];
        else if (row3Container.length < 1) return [row1, row2];
        return [row1, row2, row3];
      }
      function checkTurn(user) {
        return game.currentPlayer.name === getUserUNOUsername(user);
      }
      function removeUnPlayableCards(cards, discardedCard) {
        let playableCards = [];
        // if the color or the value of the card is the same as the discarded card, it is playable
        for (let i = 0; i < cards.length; i++) {
          if (
            cards[i].color === discardedCard.color ||
            cards[i].value === discardedCard.value ||
            cards[i].color === undefined
          ) {
            playableCards.push(cards[i]);
          }
        }
        return playableCards;
      }
      function setValuesIntoContainer(
        container,
        row,
        buttonStyle,
        color,
        user
      ) {
        if (container.length < 1) return;
        for (let i = 0; i < container.length; i++) {
          if (convertValToNumber(container[i].value) < 10) {
            let btn = new RM.Discord.MessageButton()
              .setLabel(String(convertValToNumber(container[i].value)))
              .setStyle(buttonStyle)
              .setCustomId(
                "play_card_" +
                  color +
                  "_" +
                  convertValToNumber(container[i].value)
              );

            if (!checkTurn(user) && disableOnNotYourTurn) {
              btn.setDisabled(true);
            }
            row.addComponents(btn);
          } else {
            let label = "";
            let customId = "";
            if (convertValToNumber(container[i].value) === 10) label = "SKIP";
            else if (convertValToNumber(container[i].value) === 11)
              label = "REVERSE";
            else if (convertValToNumber(container[i].value) === 12)
              label = "DRAW TWO";
            else if (convertValToNumber(container[i].value) === 13) {
              label = "WILD";
              customId = "play_card_wild";
            } else if (convertValToNumber(container[i].value) === 14) {
              label = "DRAW FOUR";
              customId = "play_card_wild_draw4";
            }
            console.log(
              customId ||
                "play_card_" +
                  color +
                  "_" +
                  convertValToNumber(container[i].value)
            );
            let btn = new RM.Discord.MessageButton()
              .setLabel(label)
              .setStyle(buttonStyle)
              .setCustomId(
                customId ||
                  "play_card_" +
                    color.toLowerCase() +
                    "_" +
                    convertValToNumber(container[i].value)
              );
            if (!checkTurn(user) && disableOnNotYourTurn) {
              btn.setDisabled(true);
            }
            row.addComponents(btn);
          }
        }
      }

      function convertValToNumber(value) {
        value = value.toLowerCase();
        switch (value) {
          case "zero":
            return 0;
          case "one":
            return 1;
          case "two":
            return 2;
          case "three":
            return 3;
          case "four":
            return 4;
          case "five":
            return 5;
          case "six":
            return 6;
          case "seven":
            return 7;
          case "eight":
            return 8;
          case "nine":
            return 9;
          case "skip":
            return 10;
          case "reverse":
            return 11;
          case "draw_two":
            return 12;
          case "wild":
            return 13;
          case "wild_draw_four":
            return 14;
          case "pickup":
            return 15;
          default:
            return -1;
        }
      }
      function convertNumToVal(num) {
        switch (num) {
          case 0:
            return "zero";
          case 1:
            return "one";
          case 2:
            return "two";
          case 3:
            return "three";
          case 4:
            return "four";
          case 5:
            return "five";
          case 6:
            return "six";
          case 7:
            return "seven";
          case 8:
            return "eight";
          case 9:
            return "nine";
          case 10:
            return "skip";
          case 11:
            return "reverse";
          case 12:
            return "draw_two";
          case 13:
            return "wild";
          case 14:
            return "wild_draw_four";
          case 15:
            return "pickup";
          default:
            return -1;
        }
      }
      function getUserUNOUsername(user) {
        for (let index of joinedUsers) {
          if (
            index.id === user.id &&
            UNOFriendlyUsernames.includes(
              index.username + "#" + index.discriminator
            )
          ) {
            return index.username + "#" + index.discriminator;
          }
        }
        return null;
      }
      function sortCards(allCards) {
        for (let i = 0; i < allCards.length; i++) {
          let color = allCards[i].color || 5;
          let value = allCards[i].value;
          if (value > 9) {
            value = String(value).split("");
            value[0] = "9";
            value = value.join("_");
          }
          allCards[i].connected = color + "_" + value;
        }
        allCards.sort((a, b) => {
          if (a.connected < b.connected) return -1;
          if (a.connected > b.connected) return 1;
        });
        for (let i = 0; i < allCards.length; i++) {
          delete allCards[i].connected;
        }
        return allCards;
      }
      async function getCards(user, splitter = 10, hand) {
        return new Promise(async (resolve, _reject) => {
          let splitArr = splitCards(hand || user.hand, splitter);
          console.log(splitArr.length);
          let splitArrCopy = splitArr.slice();
          let finalImgArr = [];
          for (let i = 0; i < splitArr.length; i++) {
            console.log(splitArr.length, "loop " + i);
            console.log(splitArr[i]);
            let currentCardset = splitArr[i];
            //   if (currentCardset === undefined) {
            //     // console.log("Returning final images");
            //     return resolve(finalImgArr);
            //   }

            let cards =
              convertToImg(currentCardset); /* convert the cardset to images */
            if (!Array.isArray(cards)) {
              cards = [cards];
            }
            let img = await mergeImg(cards);
            let buffer = await getBuffer(img);
            finalImgArr.push(
              new RM.Discord.MessageAttachment(buffer, "cards.png")
            );
            console.log("Finished " + i);
          }
          console.log("Returning final images");
          return resolve(finalImgArr);
        });
      }
      async function getBuffer(img) {
        return new Promise((resolve, _reject) => {
          img.getBuffer(require("jimp").MIME_PNG, (err, buffer) => {
            if (err) {
              console.log(err);
            }
            console.log("got buffer");
            resolve(buffer);
          });
        });
      }
      function splitCards(arr, chunkSize) {
        arr = sortCards(arr);
        const res = []; // idk how to help lol
        for (let i = 0; i < arr.length; i += chunkSize) {
          const chunk = arr.slice(i, i + chunkSize);
          res.push(chunk);
        }
        return res;
      }

      function convertToImg(hand) {
        if (hand instanceof UNOEngine.Card) {
          let card = convertToWords(hand);
          if (!hand.color) {
            return UNOCards[card.value.replace(/ /g, "_")].img_path;
          }
          // console.log(
          //   UNOCards[card.color + "_" + card.value.replace(/ /g, "_")],
          //   card.color + "_" + card.value.replace(/ /g, "_"),
          //   card
          // );
          return UNOCards[card.color + "_" + card.value.replace(/ /g, "_")]
            .img_path;
        } else {
          let arr2 = [];
          let handWords = convertToWords(hand);
          handWords.forEach((card) => {
            if (!card.color) {
              // console.log(UNOCards[card.value.replace(/ /g, "_")], card);
              arr2.push(UNOCards[card.value.replace(/ /g, "_")].img_path);
            } else {
              // console.log(
              //   UNOCards[card.color + "_" + card.value.replace(/ /g, "_")],
              //   card
              // );
              arr2.push(
                UNOCards[card.color + "_" + card.value.replace(/ /g, "_")]
                  .img_path
              );
            }
          });
          return arr2;
        }
      }

      function convertToWords(handorcard, a) {
        //   console.log(handorcard);
        if (handorcard instanceof UNOEngine.Card) {
          if (!a)
            if (!handorcard.color)
              return {
                value: UNOEngine.Values[handorcard.value],
              };
            else {
              return {
                value: UNOEngine.Values[handorcard.value],
                color: colorFix[String(handorcard.color)],
              };
            }
          else if (!handorcard.color) return UNOEngine.Values[handorcard.value];
          return (
            colorFix[String(handorcard.color)] +
            " " +
            UNOEngine.Values[handorcard.value]
          );
        } else {
          let _arr = [];
          handorcard2 = sortCards(handorcard);
          handorcard2.forEach((card) => {
            if (!a)
              if (!card.color)
                _arr.push({
                  value: UNOEngine.Values[card.value],
                });
              else {
                _arr.push({
                  value: UNOEngine.Values[card.value],
                  color: colorFix[String(card.color)],
                });
              }
            else if (!card.color) _arr.push(UNOEngine.Values[card.value]);
            else {
              _arr.push(
                colorFix[String(card.color)] +
                  " " +
                  UNOEngine.Values[card.value]
              );
            }
          });
          if (!a) return _arr;
          return _arr.join(", ");
        }
      }
      function endCleanup() {
        // global.UNOList contains any ids from userIds, remove the ids from global.UNOList
        global.UNOList = global.UNOList.filter((id) => {
          return !userIds.includes(id);
        });
      }
    }
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
function getSlashCommand() {
  return commandInfo.slashCommand;
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
  getSlashCommandJSON,
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
