var express = require('express');
var app = express();
var mainDir = __dirname + "\\www"
var sleep = require("system-sleep")
const { spawn } = require("child_process")
var bodyParser = require("body-parser");
const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require('constants');
app.use(express.static(__dirname + '/www'))
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
  res.sendFile(mainDir + "\\index.html")
});

var server = app.listen(5000, function () {
  console.log('<-> III Website is running at port 5000 <->');
});