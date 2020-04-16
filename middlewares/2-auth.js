const Middleware = require("../classes/Middleware");

module.exports = class extends Middleware {
	constructor(app) {
		super(app);

		this.global = true;
	}

	run(req, res, next) {
		if (req.path.startsWith("/api/")) {
			const token = req.header("x-auth-token") || null;

			if (!token) return res.status(401).send({
				"status": 401,
				"message": "Could not find field 'x-auth-token' in request headers."
			});

			this.app.UserDB.findOne({ token: token }).then(user => {
				if (!user) return res.status(403).send({
					"status": 403,
					"message": "Auth token is invalid."
				});

				next();
			}).catch(console.error);
		} else {
			next();
		}
	}
};
