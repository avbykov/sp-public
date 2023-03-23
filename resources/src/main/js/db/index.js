`use strict`;

const logger = require(`../logger`).logger;
const pgp = require(`pg-promise`)(null);//({schema: `org.enc.sp`});
const redis = require(`redis`);


let pg;
let rs;

const connect = async () => {
	const pgConnection = {
		user: process.env.org_enc_sp_resources_postgres_user,
		password: process.env.org_enc_sp_resources_postgres_password,
		host: process.env.org_enc_sp_resources_postgres_host,
		port: process.env.org_enc_sp_resources_postgres_port,
		database: process.env.org_enc_sp_resources_postgres_db_name
	};
	logger.info(`Connecting to Postgres... ` + JSON.stringify(pgConnection));
	pg = pgp(pgConnection);
	logger.info(`Connected to Postgres`)

	if (pg) {
		const redisOptions = {
			url: `redis://${process.env.org_enc_sp_resources_redis_host}:${process.env.org_enc_sp_resources_redis_port}`
		};
		logger.info(`Creating Redis Client with url ` + JSON.stringify(redisOptions));
		rs = redis.createClient(redisOptions);
		if (rs) {
			logger.info(`Connecting to Redis...`)
			return rs.connect()
				.then(() => {
					logger.info(`Connected to Redis`)
					return null;
				})
				.catch(rsErr => pg.$pool.end()
					.then(() => `Couldn't connect to Redis due to ${rsErr.message}, disconnected from Postgres`)
					.catch(pgErr => `Couldn't connect to Redis due to ${rsErr.message} and disconnect from Postgres due to ${pgErr.message}`));
		} else {
			logger.info(`Couldn't connect to Redis`)
			return Promise.reject(`Couldn't connect to Redis`);
		}
	} else {
		logger.info(`Couldn't connect to Postgres`)
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
