`use strict`;

const express = require(`express`);
const app = express();
const bodyParser = require('body-parser');
const http = require(`http`);
const {connect, disconnect} = require(`./db`);
const router = require(`./routes`).router;
const fs = require(`fs`);
const logger = require(`./logger`).logger;
const serviceName = JSON.parse(fs.readFileSync(`./package.json`, `utf-8`)).name;
const v1url = `/api/sp/resources/v1`;
const port = process.env.org_enc_sp_resources_port;

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
app.use(v1url, router);

const terminate = async () => {
	await disconnect();
	process.exit(1);
}

process.on(`exit`, () => logger.info(`'${serviceName}' service is shut down`));
process.on(`SIGINT`, async () => await terminate());
process.on(`SIGUSR1`, async () => await terminate());
process.on(`SIGUSR2`, async () => await terminate());
process.on(`uncaughtException`, async () => await terminate());

http.createServer(app).listen(port, async () => {
	logger.info(`'${serviceName}' service is starting at ${port}`);
	let errorMessage = await connect();
	const connectionAttempts = parseInt(process.env.org_enc_sp_resources_ds_connection_attempts);
	for (let i = 0; i < connectionAttempts && errorMessage !== null; i++) {
		logger.warn(`${i + 1} of ${connectionAttempts} connection attempts failed with message '${errorMessage}', reconnecting...`);
		errorMessage = await connect();
	}
	if (errorMessage) {
		await terminate();
		logger.error(`'${serviceName}' service failed to connect to databases, shutting down...`);
	} else {
		logger.info(`'${serviceName}' service is running at ${port}, connected to databases`);
	}
});