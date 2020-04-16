const Route = require("../classes/Route");

module.exports = class extends Route {
	constructor(app) {
		super(app);
	}

	run() {
		this.app.get(this.web, async (req, res) => {
			const code = req.query.code;

			if (!code) res.status(400).send({status: 400, message: "Cannot find Auth token in query fields. Try again!"});

			else {
				const key = await this.app.oauth.getAccess(code);
				const user = await this.app.oauth.getAuthorizedUser(key);

				const dbUser = await this.app.UserDB.findOne({ userID: user.id.toString() });
				if (!dbUser) {
					const stats = await new this.app.StatsDB();
					const newUser = new this.app.UserDB({ stats: stats._id, userID: user.id.toString() });

					await stats.save().catch(console.error);
					await newUser.save().catch(console.error);
				}
				res.cookies.set("key", key);

				res.redirect("/");
			}
		});
	}
};