const Route = require("../../classes/Route");

module.exports = class extends Route {
	constructor(app) {
		super(app);
	}

	run() {
		this.app.get(`${this.web}/:endpoint`, (req, res, next) => this.app._middlewares.get("pro").run(req, res, next), (req, res) => {
			const { endpoint = "" } = req.params;

			this.app._endpoints.get(endpoint.toLowerCase()).run(req, res).then(result => {
				if (!Object.keys(result).includes("status")) result.status = 200;

				this.app.emit("stats", req, result);

				res.status(result.status).send(result);
			});
		});
	}
};