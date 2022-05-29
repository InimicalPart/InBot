const commandInfo = {
  primaryName: "convert", // This is the command name used by help.js (gets uppercased).
  possibleTriggers: ["convert", "cv", "conv"], // These are all commands that will trigger this command.
  help: "Convert currencies!", // This is the general description of the command.
  aliases: ["cv", "conv"], // These are command aliases that help.js will use
  usage: "[COMMAND] <amount> <from> to <to>", // [COMMAND] gets replaced with the command and correct prefix later
  category: "misc",
  slashCommand: null,
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
  let organizedUnits = {};
  let aUnits = convert().list();
  for (let unit of aUnits) {
    units.push(unit.singular.toUpperCase().replace(/ /g, "_"));
    units.push(unit.plural.toUpperCase().replace(/ /g, "_"));
    units.push(unit.abbr.toUpperCase().replace(/ /g, "_"));
    organizedUnits[unit.abbr.toUpperCase().replace(/ /g, "_")] = [];
    organizedUnits[unit.abbr.toUpperCase().replace(/ /g, "_")].push(
      unit.singular.toUpperCase().replace(/ /g, "_")
    );
    organizedUnits[unit.abbr.toUpperCase().replace(/ /g, "_")].push(
      unit.plural.toUpperCase().replace(/ /g, "_")
    );
  }
  let timeAbbreviations = [];
  let time = require("fs").readFileSync("./assets/timezones.json", "utf8");
  let setting;
  time = JSON.parse(time);
  for (let t of time) {
    timeAbbreviations.push(t.Abbreviation);
  }
  if (
    timeAbbreviations.includes(args[0]?.toUpperCase()) ||
    args[0]?.toLowerCase() == "ini" ||
    args[0]?.toLowerCase() == "ray" ||
    args[0]?.toLowerCase() == "space" ||
    args[0]?.toLowerCase() == "lethal" ||
    args[0]?.toLowerCase() == "all"
  ) {
    setting = "date";
  } else if (currencies.includes(args[1]?.toUpperCase())) {
    setting = "currency";
  } else if (units.includes(args[1]?.toUpperCase())) {
    setting = "unit";
  } else if (args[0]?.toLowerCase() == "units") {
    let attachment = new RM.Discord.MessageAttachment(
      Buffer.from(JSON.stringify(organizedUnits, null, 2), "utf-8"),
      "list.json"
    );
    return message.channel.send({ files: [attachment] });
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
      date.setDate(date.getDate() - dayDiff);
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
    function flipVal(amount) {
      console.log(amount, amount * -1);
      if (amount === 0) {
        return amount;
      }
      return amount * -1;
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
    let wanted2 = null;
    let conv = false;
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
    } else if (args[0].toLowerCase() == "all") {
      wanted = [];
      names = ["ini", "ray", "space", "lethal"];
      if (checkEURDaylight()) {
        wanted.push("CEST");
      } else {
        wanted.push("CET");
      }
      if (checkAUSDaylight()) {
        wanted.push("AEDT");
      } else {
        wanted.push("AEST");
      }
      wanted.push("UTC");
    }
    if (!Array.isArray(wanted)) {
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
    } else {
      let timezones = [];
      for (let i of time) {
        if (wanted.includes(i.Abbreviation)) {
          if (i.Abbreviation == "CEST" || i.Abbreviation == "CET") {
            timezones.push(i);
          }
          timezones.push(i);
        }
      }
      wanted = timezones;
    }
    let dateNowUTC;
    if (args[1]) {
      // connect all args together except the first one
      if (timeAbbreviations.includes(args[1].toUpperCase())) {
        wanted2 = args[1].toUpperCase();
        for (let i of time) {
          if (i.Abbreviation == wanted2) {
            wanted2 = i;
          }
        }
        if (wanted2.Abbreviation === wanted.Abbreviation) {
          message.channel.send({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You can't use the same timezone.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Invalid Timezone"),
            ],
          });
          return;
        }
        if (!args[2]) {
          message.channel.send({
            embeds: [
              new RM.Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.author.tag,
                  iconURL: message.author.avatarURL(),
                })
                .setDescription("You need to specify a time.")
                .setThumbnail(message.guild.iconURL())
                .setTitle("Invalid Date"),
            ],
          });
          return;
        }
        //TODO: fix
        let date = new Date();
        //get the offset for wanted, then subtract it from the current time to get the UTC time, then add the offset of wanted2 to get the wanted time
        let fix1 = wanted.Offset.replace(" hours", "");
        let fix2 = wanted2.Offset.replace(" hours", "");
        let wOffset,
          w2Offset,
          minute1,
          minute2,
          hour1,
          hour2 = null;
        if (fix1.includes(":")) wOffset = fix1.split(":");
        else wOffset = fix1;
        if (fix2.includes(":")) w2Offset = fix2.split(":");
        else w2Offset = fix2;
        if (Array.isArray(wOffset)) {
          hour1 = parseInt(wOffset[0]);
          minute1 = parseInt(wOffset[1]);
        } else {
          hour1 = parseInt(wOffset);
          minute1 = 0;
        }
        if (Array.isArray(w2Offset)) {
          hour2 = parseInt(w2Offset[0]);
          minute2 = parseInt(w2Offset[1]);
        } else {
          hour2 = parseInt(w2Offset);
          minute2 = 0;
        }
        let offsetHours = parseInt(hour1);
        let offsetMinutes = parseInt(minute1);
        let w2OffsetHours = parseInt(hour2);
        let w2OffsetMinutes = parseInt(minute2);
        let offset = offsetHours * 60 + offsetMinutes;
        let w2OffsetTotal = w2OffsetHours * 60 + w2OffsetMinutes;
        offset = w2OffsetTotal - offset;
        //offset is in minutes
        date.setMinutes(date.getMinutes() + offset);
        dateNowUTC = date.toUTCString();
        console.log(offset, dateNowUTC);
        conv = true;
        //the time should be now in the timezone which is specified by wanted
      } else {
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
      }
    } else {
      dateNowUTC = new Date().toUTCString();
    }
    let hours,
      date,
      off = null;
    let final = [];
    let usedname = [];
    let name = "";
    if (Array.isArray(wanted)) {
      for (let one in wanted) {
        if (
          wanted[one].Abbreviation === "AEST" ||
          wanted[one].Abbreviation === "AEDT"
        ) {
          usedname.push("space");
          name = "space";
        } else if (wanted[one].Abbreviation == "UTC") {
          usedname.push("lethal");
          name = "lethal";
        } else if (
          wanted[one].Abbreviation == "CEST" ||
          wanted[one].Abbreviation == "CET"
        ) {
          if (usedname.includes("ini")) {
            usedname.push("ray");
            name = "ray";
          } else {
            usedname.push("ini");
            name = "ini";
          }
        }
        hours = wanted[one].Offset.replace(" hours", "");
        date = fixDate(dateNowUTC, hours);
        if (wanted[one].Offset.includes("-")) {
          off = wanted[one].Offset.replace("-", "**-** ");
        } else {
          off = "**+** " + wanted[one].Offset;
        }
        final.push({
          abbr: wanted[one].Abbreviation,
          offset: off,
          time: momentTimestamp(date)
            .tz("UTC")
            .format("ddd, MMM Do, YYYY \\at hh:mm:ss A"),
          name: name,
          offsetInt: parseInt(wanted[one].Offset.replace(" hours", "")),
        });
      }
      final.sort((a, b) => {
        if (a.offsetInt < b.offsetInt) {
          return -1;
        }
        if (a.offsetInt > b.offsetInt) {
          return 1;
        }
        return 0;
      });
    } else if (conv) {
      //remove the wanted offset from the wanted 2 offset
      let afix1 = wanted.Offset.replace(" hours", "");
      let afix2 = wanted2.Offset.replace(" hours", "");
      let awOffset,
        aw2Offset,
        aminute1,
        aminute2,
        ahour1,
        ahour2 = null;
      if (afix1.includes(":")) awOffset = afix1.split(":");
      else awOffset = afix1;
      if (afix2.includes(":")) aw2Offset = afix2.split(":");
      else aw2Offset = afix2;
      if (Array.isArray(awOffset)) {
        ahour1 = parseInt(awOffset[0]);
        aminute1 = parseInt(awOffset[1]);
      } else {
        ahour1 = parseInt(awOffset);
        aminute1 = 0;
      }
      if (Array.isArray(aw2Offset)) {
        ahour2 = parseInt(aw2Offset[0]);
        aminute2 = parseInt(aw2Offset[1]);
      } else {
        ahour2 = parseInt(aw2Offset);
        aminute2 = 0;
      }
      let aoffsetHours = parseInt(ahour1);
      let aoffsetMinutes = parseInt(aminute1);
      let aw2OffsetHours = parseInt(ahour2);
      let aw2OffsetMinutes = parseInt(aminute2);
      //   aw2OffsetHours = flipVal(aw2OffsetHours);
      //   aw2OffsetMinutes = flipVal(aw2OffsetMinutes);
      console.log(aoffsetHours, aoffsetMinutes);
      console.log(aw2OffsetHours, aw2OffsetMinutes);
      let aoffset = aoffsetHours * 60 + aoffsetMinutes;
      let aw2OffsetTotal = aw2OffsetHours * 60 + aw2OffsetMinutes;
      aoffset = aw2OffsetTotal - aoffset;
      //offset is in minutes
      date = new Date(dateNowUTC);
      console.log(dateNowUTC);
      date = date.setMinutes(date.getMinutes() + aoffset); // convert the minutes to hours and minutes
      let hours = Math.floor(aoffset / 60);
      let minutes = aoffset % 60;
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (aoffset < 0) {
        off =
          "**-** " +
          Math.abs(hours) +
          " hours " +
          Math.abs(minutes) +
          " minutes";
      } else {
        off = "**+** " + hours + " hours " + minutes + " minutes";
      }
    } else {
      hours = wanted.Offset.replace(" hours", "");
      date = fixDate(dateNowUTC, hours);
      if (wanted.Offset.includes("-")) {
        off = wanted.Offset.replace("-", "**-** ");
      } else {
        off = "**+** " + wanted.Offset;
      }
    }
    if (!simple && !Array.isArray(wanted) && !conv) {
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
    } else if (!simple && !Array.isArray(wanted) && conv) {
      message.channel.send({
        embeds: [
          new RM.Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.avatarURL(),
            })
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
    } else if (simple) {
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
    } else if (wanted instanceof Array) {
      let embed = new RM.Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.avatarURL(),
        })
        .setTitle("Timezones");
      for (let i of final) {
        embed.addField(
          "Time for: **" + i.name.toUpperCase() + "** (**" + i.abbr + "**)",
          i.time + " (Offset: " + i.offset + ")"
        );
      }
      message.channel.send({ embeds: [embed] });
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
    function fixAbbrCase(abbr) {
      for (let object of convert().list()) {
        if (object.abbr.toLowerCase() === abbr.toLowerCase()) {
          return object.abbr;
        }
      }
      return false;
    }
    if ((!amount || isNaN(parseFloat(amount))) && parseFloat(amount) !== 0) {
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
      for (let index of Object.keys(organizedUnits)) {
        if (organizedUnits[index].includes(from.toUpperCase())) {
          from = index.toLowerCase();
        }
        if (organizedUnits[index].includes(to.toUpperCase())) {
          to = index.toLowerCase();
        }
      }
      //   let allUnits = convert().list();
      //   for (let unit of allUnits) {
      //     unitname = unit.singular;
      //     unitabbr = unit.abbr;
      //     unitplural = unit.plural;
      //     if (
      //       unitabbr.toLowerCase() === from.toLowerCase() ||
      //       unitname.toUpperCase() === from.toUpperCase() ||
      //       unitplural.toUpperCase() === from.toUpperCase()
      //     ) {
      //       from = unit.abbr;
      //     }
      //     if (
      //       unitabbr.toLowerCase() === to.toLowerCase() ||
      //       unitname.toUpperCase() === to.toUpperCase() ||
      //       unitplural.toUpperCase() === to.toUpperCase()
      //     ) {
      //       to = unit.abbr;
      //     }
      //   }
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
    numberWithCommas = function (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    function getFixedValue(amount, from, to) {
      let _tempResult;
      try {
        _tempResult = String(
          parseFloat(
            convert(amount).from(fixAbbrCase(from)).to(fixAbbrCase(to))
          ).toFixed(5)
        );
      } catch (e) {
        console.log(e);
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
      //   console.log(String(_tempResult));
      //   if (String(_tempResult).includes(".")) {
      //     let _temp2 = String(_tempResult).split(".");
      //     _temp2[0] = numberWithCommas(_temp2[0]);
      //     _tempResult = _temp2.join(".");
      //   } else {
      //     _tempResult = numberWithCommas(_tempResult);
      //   }

      if (_tempResult.match(/^((?!\.).)*$/)) {
        // console.log("match 1st");
      } else if (_tempResult.match(/\.0([-.]?0+)*$/g)) {
        // console.log("match 2nd");
        _tempResult = _tempResult.replace(/\.0([-.]?0+)*$/g, "");
      } else if (_tempResult.match(/0([-.]?0+)*$/g)) {
        // console.log("match 3rd");
        _tempResult = _tempResult.replace(/0([-.]?0+)*$/g, "");
      } else {
        // console.log("no match");
      }
      return _tempResult;
    }

    let result = getFixedValue(amount, from, to);
    // send the message to the channel
    console.log(result);
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
              fixAbbrCase(from) +
              "** to **" +
              fixAbbrCase(to) +
              "** is **" +
              +result +
              " " +
              fixAbbrCase(to) +
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
};
