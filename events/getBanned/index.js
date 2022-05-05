const commandInfo = {
  type: "onStart",
};

async function runEvent(RM) {
  const connect = RM.DBClient;
  await connect.create("bot_settings");
  if (
    (
      await connect.query(
        "SELECT * FROM bot_settings WHERE botid=" + RM.client.user.id
      )
    ).rows.length < 1
  ) {
    await connect.add("bot_settings", RM.client.user.id);
  }
  const settings = await connect.query(
    "SELECT * FROM bot_settings WHERE botid=" + RM.client.user.id
  );
  global.bannedUsers = settings.rows[0]?.settings?.banned_users || [];
setInterval(()=>{
    const settings = await connect.query(
        "SELECT * FROM bot_settings WHERE botid=" + RM.client.user.id
      );
      global.bannedUsers = settings.rows[0]?.settings?.banned_users || [];
},30000)
  console.log(
    "Banned users aquired, " +
      global.bannedUsers.length +
      " users are banned from using the bot."
  );
}
function eventType() {
  return commandInfo.type;
}
module.exports = {
  runEvent,
  eventType,
};
