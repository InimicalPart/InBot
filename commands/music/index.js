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
function lyrics() {
	return require('./lyrics/lyrics.js')
}
function remove() {
	return require('./remove/remove.js')
}
function seek() {
	return require('./seek/seek.js')
}

module.exports = {
	nowplaying,
	pause,
	play,
	queue,
	search,
	skip,
	stop,
	vcsounds,
	lyrics,
	remove,
	seek
}

console.log("[I] Category MUSIC loaded")