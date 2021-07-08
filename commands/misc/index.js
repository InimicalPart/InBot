function calculate() {
	return require("./calculate/calculate.js")
}
function embed() {
	return require("./embed/embed.js")
}
function help() {
	return require("./help/help.js")
}
function random() {
	return require("./random/random.js")
}
function test() {
	return require("./test/test.js")
}



module.exports = {
	calculate,
	embed,
	help,
	random,
	test
}

console.log("[I] Category MISC loaded")