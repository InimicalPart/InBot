function ban() {
	return require('./ban/ban.js')
}
function config() {
	return require('./config/config.js')
}
function modlog() {
	return require('./modlog/modlog.js')
}
function unban() {
	return require('./unban/unban.js')
}


module.exports = {
	ban,
	config,
	modlog,
	unban
}
console.log("[I] Category MODERATION loaded")