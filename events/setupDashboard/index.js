const commandInfo = {
  type: "onStart",
};

async function runEvent(RM, event) {
  if (RM.config.settings.dashboard.enabled) {
    let socketIO = RM.SocketIOClient;
    const socket = socketIO.connect(RM.config.settings.dashboard.websocketURI);
    RM.dashboardSocket = socket;
    socket.on("connect", () => {
      console.log("Connected to dashboard websocket.");
    });
    socket.on("HPI", (message) => {
      socket.emit("HPIResponse", "worker");
    });
    socket.on("CNT", (message) => {
      //if msg CONNECTED, then both web & worker are connected
      if (message == "CONNECTED") {
        console.log("Both web and worker connected");
      }
    });
    socket.on("LCNT", (message) => {
      console.log(message.socketId, "(web) disconnected.");
      if (message.remaining == 0) {
        console.log("No WEB clients connected. Pausing all messages.");
      }
    });
    socket.on("IACK", (message) => {
      //Server acknowledges our HPI response
      if (message == "WLCWRKR") {
        console.log("Server acknowledged our HPI response");
      }
    });
    socket.on("message", (message) => {});
    socket.on("allBotsIdent", (message) => {
      let returnId = message.iam;
      console.log("Identification request from", returnId);
      socket.emit("allBotsIdentResponse", {
        socketId: returnId,
        message: {
          tag: RM.client.user.tag,
          avatarURL: RM.client.user.displayAvatarURL(),
          socketId: socket.id,
          id: RM.client.user.id,
        },
      });
    });
  }
}
function eventType() {
  return commandInfo.type;
}
module.exports = {
  runEvent,
  eventType,
};
