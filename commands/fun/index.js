function motivation() {
	return require("./motivation/motivation.js")
}
function roast() {
	return require("./roast/roast.js")
}
function chess() {
	return require("./chess/chess.js")
}

module.exports = {
	chess,
	motivation,
	roast
}
console.log("[I] Category FUN loaded")