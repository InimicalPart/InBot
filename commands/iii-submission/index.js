function approve() {
	return require("./approve/approve.js")
}
function deny() {
	return require("./deny/deny.js")
}
function post() {
	return require("./post/post.js")
}
function remove() {
	return require("./remove/remove.js")
}
function restore() {
	return require("./restore/restore.js")
}



module.exports = {
	approve,
	deny,
	post,
	//remove,
	restore
}
console.log("[I] Category III-SUB loaded")