const Route = require("../classes/Route");
const moment = require("moment");
moment.locale("fr");

module.exports = class extends Route {
	constructor(app) {
		super(app);
	}

	run() {
		this.app.get(this.web, async (req, res) => {
			const key = req.cookies.get("key");

			if (key) {
				this.app.oauth.getAuthorizedUser(key).then(async user => {
					const dbUser = await this.app.UserDB.findOne({ userID: user.id.toString() });
					const stats = await this.app.StatsDB.findOne({ _id: dbUser.stats });

					const days = [
						moment().subtract(6, 'days').format("L"),
						moment().subtract(5, 'days').format("L"),
						moment().subtract(4, 'days').format("L"),
						moment().subtract(3, 'days').format("L"),
						moment().subtract(2, 'days').format("L"),
						moment().subtract(1, 'days').format("L"),
						moment().format("L")
					], data = [[], [], []];

					days.forEach(d => {
						data[0].push(stats.reqs[d] ? stats.reqs[d].length : 0);
						data[1].push(stats.reqs[d] ? stats.reqs[d].filter(r => r.status !== 200).length : 0);
						data[2].push(stats.reqs[d] ? stats.reqs[d].filter(r => r.status === 200).length : 0);
					});

					res.render("profile", { user: user, alerts: [], dbUser: dbUser, data: data, keys: days });
				}).catch(e => {
					res.redirect("/");
				});
			} else {
				res.redirect("/");
			}
		});

		this.app.post(this.web, async (req, res) => {
			const key = req.cookies.get("key");

			if (key) {
				this.app.oauth.getAuthorizedUser(key).then(async user => {
					const token = await this.checkToken();
					const dbUser = await this.app.UserDB.findOneAndUpdate({ userID: user.id.toString() }, {
						$set: { token: token }
					}, { new: true });
					const stats = await this.app.StatsDB.findOne({ _id: dbUser.stats });

					const days = [
						moment().subtract(6, 'days').format("L"),
						moment().subtract(5, 'days').format("L"),
						moment().subtract(4, 'days').format("L"),
						moment().subtract(3, 'days').format("L"),
						moment().subtract(2, 'days').format("L"),
						moment().subtract(1, 'days').format("L"),
						moment().format("L")
					], data = [[], [], []];

					days.forEach(d => {
						data[0].push(stats.reqs[d] ? stats.reqs[d].length : 0);
						data[1].push(stats.reqs[d] ? stats.reqs[d].filter(r => r.status !== 200).length : 0);
						data[2].push(stats.reqs[d] ? stats.reqs[d].filter(r => r.status === 200).length : 0);
					});

					res.render("profile", { user: user, alerts: ["token"], dbUser: dbUser, data: data, keys: days });
				}).catch(e => {
					res.redirect("/");
				});
			} else {
				res.redirect("/");
			}
		});
	}

	async checkToken (token = this.generateID(64)) {
		const res = await this.app.UserDB.find({ token: token }).limit(1);
		if (res.length > 0) {
			token = this.generateID(64);
			await this.checkToken(token);
		}
		else return token;
	}

	generateID (length) {
		let text = "";
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ._-abcdefghijklmnopqrstuvwxyz._-0123456789";

		for (let i = 0; i < length; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}
};