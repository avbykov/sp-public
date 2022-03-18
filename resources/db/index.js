`use strict`;

const logger = require(`../logger`).logger;
const pgp = require(`pg-promise`)({schema: `org.enc.sp`});
const redis = require(`redis`);


let pg;
let rs;

const connect = async () => {
	logger.info(`Connecting to Postgres...`)
	pg = pgp({
		user: process.env.org_enc_sp_resources_postgres_user,
		password: process.env.org_enc_sp_resources_postgres_password,
		host: process.env.org_enc_sp_resources_postgres_host,
		port: process.env.org_enc_sp_resources_postgres_port,
		database: process.env.org_enc_sp_resources_postgres_db_name
	});

	if (pg) {
		rs = redis.createClient({
			url: process.env.org_enc_sp_resources_redis_url,
			username: process.env.org_enc_sp_resources_redis_username,
			password: process.env.org_enc_sp_resources_redis_password,
			name: process.env.org_enc_sp_resources_redis_db_name
		});
		if (rs) {
			logger.info(`Connecting to Redis...`)
			return rs.connect()
				.then(() => null)
				.catch(rsErr => pg.$pool.end()
					.then(() => `Couldn't connect to Redis due to ${rsErr.message}, disconnected from Postgres`)
					.catch(pgErr => `Couldn't connect to Redis due to ${rsErr.message} and disconnect from Postgres due to ${pgErr.message}`));
		} else {
			return Promise.reject(`Couldn't connect to Redis`);
		}
	} else {
		return Promise.reject(`Couldn't connect to Postgres`);
	}
};

const disconnect = async () => {
	await rs.quit().then(() => logger.info(`Disconnected from Redis`)).catch(err => logger.error(err.message));
	await pg.$pool.end().then(() => logger.info(`Disconnected from Postgres`)).catch(err => logger.error(err.message));
};

module.exports.pg = () => pg;
module.exports.query = path => new pgp.QueryFile(path, {minify: true});
module.exports.rs = () => rs;
module.exports.disconnect = disconnect;
module.exports.connect = connect;