const commandInfo = {
  type: "onMessage",
};

async function runEvent(RM, event) {
  //Event checks
  if (event.guild === null) {
    //If not in a guild, return
    return;
  }
  if (event.author.bot) {
    //If the author is a bot, return
    return;
  }
  if (event.channel.id !== "873855892389507162") {
    //If the channel doesnt match #chatbot-test, return
    return;
  }
  if (event.content.startsWith("!")) {
    //If the message starts with a !, return
    return;
  }
  console.log("Event 'onAIMsg' fired at " + new Date().toLocaleTimeString());
  event.channel.startTyping(); // Let's the user know we're working on their query.
  const result = await runSample("iii-ai", event.content); // Run the sample function with the user's query.
  let response = ""; // Create a variable to hold our response.
  if (result.allRequiredParamsPresent) {
    if (result.intent.displayName === "date.get") {
      // If the intent is date.get
      let responsetype = between(1, 3); // Pick a random number between 1 and 3.
      let results; // Create a variable to hold the results.
      if (responsetype === 1) {
        // If the number is 1
        results = DateFormatter.formatDate(new Date(), `MMMM ????, YYYY`); // Format the date using the MMMM ????, YYYY format.
        results = results.replace("????", getOrdinalNum(new Date().getDate())); // Replace the ???? with the day of the month.
        response = "It's " + results + "."; // Set the response to the formatted date.
      } else if (responsetype === 2) {
        // If the number is 2
        results = DateFormatter.formatDate(new Date(), `MMMM ????, YYYY`); // Format the date using the MMMM ????, YYYY format.
        results = results.replace("????", getOrdinalNum(new Date().getDate())); // Replace the ???? with the day of the month.
        response = "It is " + results + "."; // Set the response to the formatted date.
      } else if (responsetype === 3) {
        // If the number is 3
        results = DateFormatter.formatDate(new Date(), `MMMM ????, YYYY`); // Format the date using the MMMM ????, YYYY format.
        results = results.replace("????", getOrdinalNum(new Date().getDate())); // Replace the ???? with the day of the month.
        response = "Today it is " + results + "."; // Set the response to the formatted date.
      }
    } else if (result.intent.displayName === "units.convert") {
      // If the intent is units.convert
      var convert = require("convert-units"); // Load the convert-units module.
      let amount = 1; // Create a variable to hold the amount.

      if (
        result.parameters.fields["amount"].numberValue !== "" && // If the amount is not empty
        result.parameters.fields["amount"].numberValue !== undefined // If the amount is not undefined
      ) {
        amount = result.parameters.fields["amount"].numberValue; // Set the amount to the amount value.
      }
      let results = convert(parseInt(amount)) // Convert the amount to the correct unit.
        .from(result.parameters.fields["unit-from"].stringValue) // Set the from unit.
        .to(result.parameters.fields["unit-to"].stringValue); // Set the to unit.
      response =
        amount +
        " " +
        result.parameters.fields["unit-from"].stringValue +
        " = " +
        results +
        " " +
        result.parameters.fields["unit-to"].stringValue; // Set the response to the converted amount.
    } else {
      response = result.fulfillmentText; // Set the response to the fulfillment text.
    }
  } else {
    response = result.fulfillmentText; // Set the response to the fulfillment text.
  }
  event.channel.stopTyping(); // Stop the typing indicator.
  event.lineReply(
    // Send the response to the user.
    "Response: " + response + "\nIntent: " + result.intent.displayName
  );

  function getOrdinalNum(n) {
    return (
      n +
      (n > 0
        ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
        : "")
    );
  }

  const DateFormatter = {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    dayNames: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    formatDate: function (e, t) {
      var r = this;
      return (
        (t = r.getProperDigits(t, /d+/gi, e.getUTCDate())),
        (t = (t = r.getProperDigits(t, /M+/g, e.getUTCMonth() + 1)).replace(
          /y+/gi,
          function (t) {
            var r = t.length,
              g = e.getUTCFullYear();
            return 2 == r ? (g + "").slice(-2) : 4 == r ? g : t;
          }
        )),
        (t = r.getProperDigits(t, /H+/g, e.getUTCHours())),
        (t = r.getProperDigits(t, /h+/g, r.getHours12(e.getUTCHours()))),
        (t = r.getProperDigits(t, /m+/g, e.getUTCMinutes())),
        (t = (t = r.getProperDigits(t, /s+/gi, e.getUTCSeconds())).replace(
          /a/gi,
          function (t) {
            var g = r.getAmPm(e.getUTCHours());
            return "A" === t ? g.toUpperCase() : g;
          }
        )),
        (t = r.getFullOr3Letters(t, /d+/gi, r.dayNames, e.getUTCDay())),
        (t = r.getFullOr3Letters(t, /M+/g, r.monthNames, e.getUTCMonth()))
      );
    },
    getProperDigits: function (e, t, r) {
      return e.replace(t, function (e) {
        var t = e.length;
        return 1 == t ? r : 2 == t ? ("0" + r).slice(-2) : e;
      });
    },
    getHours12: function (e) {
      return (e + 24) % 12 || 12;
    },
    getAmPm: function (e) {
      return e >= 12 ? "pm" : "am";
    },
    getFullOr3Letters: function (e, t, r, g) {
      return e.replace(t, function (e) {
        var t = e.length;
        return 3 == t ? r[g].substr(0, 3) : 4 == t ? r[g] : e;
      });
    },
  };

  async function runSample(projectId = "iii-ai", data) {
    const dialogflow = require("@google-cloud/dialogflow");
    const uuid = require("uuid");
    require("dotenv").config();
    // A unique identifier for the given session
    const sessionId = uuid.v4();

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: data,
          // The language used by the client (en-US)
          languageCode: "en-US",
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient
      .detectIntent(request)
      .catch(console.error);
    const result = responses[0].queryResult;
    return result;
  }
  function addzeros(number, length) {
    var my_string = "" + number;
    while (my_string.length < length) {
      my_string = "0" + my_string;
    }
    return my_string;
  }
  function between(lower, upper) {
    var scale = upper - lower + 1;
    return Math.floor(lower + Math.random() * scale);
  }
}
function eventType() {
  return commandInfo.type;
}
module.exports = {
  runEvent,
  eventType,
};
