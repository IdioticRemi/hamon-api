const Middleware = require("../classes/Middleware");

module.exports = class extends Middleware {
	constructor(app) {
		super(app);
	}

	run(req, res, next) {
		const token = req.header("x-auth-token") || null;

		if (!token) return res.send({
			"status": 401,
			"message": "Could not find field 'x-auth-token' in request headers."
		});

		this.app.UserDB.findOne({ token: token }).select("ships -_id").then(user => {
			if (!user) return res.send({
				"status": 400,
				"message": "Auth token is invalid."
			});

			const { endpoint: ep = "" } = req.params;

			if (!ep || ![...this.app._endpoints.keys()].includes(ep.toLowerCase())) return res.status(404).send({status: 404, message: "Endpoint not found."});

			const endpoint = this.app._endpoints.get(ep.toLowerCase());

			if (endpoint.pro === true && !user.ships.includes("pro")) return res.send({
				"status": 403,
				"message": "You have to be a PRO user in order to use this endpoint."
			});

			next();
		}).catch(console.error);
	}
};