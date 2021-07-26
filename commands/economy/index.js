function blackjack() {
	return require("./blackjack/blackjack.js")
}

function addmoney() {
	return require("./addmoney/addmoney.js")
}

function balance() {
	return require("./balance/balance.js")
}

function removemoney() {
	return require("./removemoney/removemoney.js")
}

module.exports = {
	removemoney,
	balance,
	addmoney,
	blackjack
}

console.log("[I] Category ECONOMY loaded")