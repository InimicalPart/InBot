/**
 *
 *
 *
 *
 **/
async function connect() {
  const { Client } = require("pg");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  async function create(/** @type string */ table_name) {
    if (table_name == "currency") {
      const res = await client.query(`CREATE TABLE IF NOT EXISTS ${table_name}(
				id SERIAL,
				userid bigint not null,
				amountw integer,
				amountb integer,
				maxbank integer default 1000,
				level integer default 0
			);`);
      return res;
    }
    if (table_name == "inventory") {
      const res = await client.query(`CREATE TABLE IF NOT EXISTS ${table_name}(
				id SERIAL,
				userid bigint not null,
				items json not null default '${JSON.stringify({ active: {} })}'
				);`);
      return res;
    }
    if (table_name == "cooldown") {
      const res = await client.query(`CREATE TABLE IF NOT EXISTS ${table_name}(
				id SERIAL,
				userid bigint not null,
				robcool int default null,
				workcool int default null,
				slotscool int default null,
				roulcool int default null,
				dailycool int default null,
				weeklycool int default null,
				monthlycool int default null
				);`);
      return res;
    }
    if (table_name == "settings") {
      const res = await client.query(`CREATE TABLE IF NOT EXISTS ${table_name}(
                id SERIAL,
                botid bigint not null,
                items json not null default '${JSON.stringify({})}'
                );`);
      return res;
    }
  }

  async function add(
    /** @type string */ table_name,
    /** @type number */ userid
  ) {
    if (table_name == "currency") {
      const res = await client.query(
        `INSERT INTO ${table_name}(userid, amountw, amountb, maxbank, level) VALUES(${userid},0,0,1000,0);`
      );
    } else if (table_name == "inventory") {
      const res = await client.query(
        `INSERT INTO ${table_name}(userid, items) VALUES(${userid}, '${JSON.stringify(
          { active: {} }
        )}');`
      );
    } else if (table_name == "cooldown") {
      const res = await client.query(
        `INSERT INTO ${table_name}(userid, robcool, workcool, slotscool, roulcool, dailycool, weeklycool, monthlycool) VALUES(${userid}, null, null, null, null, null, null, null);`
      );
    } else if (table_name == "settings") {
      const res = await client.query(
        `INSERT INTO ${table_name}(botid, settings) VALUES(${userid}, '{}');`
      );
    }
  }

  async function fetch(
    /** @type string */ table_name,
    /** @type number */ userid
  ) {
    let res;
    if (table_name !== "settings")
      res = await client.query(
        `SELECT * FROM ${table_name} WHERE userid=${userid}`
      );
    else
      res = await client.query(
        `SELECT * FROM ${table_name} WHERE botid=${userid}`
      );
    if (res.rows.length < 1) return null;
    return JSON.parse(JSON.stringify(res.rows[0]));
  }
  async function updateSettings(
    /** @type string */ table_name,
    /** @type number */ botid,
    /** @type json @optional */ data
  ) {
    let dataE = false;
    if (!data && data === 0 && items !== undefined) dataE = true;
    if (data && data !== undefined) dataE = true;
    if (!dataE) {
      throw new Error("No data provided");
    }
    client.query(
      `UPDATE ${table_name} SET settings='${JSON.stringify(
        data
      )}' WHERE botid=${botid}`
    );
  }
  async function updateInv(
    /** @type string */ table_name,
    /** @type number */ userid,
    /** @type json @optional */ items
  ) {
    let itemsE = false;
    if (!items && items === 0 && items !== undefined) itemsE = true;
    if (items && items !== undefined) itemsE = true;
    if (!itemsE) {
      throw new Error("No amount to update.");
    }
    client.query(
      `UPDATE ${table_name} SET items='${JSON.stringify(
        items
      )}' WHERE userid=${userid};`
    );
  }
  async function updateCooldown(
    /** @type string */ table_name,
    /** @type number */ userid,
    /** @type Date @optional */ robcool,
    /** @type Date @optional */ workcool,
    /** @type Date @optional */ slotscool,
    /** @type Date @optional */ roulcool,
    /** @type Date @optional */ dailycool,
    /** @type Date @optional */ weeklycool,
    /** @type Date @optional */ monthlycool
  ) {
    let unixDateRob = undefined;
    let unixDateWork = undefined;
    let unixDateSlot = undefined;
    let unixDateRoul = undefined;
    let unixDateDaily = undefined;
    let unixDateWeekly = undefined;
    let unixDateMonthly = undefined;

    if (robcool && robcool !== undefined) {
      unixDateRob = robcool.getTime() / 1000;
    }
    if (workcool && workcool !== undefined) {
      unixDateWork = workcool.getTime() / 1000;
    }
    if (slotscool && slotscool !== undefined) {
      unixDateSlots = slotscool.getTime() / 1000;
    }
    if (dailycool && dailycool !== undefined) {
      unixDateDaily = dailycool.getTime() / 1000;
    }
    if (roulcool && roulcool !== undefined) {
      unixDateRoul = roulcool.getTime() / 1000;
    }
    if (weeklycool && weeklycool !== undefined) {
      unixDateWeekly = weeklycool.getTime() / 1000;
    }
    if (monthlycool && monthlycool !== undefined) {
      unixDateMonthly = monthlycool.getTime() / 1000;
    }

    if (
      (!robcool || robcool === undefined) &&
      (!workcool || workcool === undefined) &&
      (!slotscool || slotscool === undefined) &&
      (!dailycool || dailycool === undefined) &&
      (!weeklycool || weeklycool === undefined) &&
      (!monthlycool || monthlycool === undefined)
    ) {
      throw new Error("No cooldown to update.");
    }
    let total = "";
    if (unixDateRob) total += `robcool=${unixDateRob},`;
    if (unixDateWork) total += `workcool=${unixDateWork},`;
    if (unixDateSlot) total += `slotscool=${unixDateSlot},`;
    if (unixDateRoul) total += `roulcool=${unixDateRoul},`;
    if (unixDateDaily) total += `dailycool=${unixDateDaily},`;
    if (unixDateWeekly) total += `weeklycool=${unixDateWeekly},`;
    if (unixDateMonthly) total += `monthlycool=${unixDateMonthly},`;
    total = total.slice(0, -1);
    client.query(`UPDATE ${table_name} SET ${total} WHERE userid=${userid};`);
  }
  async function update(
    /** @type string */ table_name,
    /** @type number */ userid,
    /** @type number @optional */ amountw,
    /** @type number @optional */ amountb,
    /** @type number @optional */ maxbank,
    /** @type number @optional */ level
  ) {
    let amountwE = false;
    let amountbE = false;
    let maxbankE = false;
    let levelE = false;
    if (!amountw && amountw !== undefined) amountwE = true;
    if (!amountb && amountb !== undefined) amountbE = true;
    if (!maxbank && maxbank !== undefined) maxbankE = true;
    if (!level && level !== undefined) levelE = true;
    if (amountw && amountw !== undefined) amountwE = true;
    if (amountb && amountb !== undefined) amountbE = true;
    if (maxbank && maxbank !== undefined) maxbankE = true;
    if (level && level !== undefined) levelE = true;
    let total = "";
    if (!amountwE && !amountbE && !maxbankE && !levelE) {
      throw new Error("No amount to update.");
    }
    if (amountwE) {
      total += `amountw=${amountw}, `;
    }
    if (amountbE) {
      total += `amountb=${amountb}, `;
    }
    if (maxbankE) {
      total += `maxbank=${maxbank}, `;
    }
    if (levelE) {
      total += `level=${level}, `;
    }

    // throw new Error(`UPDATE ${table_name} SET ${total.trimEnd().slice(0, -1)} WHERE userid=${userid};`)
    client.query(
      `UPDATE ${table_name} SET ${total
        .trimEnd()
        .slice(0, -1)} WHERE userid=${userid};`
    );
  }

  async function remove(
    /** @type string */ table_name,
    /** @type number */ userid
  ) {
    client.query(`DELETE FROM ${table_name} WHERE userid=${userid};`);
    client.end();
  }
  async function clear(
    /** @type string */ table_name,
    /** @type number */ userid
  ) {
    client.query(
      `UPDATE ${table_name} SET amountw=0, amountb=0, maxbank=1000, level=0 WHERE userid=${userid};`
    );
    client.end();
  }
  async function query(/** @type string */ query) {
    const res = await client.query(query);
    return res;
  }
  async function end(/**@type boolean */ allowWait) {
    if (allowWait)
      return setTimeout(async function () {
        client.end();
      }, 1000);
    return client.end();
  }
  async function dcAll(/**@type string */ table_name) {
    client.query(
      "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = " +
        table_name +
        " AND pid <> pg_backend_pid();"
    );
  }

  connect.create = create;
  connect.add = add;
  connect.fetch = fetch;
  connect.update = update;
  connect.updateInv = updateInv;
  connect.updateCooldown = updateCooldown;
  connect.remove = remove;
  connect.clear = clear;
  connect.query = query;
  connect.end = end;
  connect.dcAll = dcAll;
}
module.exports = {
  connect,
};
/*

------------------------------USAGE----------------------------\\

Initializor:
	const { connect } = require("../../../databasec")
	await connect()
	await connect.create("table_name") // "currency" for money


Create a table in the database:
	await connect.create(table_name)

	but is this all of the information there nothing else?

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
