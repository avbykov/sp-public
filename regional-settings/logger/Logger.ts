import pkg from "log4js";
const { configure } = pkg;

const logger: pkg.Logger = configure({
	appenders: {
		'stdout' : { type: 'stdout' },
		'file'   : { type: 'file', filename: 'logs/out.log' }
	},
	categories: {
		default:  { appenders: [ 'stdout', 'file' ], level: 'info', enableCallStack: true }
	}
}).getLogger();

export {logger};