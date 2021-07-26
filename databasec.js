async function connect() {

	const { Client } = require('pg');

	const client = new Client({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false
		}
	});
	await client.connect();
	async function create(
		/** @type string */ table_name) {
		const res = await client.query(`CREATE TABLE IF NOT EXISTS ${table_name}(
			id SERIAL,
			userid bigint not null,
			amountw integer,
			amountb integer
		);`);
		return res
	}

	async function add(
		/** @type string */ table_name,
		/** @type number */ userid,
		/** @type number */ amountw,
		/** @type number */ amountb) {
		const res = await client.query(`INSERT INTO ${table_name}(userid, amountw, amountb) VALUES(${userid},${amountw},${amountb});`)
	}

	async function fetch(
		/** @type string */ table_name,
		/** @type number */ userid) {


		const res = await client.query(`SELECT * FROM ${table_name} WHERE userid=${userid}`)
		if (res.rows.length < 1) return null
		return JSON.parse(JSON.stringify(res.rows[0]))
	}
	async function update(
		/** @type string */ table_name,
		/** @type number */ userid,
		/** @type number @optional */amountw,
		/** @type number @optional */amountb) {
		let amountwE = false;
		let amountbE = false;
		if (!amountw && amountw === 0) amountwE = true;
		if (!amountb && amountb === 0) amountbE = true;
		if (amountw) amountwE = true;
		if (amountb) amountbE = true;
		if (amountwE && !amountbE) {
			client.query(`UPDATE ${table_name} SET amountw=${amountw} WHERE userid=${userid};`)
		} else if (!amountwE && amountbE) {
			client.query(`UPDATE ${table_name} SET amountb=${amountb} WHERE userid=${userid};`)
		} else if (amountwE && amountbE) {
			client.query(`UPDATE ${table_name} SET amountw=${amountw}, amountb=${amountb} WHERE userid=${userid};`)
		} else if (!amountwE && !amountbE) {
			throw new Error('No amount to update.')
		}

	}

	async function remove(
		/** @type string */ table_name,
		/** @type number */ userid) {

		client.query(`DELETE FROM ${table_name} WHERE userid=${userid};`)
		client.end()
	}
	async function clear(
		/** @type string */ table_name,
		/** @type number */ userid) {

		client.query(`UPDATE ${table_name} SET amountw=0, amountb=0 WHERE userid=${userid};`)
		client.end()
	}

	connect.create = create;
	connect.add = add;
	connect.fetch = fetch;
	connect.update = update;
	connect.remove = remove;
	connect.clear = clear;
}
module.exports = {
	connect
}
/*

------------------------------USAGE----------------------------\\

Initializor:
	const { connect } = require("../../../databasec")
	await connect()
	await connect.create("table_name") // "currency" for money


Create a table in the database:
	await connect.create(table_name)


Add a user to the money database:
	await connect.add("currency", message.author.id, 0, 0)

Fetch a users information:
	const result = await connect.fetch("currency", message.author.id)

	result.id // the DB ID of the user
	result.userid // Discord User ID of the user
	result.amountw // Amount of money the user has in their wallet
	result.amountb // Amount of money the user has in their bank


Update a users information:
	await connect.update("currency", message.author.id, new wallet, new bank)

	Update users new bank:
		await connect.update("currency", message.author.id, undefined, new bank)

	Update users new wallet:
		await connect.update("currency", message.author.id, new wallet)


Remove a user from a table:
	await connect.remove("currency", message.author.id)


Clear a users information from a table: // sets users wallet to 0 and bank to 0
	await connect.clear("currency", message.author.id)


*/