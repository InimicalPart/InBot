function nowplaying() {
	return require('./nowplaying/nowplaying.js')
}
function pause() {
	return require('./pause/pause.js')
}
function play() {
	return require('./play/play.js')
}
function queue() {
	return require('./queue/queue.js')
}
function search() {
	return require('./search/search.js')
}
function skip() {
	return require('./skip/skip.js')
}
function stop() {
	return require('./stop/stop.js')
}
function vcsounds() {
	return require('./vcsounds/vcsounds.js')
}


module.exports = {
	nowplaying,
	pause,
	play,
	queue,
	search,
	skip,
	stop,
	vcsounds
}

console.log("[I] Category MUSIC loaded")