`use strict`;

const { rs, pg, query } = require(`../db`);
const path = require(`path`);
const uuid = require(`uuid`);


const insert = {
	resource: query(path.join(__dirname, `pg`, `insert`, `resource.sql`))
};

const select = {
	description: query(path.join(__dirname, `pg`, `select`, `description.sql`)),
	image: query(path.join(__dirname, `pg`, `select`, `image.sql`)),
	sound: query(path.join(__dirname, `pg`, `select`, `sound.sql`))
};

const update = {
	description: query(path.join(__dirname, `pg`, `update`, `description.sql`)),
	image: query(path.join(__dirname, `pg`, `update`, `image.sql`)),
	sound: query(path.join(__dirname, `pg`, `update`, `sound.sql`))
};

const remove = {
	resource: query(path.join(__dirname, `pg`, `delete`, `resource.sql`)),
	locale: query(path.join(__dirname, `pg`, `delete`, `locale.sql`)),
	image: query(path.join(__dirname, `pg`, `delete`, `image.sql`)),
	sound: query(path.join(__dirname, `pg`, `delete`, `sound.sql`))
};

module.exports.add = {
	resource: (id, locale, text, description, image, imageName, sound, soundName) =>
		pg().tx(uuid.v4(), client => client.oneOrNone(insert.resource, [id, locale, description, image, imageName, sound, soundName])
			.then(() => {
				if (text) {
					rs().hSet(id, locale, text);
				}
			}))
};
module.exports.put = {
	text: (id, locale, text) => rs().hSet(id, locale, text),
	description: (id, locale, description) => pg().result(update.description, [description, id, locale]).then(result => result.rowCount > 0),
	image: (id, locale, image, name) => pg().result(update.image, [image, name, id, locale]).then(result => result.rowCount > 0),
	sound: (id, locale, sound, name) => pg().result(update.sound, [sound, name, id, locale]).then(result => result.rowCount > 0)
};
module.exports.get = {
	text: (id, locale) => rs().hGet(id, locale),
	description: (id, locale) => pg().oneOrNone(select.description, [id, locale]).then(result => result ? result.description : null),
	image: (id, locale) => pg().oneOrNone(select.image, [id, locale]),
	sound: (id, locale) => pg().oneOrNone(select.sound, [id, locale])
};
module.exports.del = {
	resource: id => pg().tx(uuid.v4(), client => client.result(remove.resource, [id])
		.then(pgResult => rs().del(id)
			.then(rsResult => pgResult.rowCount > 0 || rsResult > 0))),
	locale: (id, locale) => pg().tx(uuid.v4(), client => client.result(remove.locale, [id, locale])
		.then(pgResult => rs().hDel(id, locale)
			.then(rsResult => pgResult.rowCount > 0 || rsResult > 0))),
	text: (id, locale) => rs().hDel(id, locale),
	image: (id, locale) => pg().result(remove.image, [id, locale]),
	sound: (id, locale) => pg().result(remove.sound, [id, locale])
};