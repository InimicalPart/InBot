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

function work() {
	return require("./work/work.js")
}

function deposit() {
	return require("./deposit/deposit.js")
}

function withdraw() {
	return require("./withdraw/withdraw.js")
}

function pay() {
	return require("./pay/pay.js")
}

module.exports = {
	pay,
	withdraw,
	deposit,
	work,
	removemoney,
	balance,
	addmoney,
	blackjack
}

console.log("[I] Category ECONOMY loaded")