const Route = require("../classes/Route");

module.exports = class extends Route {
	constructor(app) {
		super(app);
	}

	run() {
		this.app.get(this.web, async (req, res) => {
			const key = req.cookies.get("key") || null;

			this.app.oauth.getAuthorizedUser(key).then(() => {
				delete this.app.oauth.accesses[key];
			}).catch(e => {
				res.cookies.set("key", null);
			});

			res.cookies.set("key", null);
			res.redirect("/");
		});
	}
};