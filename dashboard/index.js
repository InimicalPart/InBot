let express = require("express");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

let app = express();
app.use(connectLiveReload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(require("path").join(__dirname, "public/src")));
console.log(require("path").join(__dirname, "public/src"));
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port " + (process.env.PORT || 3000));
});
