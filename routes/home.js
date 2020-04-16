const Route = require("../classes/Route");

module.exports = class extends Route {
	constructor(app) {
		super(app);

		this.web = "/"
	}

	run() {
		this.app.get(this.web, async (req, res) => {
			const key = req.cookies.get("key");

			if (key) {
				this.app.oauth.getAuthorizedUser(key).then(user => {
					res.render("home", { user: user, alert: false, url: this.app.oauth.getAuthCodeLink() });
				}).catch(e => {
					req.cookies.set("key", null);
					res.render("home", { user: null, alert: true, url: this.app.oauth.getAuthCodeLink() });
				});
			} else {
				res.render("home", { user: null, alert: false, url: this.app.oauth.getAuthCodeLink() });
			}
		});
	}
};