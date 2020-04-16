const EventBase = require("../classes/Event");
const moment = require("moment");
moment.locale("fr");

module.exports = class extends EventBase {
	constructor(app) {
		super(app);
	}

	async run(req, result) {
		if ([...this.app._routes.values()].find(r => r.web === req.path.toLowerCase()) !== undefined || [...this.app._endpoints.values()].find(e => e.web === req.path.toLowerCase()) !== undefined) {
			const endpoint = [...this.app._endpoints.values()].find(e => e.web === req.path.toLowerCase()) || [...this.app._routes.values()].find(r => r.web === req.path.toLowerCase());
			const today = moment().format("L");
			const now = Date.now();

			const user = await this.app.UserDB.findOne({ token: req.header("x-auth-token") });
			const stats = await this.app.StatsDB.findOne({ _id: user.stats });

			if (!user) return false;

			if (!stats.reqs[today]) stats.reqs[today] = [];

			stats.reqs.last = now;
			stats.reqs[today].push({
				path: endpoint.web,
				date: now,
				status: result.status,
				message: result.message || null
			});

			await this.app.StatsDB.findOneAndUpdate({ _id: user.stats }, {
				$set: { reqs: stats.reqs }
			}).catch(console.error);
		}
	}
};