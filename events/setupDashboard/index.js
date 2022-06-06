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
      attemptTestMessage();
    });
    socket.on("LCNT", (message) => {
      console.log("Web disconnected. Pausing all messages.");
    });
    socket.on("IACK", (message) => {
      //Server acknowledges our HPI response
      if (message == "WLCWRKR") {
        console.log("Server acknowledged our HPI response");
      }
    });
    socket.on("message", (message) => {
      if (typeof message === "string") {
        console.log("msg:", message);
        if (message == "who ru") {
          socket.send({
            whoruResp: {
              tag: RM.client.user.tag,
              avatarURL: RM.client.user.displayAvatarURL(),
              socketId: socket.id,
            },
          });
        }
      } else {
        if (message.hello) {
          socket.send({
            helloResp: "Hello worker",
          });
        } else if (message.helloResp) {
          console.log("Test message response: " + message.helloResp);
        }
      }
    });
    function attemptTestMessage() {
      socket.send({ hello: "web" });
    }
  }
}
function eventType() {
  return commandInfo.type;
}
module.exports = {
  runEvent,
  eventType,
};
