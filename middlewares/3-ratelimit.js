const Middleware = require("../classes/Middleware");
const moment = require("moment");
moment.locale("fr");

module.exports = class extends Middleware {
	constructor(app) {
		super(app);

		this.global = true;
	}

	async run(req, res, next) {
		if (req.path.startsWith("/api/")) {
			const token = req.header("x-auth-token");
			const today = moment().format("L");

			const user = await this.app.UserDB.findOne({ token: token });
			const stats = await this.app.StatsDB.findOne({ _id: user.stats });

			if (today in stats.reqs) {
				const sec = stats.reqs[today].filter(r => Date.now() - r.date < 1e3 && r.status !== 429 ).length;
				const min = stats.reqs[today].filter(r => Date.now() - r.date < 6e4 && r.status !== 429 ).length;
				const day = stats.reqs[today].length;

				if (user.ships.includes("partner")) {
					if (min >= 800) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 800/min)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 800/min)"});
					} else if (sec >= 15) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 15/s)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 15/s)"});
					} else if (day >= 1e6) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 1,000,000/day)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 1,000,000/day)"});
					} else next();
				} else if (user.ships.includes("pro")) {
					if (min >= 250) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 250/min)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 250/min)"});
					} else if (sec >= 5) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 15/s)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 15/s)"});
					} else if (day >= 2.5e5) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 250,000/day)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 250,000/day)"});
					} else next();
				} else {
					if (min >= 25) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 25/min)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 25/min)"});
					} else if (sec >= 1) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 1/s)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 1/s)"});
					} else if (day >= 1e4) {
						this.app.emit("stats", req, {status: 429, message: "Rate Limited. (Your limit: 10,000/day)"});
						return res.status(429).send({status: 429, message: "Rate Limited. (Your limit: 10,000/day)"});
					} else next();
				}
			} else next();
		} else {
			next();
		}
	}
};