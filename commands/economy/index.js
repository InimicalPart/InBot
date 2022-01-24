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

function leaderboard() {
	return require("./leaderboard/leaderboard.js")
}

function use() {
	return require("./use/use.js")
}

function spawnitem() {
	return require("./spawnitem/spawnitem.js")
}

function inventory() {
	return require("./inventory/inventory.js")
}

function setbankcap() {
	return require("./setbankcap/setbankcap.js")
}

function shop() {
	return require("./shop/shop.js")
}

function buy() {
	return require("./buy/buy.js")
}

function rob() {
	return require("./rob/rob.js")
}

function give() {
	return require("./give/give.js")
}

function daily() {
	return require("./daily/daily.js")
}

function weekly() {
	return require("./weekly/weekly.js")
}

function monthly() {
	return require("./monthly/monthly.js")
}

function slots() {
	return require("./slots/slots.js")
}

module.exports = {
	slots,
	monthly,
	weekly,
	daily,
	give,
	rob,
	buy,
	shop,
	setbankcap,
	inventory,
	spawnitem,
	use,
	leaderboard,
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