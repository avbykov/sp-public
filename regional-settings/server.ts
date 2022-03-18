import express from "express";
import bodyParser from "body-parser";
import * as http from "http";
import { dsLocator } from "./ds/DsLocator.js";
import { router } from "./routes/Routes.js";
import { logger } from "./logger/Logger.js";
import fs from "fs";


const serviceName: string = JSON.parse(fs.readFileSync(`./package.json`, {encoding: `utf-8`})).name;
const v1url: string = `/api/sp/locales/v1`;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(v1url, router);

const server = http.createServer(app);

const terminate = () => {
	dsLocator.acquire(dsName).disconnect()
		.then(() => {
			logger.info(`Disconnected from ${dsName}`);
			process.exit(1);
		})
		.catch(err => {
			logger.error(err);
			process.exit(1);
		});
};

process.on(`exit`, () => logger.info(`'${serviceName}' service is shut down`));
process.on(`SIGINT`, terminate);
process.on(`SIGUSR1`, terminate);
process.on(`SIGUSR2`, terminate);
process.on(`uncaughtException`, terminate);


const port: number = parseInt(process.env.org_enc_sp_locales_port);
const dsName: string = process.env.org_enc_sp_locales_ds;

server.listen(port, async () => {
	const ds = dsLocator.acquire(dsName);
	let errorMessage: string = await ds.connect();
	const connectionAttempts: number = parseInt(process.env.org_enc_sp_locales_ds_connection_attempts);
	logger.info(`'${serviceName}' service is starting at ${port}, connecting to ${dsName}`);
	for (let i: number = 0; i < connectionAttempts && errorMessage !== null; i++) {
		logger.warn(`${i + 1} of ${connectionAttempts} connection attempts failed with message '${errorMessage}', reconnecting...`);
		errorMessage = await ds.connect();
	}
	if (errorMessage) {
		logger.error(`'${serviceName}' service failed to connect to ${dsName}, shutting down...`);
		terminate();
	} else {
		logger.info(`'${serviceName}' service is running at ${port}, connected to ${dsName}`);
	}
});
