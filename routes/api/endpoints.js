const Route = require("../../classes/Route");

module.exports = class extends Route {
	constructor(app) {
		super(app);
	}

	run() {
		this.app.get(this.web, async (req, res) => {
			if (req.query["render"] === "array") {
				this.app.emit("stats", req, {status: 200});

				res.status(200).send([...this.app._endpoints.keys()]);
			} else {
				const endpoints = {
					pro: {},
					standard: {}
				};

				[...this.app._endpoints.values()].forEach(e => {
					if (e.pro === true) {
						if (!endpoints["pro"][e.path.split("/")[e.path.split("/").length - 2]]) {
							endpoints["pro"][e.path.split("/")[e.path.split("/").length - 2]] = [];
						}

						endpoints["pro"][e.path.split("/")[e.path.split("/").length - 2]].push(e.name);
					} else {
						if (!endpoints["standard"][e.path.split("/")[e.path.split("/").length - 2]]) {
							endpoints["standard"][e.path.split("/")[e.path.split("/").length - 2]] = [];
						}

						endpoints["standard"][e.path.split("/")[e.path.split("/").length - 2]].push(e.name);
					}
				});

				this.app.emit("stats", req, {status: 200});

				res.status(200).send(endpoints);
			}
		});
	}
};