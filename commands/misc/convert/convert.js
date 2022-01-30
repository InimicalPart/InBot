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
  let convert = RM.CU;
  let momentTimestamp = require("moment-timezone");
  /* prettier-ignore */
  let currencies = ["AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BRL","BSD","BTC","BTN","BWP","BYN","BZD","CAD","CDF","CHF","CLF","CLP","CNH","CNY","COP","CRC","CUC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GGP","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","IMP","INR","IQD","IRR","ISK","JEP","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRO","MRU","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SLL","SOS","SRD","SSP","STD","STN","SVC","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","UYU","UZS","VES","VND","VUV","WST","XAF","XAG","XAU","XCD","XDR","XOF","XPD","XPF","XPT","YER","ZAR","ZMW","ZWL"]
  let units = [];
  let aUnits = convert().list();
  for (let unit of aUnits) {
    units.push(unit.singular.toUpperCase().replace(" ", "_"));
    units.push(unit.plural.toUpperCase().replace(" ", "_"));
    units.push(unit.abbr.toUpperCase().replace(" ", "_"));
  }
  let timeAbbreviations = [];
  let time = require("fs").readFileSync("./resources/timezones.json", "utf8");
  let setting;
  time = JSON.parse(time);
  for (let t of time) {
    timeAbbreviations.push(t.Abbreviation);
  }
  if (
    timeAbbreviations.includes(args[0]?.toUpperCase()) ||
    args[0]?.toLowerCase() == "ini" ||
    args[0]?.toLowerCase() == "ray" ||
    args[0]?.toLowerCase() == "space"
  ) {
    setting = "date";
  } else if (currencies.includes(args[1]?.toUpperCase())) {
    setting = "currency";
  } else if (units.includes(args[1]?.toUpperCase())) {
    setting = "unit";
  } else {
    return message.channel.send({
      embeds: [
        new RM.Discord.MessageEmbed()
          .setColor("RED")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setDescription(
            "I couldn't interpret what you were trying to convert. Please try again."
          )
          .setTitle("Invalid Conversion"),
      ],
    });
  }
  if (setting == "date") {
    function getFirstWeekDay(dateString, dayOfWeek) {
      var date = momentTimestamp(dateString, "YYYY-MM-DD");

      var day = date.day();
      var diffDays = 0;

      if (day > dayOfWeek) {
        diffDays = 7 - (day - dayOfWeek);
      } else {
        diffDays = dayOfWeek - day;
      }

      return date.add(diffDays, "day").format("YYYY-MM-DD");
    }
    function lastSunday(year, month) {
      var date = new Date(year, month, 1, 12);
      let weekday = date.getDay();
      let dayDiff = weekday === 0 ? 7 : weekday;
      let lastSunday = date.setDate(date.getDate() - dayDiff);
      return date.toDateString();
    }

    Date.prototype.stdTimezoneOffset = function () {
      var jan = new Date(this.getFullYear(), 0, 1);
      var jul = new Date(this.getFullYear(), 6, 1);
      return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };

    Date.prototype.isDstObserved = function () {
      return this.getTimezoneOffset() < this.stdTimezoneOffset();
    };
    function fixDate(UTCDate, offset) {
      var date = new Date(UTCDate);

      let offsetSplit = offset.split(":");
      let offsetHours = parseInt(offsetSplit[0]);
      let offsetMinutes = null;
      if (offsetSplit[1]) {
        offsetMinutes = parseInt(offsetSplit[1]);
        offsetHours = offsetHours * 60;
        // turn the minutes into negative if the hours is negative, then add the minutes to the hours
        offsetMinutes = offsetHours < 0 ? offsetMinutes * -1 : offsetMinutes;
        offsetMinutes = offsetHours + offsetMinutes;
      } else {
        offsetMinutes = offsetHours * 60;
      }
      date.setMinutes(date.getMinutes() + offsetMinutes);
      return date;
    }
    function checkAUSDaylight() {
      let startPrevYear = getFirstWeekDay(
        new Date().getFullYear() - 1 + "-10-01",
        7
      );
      let endThisYear = getFirstWeekDay(new Date().getFullYear() + "-04-01", 7);
      startPrevYear = new Date(startPrevYear);
      endThisYear = new Date(endThisYear);
      //check if the current date is between the start and end of daylight savings
      if (
        new Date().getTime() > startPrevYear.getTime() &&
        new Date().getTime() < endThisYear.getTime()
      ) {
        return true;
      }
      return false;
    }
    function checkEURDaylight() {
      let startPrevYear = lastSunday(new Date().getFullYear(), 3);
      let endThisYear = lastSunday(new Date().getFullYear(), 10);
      startPrevYear = new Date(startPrevYear);
      endThisYear = new Date(endThisYear);
      //check if the current date is between the start and end of daylight savings
      if (
        new Date().getTime() > startPrevYear.getTime() &&
        new Date().getTime() < endThisYear.getTime()
      ) {
        return true;
      }
      return false;
    }

    //   message.channel.send({
    //     content: timeAbbreviations.join(" "),
    //     split: true,
    //   });
    let wanted = args[0].toUpperCase();
    let simple = false;
    if (args[0].toLowerCase() == "space") {
      if (checkAUSDaylight()) {
        wanted = "AEDT";
      } else {
        wanted = "AEST";
      }
      simple = true;
    } else if (
      args[0].toLowerCase() == "ini" ||
      args[0].toLowerCase() == "ray"
    ) {
      if (checkEURDaylight()) {
        wanted = "CEST";
      } else {
        wanted = "CET";
      }
      simple = true;
    } else if (args[0].toLowerCase() == "lethal") {
      wanted = "UTC";
      simple = true;
    }
    if (timeAbbreviations.includes(wanted)) {
      for (let i of time) {
        if (i.Abbreviation == wanted) {
          wanted = i;
        }
      }
    } else {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription("Invalid timezone.")
            .setThumbnail(message.guild.iconURL())
            .setTitle("Invalid Timezone"),
        ],
      });
    }
    let dateNowUTC;
    if (args[1]) {
      // connect all args together except the first one
      dateNowUTC = args.slice(1).join(" ");
      dateNowUTC = new Date(dateNowUTC).toUTCString();
      if (dateNowUTC.toString() == "Invalid Date") {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Invalid date.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Date"),
          ],
        });
      }
    } else {
      dateNowUTC = new Date().toUTCString();
    }
    let hours = wanted.Offset.replace(" hours", "");
    let date = fixDate(dateNowUTC, hours);
    let off;
    if (wanted.Offset.includes("-")) {
      off = wanted.Offset.replace("-", "**-** ");
    } else {
      off = "**+** " + wanted.Offset;
    }
    if (!simple) {
      message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            //   .addField(
            //     "UTC Time",
            //     momentTimestamp(dateNowUTC)
            //       .tz("UTC")
            //       .format("ddd, MMM Do, YYYY \\at hh:mm:ss A")
            //   )
            .addField(
              wanted.Abbreviation + " Time",
              momentTimestamp(date)
                .tz("UTC")
                .format("ddd, MMM Do, YYYY \\at hh:mm:ss A")
            )
            .addField("Offset", off)
            .setTitle("Timezone"),
        ],
      });
    } else {
      message.channel.send({
        content:
          "The time for: **" +
          args[0].toUpperCase() + //.toLowerCase().charAt(0).toUpperCase() +
          //args[0].slice(1) +
          "** (Timezone: **" +
          wanted.Abbreviation +
          "**) is: **" +
          momentTimestamp(date)
            .tz("UTC")
            .format("ddd, MMM Do, YYYY \\at hh:mm:ss A") +
          "**",
        split: true,
      });
    }
  }
  if (setting == "currency") {
    let amount = args[0];
    let from = args[1];
    let to = args[2];
    if (amount.toLowerCase() === "r") {
      if (from === undefined) {
        from = "USD";
      }
      if (to === undefined) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a currency to convert to.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Parameters"),
          ],
        });
      }
      if (from === to) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("You cannot convert to the same currency.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Parameters"),
          ],
        });
      }
      if (currencies.includes(from.toUpperCase()) === false) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription(
                "Please specify a valid currency to convert from."
              )
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Parameters"),
          ],
        });
      }
      if (currencies.includes(to.toUpperCase()) === false) {
        return message.channel.send({
          embeds: [
            new RM.Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.avatarURL(),
              })
              .setDescription("Please specify a valid currency to convert to.")
              .setThumbnail(message.guild.iconURL())
              .setTitle("Invalid Parameters"),
          ],
        });
      }
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
    if (!currencies.includes(from.toUpperCase())) {
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
    if (!currencies.includes(to.toUpperCase())) {
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
                to.toUpperCase() +
                "** is not valid. (ERR_TO_INV)"
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
  if (setting === "unit") {
    //args 0 is amount, 1 is from, 2 is to,
    let amount = args[0];
    let from = args[1];
    let to = args[2];
    if (to === "to" || to === "->") {
      to = args[3];
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) === 0) {
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
    if (from && to) {
      let allUnits = convert().list();
      for (let unit of allUnits) {
        unitname = unit.singular;
        unitabbr = unit.abbr;
        unitplural = unit.plural;
        if (
          unitabbr.toLowerCase() === from.toLowerCase() ||
          unitname.toUpperCase() === from.toUpperCase() ||
          unitplural.toUpperCase() === from.toUpperCase()
        ) {
          from = unit.abbr;
        }
        if (
          unitabbr.toLowerCase() === to.toLowerCase() ||
          unitname.toUpperCase() === to.toUpperCase() ||
          unitplural.toUpperCase() === to.toUpperCase()
        ) {
          to = unit.abbr;
        }
      }
    }
    if (!from || !units.includes(from.toUpperCase())) {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              "Unit: **" +
                from.toLowerCase() +
                "** is not valid. (ERR_FROM_INV)"
            )
            .setTitle("Invalid Unit"),
        ],
      });
    }
    if (!to || !units.includes(to.toUpperCase())) {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              "Unit: **" + to.toLowerCase() + "** is not valid. (ERR_TO_INV)"
            )
            .setTitle("Invalid Unit"),
        ],
      });
    }
    // use convert function to convert the amount from the from unit to the to unit
    let result;
    try {
      result = convert(amount).from(from).to(to);
    } catch (e) {
      return message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              "Error: **" +
                from.toLowerCase() +
                "** to **" +
                to.toLowerCase() +
                "** is not a valid conversion. (ERR_CONV_INV)"
            )
            .setThumbnail(message.guild.iconURL())
            .setTitle("Invalid Conversion"),
        ],
      });
    }
    // send the message to the channel

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
              from +
              "** to **" +
              to +
              "** is **" +
              result.toFixed(5) +
              " " +
              to +
              "**"
          ) /*
          .addField(
            "From",
            "```js\n" + amount + " " + from.toUpperCase() + "```"
          )
          .addField(
            "To",
            "```js\n" + result.toFixed(5) + " " + to.toUpperCase() + "```"
          )
*/
          .setThumbnail(message.guild.iconURL())
          .setTitle("Conversion"),
      ],
    });
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
