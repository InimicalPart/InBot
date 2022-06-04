const commandInfo = {
  type: "onStart",
};

async function runEvent(RM) {
  let knownTimers = [];
  //   console.log("runnin");
  //Event checks
  //
  let path = require("path");
  const connect = RM.DBClient;
  await connect.create("timer");
  var SqlString = require("sqlstring");
  //get all timers
  const res = await connect.query("SELECT * FROM timer");
  if (res.rows.length > 1) {
    // console.log("no timers found");
    const resjson = JSON.parse(JSON.stringify(res.rows));
    knownTimers = resjson;
    let ids = [];
    for (let i = 0; i < resjson.length; i++) {
      ids.push(resjson[i].timerid);
    }
    // console.log(
    //   knownTimers.length + " timer(s) found (" + ids.join(", ") + ")"
    // );
  }

  setInterval(async () => {
    //check if timers are updated, do that by checking global.updatedTimers, if it is true, then pull the new timers from the database and update the known timers, then set the global.updatedTimers to false
    if (global.updatedTimers) {
      //   console.log("updating timers");
      //get all timers
      const res = await connect.query("SELECT * FROM timer");
      if (res.rows.length < 1) {
        knownTimers = [];
        global.updatedTimers = false;
      } else {
        const resjson = JSON.parse(JSON.stringify(res.rows));
        knownTimers = resjson;
        global.updatedTimers = false;
      }
    }
    //check if there are any timers that need to be run
    for (let i = 0; i < knownTimers.length; i++) {
      if (new Date() >= knownTimers[i].time) {
        let timer = knownTimers[i];
        knownTimers.splice(i, 1);
        let channelid = timer.channelid;
        let channel = await RM.client.channels.fetch(channelid);
        let messageid = timer.messageid;
        let embed = new RM.Discord.MessageEmbed()
          .setColor("GREEN")
          .setDescription(timer.message)
          .setThumbnail(channel.guild.iconURL())
          .setTitle("🔔 Timer 🔔");
        channel.send({
          embeds: [embed],
          content: "<@" + timer.userid + ">",
          reply: { messageReference: messageid },
        });
        //delete the timer
        await connect.query(
          "DELETE FROM timer WHERE id=" + SqlString.escape(timer.id)
        );
      }
    }
  }, 100);
}
function eventType() {
  return commandInfo.type;
}
module.exports = {
  runEvent,
  eventType,
};
