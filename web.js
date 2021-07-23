var net = require("net");
const config = require("./config.js");
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const jwt_decode = require("jwt-decode");
var Heroku = require("heroku-client"),
  heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.listen(process.env.PORT || 3000, () =>
  console.log("[I] API server started [I]")
);
function getInfo(callback) {
  var client = new net.Socket();
  client.connect(7380, "0.0.0.0");
  client.on("data", function (data) {
    //check if web is using the port
    if (data.toString().startsWith("III_CLIENT_DATA")) {
      processData(data, function (val) {
        client.write("200 ok");
        callback(val);
      });
    } else {
      //port isnt used by web, close connection
      client.destroy();
    }
    return "ERROR";
  });
}
function parseJwt(token) {
  var jsonPayload = jwt_decode(token);
  return JSON.parse(JSON.stringify(jsonPayload));
}
function processData(data, callback) {
  let rData = data.toString().replace("III_CLIENT_DATA: ", "");

  try {
    JSON.parse(rData);
  } catch (e) {
    console.error("[CRT] Data sent was not valid.");
    return;
  }
  const prData = JSON.parse(rData);
  if (prData.userAmount == undefined || prData.commandsUsed == undefined) {
    console.error("[CRT] Data sent was not valid.");
    return;
  }
  callback(prData);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/api/v1/stats/cmd", (req, res) => {
  var server = net.createServer();

  server.once("error", function (err) {
    if (err.code === "EADDRINUSE") {
      //bot is using port, try to connect
      getInfo(function (val) {
        res.json({
          commandsUsed: val.commandsUsed,
        });
      });
    }
  });

  server.once("listening", function () {
    //port is not being used by bot, close server.
    server.close();
    res.json({ error: "client offline" });
  });

  server.listen(7380, "0.0.0.0");
});
app.get("/api/v1/stats/users", (req, res) => {
  var server = net.createServer();
  server.once("error", function (err) {
    if (err.code === "EADDRINUSE") {
      //bot is using port, try to connect
      getInfo(function (val) {
        res.json({
          userAmount: val.userAmount,
        });
      });
    }
  });

  server.once("listening", function () {
    //port is not being used by bot, close server.
    server.close();
    res.json({ error: "client offline" });
  });

  server.listen(7380, "0.0.0.0");
});
app.get("/iii-admin", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }
  res.setHeader("Content-Type", "text/html");
  //parse req.headers.authorization using parseJwt
  var token = req.headers.authorization;
  var jwtPayload = parseJwt(token);
  if (!process.env.APPNAMES.split(",").includes(jwtPayload.name)) {
    return res.status(403).json({ error: "Invalid credentials!" });
  }
  console.log(
    "[I] User " +
      jwtPayload.name +
      " logged in at: " +
      new Date().toLocaleString()
  );
  res.sendFile(__dirname + "/public/admin.html");
});
app.post("/system/reboot", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }
  res.setHeader("Content-Type", "text/html");
  //parse req.headers.authorization using parseJwt
  var token = req.headers.authorization;
  var jwtPayload = parseJwt(token);
  if (!process.env.APPNAMES.split(",").includes(jwtPayload.name)) {
    return res.status(403).json({ error: "Invalid credentials!" });
  }
  res.redirect("/iii-admin");
  // When NodeJS exits
  console.log("⚠ SYSTEM IS REBOOTING ⚠");
  heroku.delete("/apps/iii-project/dynos/worker");
  setTimeout(function () {
    process.on("exit", function () {
      require("child_process").spawn(process.argv.shift(), process.argv, {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit",
      });
    });
    process.exit(1);
  }, 1000);
});
app.post("/api/v1/cmdTrigger", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }
  res.setHeader("Content-Type", "text/html");
  //parse req.headers.authorization using parseJwt
  var token = req.headers.authorization;
  var jwtPayload = parseJwt(token);
  if (!process.env.APPNAMES.split(",").includes(jwtPayload.name)) {
    return res.status(403).json({ error: "Invalid credentials!" });
  }
  res.redirect("/iii-admin");
  let newState;
  let selectedCommand = req.body.cmdlist;
  if (req.body.select == undefined) {
    newState = false;
  } else {
    newState = true;
  }
  const config = require("fs").readFileSync(
    require("path").join(__dirname + "/config.js"),
    { encoding: "utf8", flag: "r" }
  );
  let list = [];
  try {
    // read contents of the file
    let count = 0;
    require("fs")
      .createReadStream(require("path").join(__dirname + "/config.js"))
      .on("data", function (chunk) {
        for (i = 0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
      })
      .on("end", async function () {
        const data = require("fs").readFileSync(
          require("path").join(__dirname + "/config.js"),
          "UTF-8"
        );
        // split the contents by new line
        const lines = data.split(/\r?\n/);

        // print all lines
        lines.forEach((line) => {
          if (line.toLowerCase().includes("exports.cmd" + selectedCommand)) {
            for (let i in line.split(" ")) {
              list.push(line.split(" ")[i]);
            }
            restOfIndex();
          }
        });
      });
  } catch (err) {
    return console.log(err);
  }
  function restOfIndex() {
    const newConfig = config.replace(
      "cmd" +
        selectedCommand.charAt(0).toUpperCase() +
        selectedCommand.slice(1) +
        " = " +
        list[list.length - 1],
      "cmd" +
        selectedCommand.charAt(0).toUpperCase() +
        selectedCommand.slice(1) +
        " = " +
        newState.toString()
    );
    require("fs").writeFile(
      require("path").join(__dirname + "/config.js"),
      newConfig,
      function (err) {
        if (err) throw err;
        //console.log('File is created successfully.');
      }
    );
  }
});
