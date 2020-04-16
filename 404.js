const Endpoint = require("./classes/Endpoint");

module.exports = class extends Endpoint {
	constructor(app) {
		super(app);

		this.web = "*"
	}

	run() {
		this.app.get(this.web, async (req, res) => {
			if (req.path.toLowerCase().startsWith("/api")) {
				res.status(404).send({status: 404, message: `Cannot find path '${req.path.toLowerCase()}'.`})
			} else {
				res.render("404");
			}
		});
	}
};