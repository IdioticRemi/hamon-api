const EventBase = require("../classes/Event");

module.exports = class extends EventBase {
	constructor(app) {
		super(app);
	}

	run() {
		console.log("Successfully started on port 3000!");
	}
};