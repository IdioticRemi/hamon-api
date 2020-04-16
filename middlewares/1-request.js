const Middleware = require("../classes/Middleware");
const moment = require("moment");
moment.locale("fr");

module.exports = class extends Middleware {
	constructor(app) {
		super(app);

		this.global = true;
	}

	run(req, res, next) {
		if (req.path === "/favicon.ico") return;
		if (!req.path.startsWith("/assets/")) {
			this.app.reqCount += 1;

			const time = moment().format("L LTS");

			console.log(`[${this.app.reqCount}] [${time}] [${req.method.toUpperCase()}:${req.path}] IP: ${req.ip.replace(/::ffff:/g, "")} | ${JSON.stringify(req.query)}`);
		}

		next();
	}
};