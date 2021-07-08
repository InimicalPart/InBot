function motivation() {
	return require("./motivation/motivation.js")
}
function roast() {
	return require("./roast/roast.js")
}
module.exports = {
	motivation,
	roast
}
console.log("[I] Category FUN loaded")