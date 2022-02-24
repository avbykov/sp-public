`use strict`;

const express = require(`express`);
const app = express();
const bodyParser = require('body-parser');
const http = require(`http`);
const db = require(`./db`);
const router = require(`./routes`).router;

const v1url = `/api/sp/resources/v1`;

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
app.use(v1url, router);

// process.on('SIGINT', () => db.disconnect());
// process.on('SIGTERM', () => db.disconnect());

http.createServer(app).listen(process.env.org_enc_sp_resources_port, async () => {
	db.connect();
});