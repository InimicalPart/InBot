import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io("wss://ws.inimicalpart.com", {
  withCredentials: false,
});
console.log(`Attempting to connect as web`);
socket.on("connect", () => {
  console.log("Connected to server");
});
socket.on("HPI", (message) => {
  socket.emit("HPIResponse", "web");
});
socket.on("CNT", (message) => {
  //if msg CONNECTED, then both web & worker are connected
  if (message == "CONNECTED") {
    console.log("Both web and worker connected");
  }
  attemptTestMessage();
});
socket.on("LCNT", (message) => {
  console.log("Worker disconnected. Pausing all messages.");
});
socket.on("IACK", (message) => {
  //Server acknowledges our HPI response
  if (message == "WLCWEB") {
    console.log("Server acknowledged our HPI response");
  }
});
socket.on("message", (message) => {
  if (typeof message === "string") {
    // console.log("msg:", message);
  } else {
    if (message.whoruResp) {
      console.log("msg from worker", message.whoruResp);
      document.getElementById("bottag").innerText = message.whoruResp.tag;
      document.getElementById("botimg").src = message.whoruResp.avatarURL;
    } else if (message.hello) {
      socket.send({
        helloResp: "Hello worker",
      });
    } else if (message.helloResp) {
      console.log("Test message response: " + message.helloResp, "success");
      ready();
    }
  }
});
function attemptTestMessage() {
  socket.send({ hello: "worker" });
}
function ready() {
  console.log("Ready to send messages");
  socket.send("who ru");
}
