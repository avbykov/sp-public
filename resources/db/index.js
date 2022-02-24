`use strict`;

const logger = require(`../logger`).logger;
const pgp = require(`pg-promise`)({schema: `org.enc.sp`});
const redis = require(`redis`);


const pg = pgp({
    user: process.env.org_enc_sp_resources_postgres_user,
    password: process.env.org_enc_sp_resources_postgres_password,
    host: process.env.org_enc_sp_resources_postgres_host,
    port: process.env.org_enc_sp_resources_postgres_port,
    database: process.env.org_enc_sp_resources_postgres_db_name
});

const rs = redis.createClient({
    url: process.env.org_enc_sp_resources_redis_url,
    username: process.env.org_enc_sp_resources_redis_username,
    password: process.env.org_enc_sp_resources_redis_password,
    name: process.env.org_enc_sp_resources_redis_db_name
});

const disconnect = () => {
    rs.quit().then(() => logger.info(`Disconnected from Redis`)).catch(err => logger.error(err));
    pg.$pool.end().then(() => logger.info(`Disconnected from Postgres`)).catch(err => logger.error(err));
};

const connect = () => {
    rs.connect().then(() => {
        logger.info(`Resources service is running at ${process.env.org_enc_sp_resources_port}, connected to Redis`);
    }).catch(err => {
        disconnect();
        logger.error(err);
        process.exit();
    });
};

module.exports.pg = pg;
module.exports.query = path => new pgp.QueryFile(path, {minify: true});
module.exports.rs = rs;
module.exports.disconnect = disconnect;
module.exports.connect = connect;