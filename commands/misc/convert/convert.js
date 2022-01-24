const commandInfo = {
  primaryName: "convert", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["convert", "cv", "conv"], // These are all commands that will trigger this command.
  help: "Convert currencies!", // This is the general description of the command.
  aliases: ["cv", "conv"], // These are command aliases that help.js will use
  usage: "[COMMAND] <amount> <from> to <to>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
};

async function runCommand(message, args, RM) {
  //Check if command is disabled
  if (!require("../../../config.js").cmdConvert) {
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
  /* prettier-ignore */
  let valid = ["AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BRL","BSD","BTC","BTN","BWP","BYN","BZD","CAD","CDF","CHF","CLF","CLP","CNH","CNY","COP","CRC","CUC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GGP","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","IMP","INR","IQD","IRR","ISK","JEP","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRO","MRU","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SLL","SOS","SRD","SSP","STD","STN","SVC","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","UYU","UZS","VES","VND","VUV","WST","XAF","XAG","XAU","XCD","XDR","XOF","XPD","XPF","XPT","YER","ZAR","ZMW","ZWL"]
  // https://api.exchangerate.host/convert?from=USD&to=BTC&amount=999999999999
  // we need a from currency, to currency and amount, if amount is not supplied, we will assume 1, if from is not supplied, we will assume USD
  // if to is not supplied, we will assume USD
  let amount = args[0];
  let from = args[1];
  let to = args[2];
  if (amount.toLowerCase() === "r") {
    return RM.request(
      {
        url:
          "https://api.exchangerate.host/convert?from=" +
          from.toUpperCase() +
          "&to=" +
          to.toUpperCase(),
        json: true,
      },
      function (error, response, body) {
        if (error) {
          message.channel.send({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("An error occured, please try again later.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Error"),
            ],
          });
        }
        message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("GREEN")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "The exchange rate from **" +
                  from.toUpperCase() +
                  "** to **" +
                  to.toUpperCase() +
                  "** is **" +
                  body.info.rate +
                  "**."
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Rate"),
          ],
        });
      }
    );
  }
  if (!from) {
    from = "USD";
  }
  if (!to) {
    to = "USD";
  }
  if (to.toLowerCase() === "to" || to.toLowerCase() === "->") {
    to = args[3];
  }
  if (!amount) {
    amount = 1;
  }
  // we need to make sure the currency is valid
  if (!valid.includes(from.toUpperCase())) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "Currency: **" +
              from.toUpperCase() +
              "** is not valid. (ERR_FROM_INV)"
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid Currency"),
      ],
    });
  }
  if (!valid.includes(to.toUpperCase())) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "Currency: **" + to.toUpperCase() + "** is not valid. (ERR_TO_INV)"
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid Currency"),
      ],
    });
  }
  // make a request to https://api.exchangerate.host/convert?from=USD&to=BTC&amount=999999999999 and set the proper values
  // we need to make sure the amount is a number
  if (isNaN(amount)) {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "Amount: **" + amount + "** is not a number. (ERR_AMOUNT_INV)"
          )
          .setThumbnail(message.guild.iconURL())
          .setTitle("Invalid Amount"),
      ],
    });
  }
  // use the request module which is RM.request to make a request to https://api.exchangerate.host/convert?from=USD&to=BTC&amount=999999999999
  // set the proper values
  RM.request(
    {
      url:
        "https://api.exchangerate.host/convert?from=" +
        from.toUpperCase() +
        "&to=" +
        to.toUpperCase() +
        "&amount=" +
        amount,
      json: true,
    },
    (error, response, body) => {
      // if there is an error, send a message to the channel
      if (error) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Error: " + error + " (ERR_REQ_ERR)")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Request Error"),
          ],
        });
      }
      // if the response is not 200, send a message to the channel
      //check if the response json has a result property
      if (!body.result) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Error: " + body.error + " (ERR_RES_ERR)")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Response Error"),
          ],
        });
      }
      //send the message to the channel about the conversion
      message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              "Conversion: **" +
                amount +
                " " +
                from.toUpperCase() +
                "** to **" +
                to.toUpperCase() +
                "** is **" +
                body.result +
                " " +
                to.toUpperCase() +
                "**"
            )
            .setThumbnail(message.guild.iconURL())
            .setTitle("Conversion"),
        ],
      });
    }
  );
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
