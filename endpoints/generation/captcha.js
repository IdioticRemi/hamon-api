const Endpoint = require("../../classes/Endpoint");
const { Canvas } = require("canvas-constructor");

module.exports = class extends Endpoint {
	constructor(app) {
		super(app);
	}

	async run(req, res) {
		let { length = "6" } = req.query;
		length = parseInt(length);

		if (isNaN(length) || length === 0 || length > 12) {
			return {status: 400, message: "Invalid length query (have to be lower or equal to 12 and not equal to 0)"}
		}

		const code = this.createCode(length);

		const canvas = new Canvas(350, 100)
			.setColor("#2b2024")
			.addRect(0, 0, 500, 100)
			.setColor("#fd0054")
			.setStroke("#2b2024")
			.setTextAlign("center")
			.setTextSize(75)
			.addText(code, 175, 80, 310);

		const yLines = this.randomNumber(5, 3);
		const xLines = this.randomNumber(3, 2);

		for (let i = 0; i <= yLines; i++) {
			canvas.beginPath()
				.setLineWidth(3)
				.moveTo(this.randomNumber(350), 1)
				.lineTo(this.randomNumber(350), 100)
				.stroke();
		}
		for (let i = 0; i <= xLines; i++) {
			canvas.beginPath()
				.setLineWidth(3)
				.moveTo(1, this.randomNumber(100))
				.lineTo(350, this.randomNumber(100))
				.stroke();
		}

		return {code: code, buffer: canvas.toBuffer()};
	}

	createCode (length) {
		let text = "";
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	randomNumber (max, min = 1) {
		return Math.floor((Math.random() * max) + min);
	}
};