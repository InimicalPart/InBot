const path = require("path");
let express = require("express");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
console.log(path.resolve(__dirname, "../config.jsonc"));
console.log(
  require("fs").existsSync(path.resolve(__dirname, "../config.jsonc"))
);
let config = require("json5").parse(
  require("fs").readFileSync(path.resolve(__dirname, "../config.jsonc"), "utf8")
);
require("dotenv").config({ path: "../.env" });
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

let app = express();
let request = require("request");
app.use(connectLiveReload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(require("path").join(__dirname, "public/src")));
console.log(require("path").join(__dirname, "public/src"));
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port " + (process.env.PORT || 3000));
});
app.post("/api/discord/gettoken", (req, res) => {
  let code = req.body.code;
  console.log(code);
  console.log(req.protocol + "://" + req.get("host"));
  console.log(req);
  let rUri = null;
  if (req.hostname == "localhost") {
    console.log("localhost");
    rUri = req.protocol + "://" + req.get("host");
  } else {
    console.log("not localhost");
    rUri = "https://" + req.hostname;
  }
  console.log(rUri);

  request(
    {
      method: "POST",
      url: "https://discord.com/api/v10/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      form: {
        client_id: config.settings.dashboard.clientId,
        client_secret: process.env.oauthClientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: rUri,
      },
    },
    function (error, response, body) {
      if (error) throw new Error(error);
      res.send(body);
    }
  );
});
app.get("/api/discord/getoauth", (req, res) => {
  console.log("getting uri");
  res.send({
    uri:
      "https://discord.com/api/oauth2/authorize?client_id=" +
      config.settings.dashboard.clientId +
      "&redirect_uri=[REPLACE]&response_type=code&scope=identify%20email%20guilds",
  });
});
app.post("/api/discord/refresh", (req, res) => {
  let refreshToken = req.body.discordlogin.refresh_token;
  console.log(refreshToken);
  request(
    {
      method: "POST",
      url: "https://discord.com/api/v10/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      form: {
        client_id: config.settings.dashboard.clientId,
        client_secret: process.env.oauthClientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
    },
    function (error, response, body) {
      if (error) throw new Error(error);
      body["refresh_token"] = refreshToken;
      console.log({
        success: true,
        discordlogin: body,
      });
      res.send({
        success: true,
        discordlogin: body,
      });
    }
  );
});
app.get("/api/dashboard/name", (req, res) => {
  res.send({
    name: config.settings.dashboard.name,
  });
});
