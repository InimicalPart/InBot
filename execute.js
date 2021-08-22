const AsciiBar = require('ascii-bar').default; const bar = new AsciiBar({
	formatString: "#spinner #percent #bar #message",
	stream: process.stdout,
	hideCursor: false,
	enableSpinner: true,
	print: false
});
const messages = [
	"Loading Stream...",
	"Starting Mainframe...",
	"Starting Processor...",
	"Starting Memory...",
	"Starting Disk...",
	"Starting Network...",
	"Starting Audio...",
	"Starting Video..."
]
bar.spinner = {
	interval: 200,
	frames: ["&#x2631", "&#x2632", "&#x2634", "&#x2632"]
}
bar.update(0, "Starting up...");
let a = bar.renderLine();
const fs = require('fs');
const path = require('path');
fs.writeFileSync(path.join(__dirname, 'file.txt'), '')
//Start an express server
const express = require('express');
const app = express();
app.use(express.static(__dirname));
// Make auto-update
let total = 0
setInterval(() => {
	if (total < 100) {
		let a = bar.renderLine()
		fs.writeFileSync(path.join(__dirname, 'file.txt'), a.replace("[0m", ""))
	} else {
		fs.writeFileSync(path.join(__dirname, 'file.txt'), 'DONE! [>>>>>>>>>>>>>>>>>>>>] Stream Started!')
	}
}, 90)
app.listen(7380, "127.0.0.1", function () {
	console.log("Server running on 127.0.0.1:7380")
});
// on a get request to /info
app.get('/info', async (req, res, next) => {
	//console.log("Connection from: " + req.socket.remoteAddress + ":" + req.socket.remotePort + " With UserAgent: " + req.get('User-Agent'));
	res.setHeader('Content-Type', 'text/html');
	res.write('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Georama&display=swap" rel="stylesheet">')
	if (req.get('User-Agent').includes("OBS")) {
		res.write("<style>*{color:white; font-size: 100px; margin-left:20px;font-family: 'Georama', sans-serif;}</style>")
	}
	res.write(fs.readFileSync(path.join(__dirname, 'file.txt')))
	res.write("<script>setTimeout(() => {location.reload()},100)</script>")
	res.end();
})
setInterval(() => {
	if (total !== 100) {
		total++;
		bar.update(total, messages[Math.floor(Math.random() * messages.length)]);
	} else {
		bar.stop()
	}
}, 500)
