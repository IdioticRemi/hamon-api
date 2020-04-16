const Endpoint = require("../../classes/Endpoint");
const { Canvas } = require("canvas-constructor");

module.exports = class extends Endpoint {
	constructor(app) {
		super(app);
	}

	async run(req, res) {
		const { color = "#FFFFFF", background = "#000000" } = req.query;
		const hexRegExp = /#([A-Fa-f0-9]{6})|([A-Fa-f0-9]{6})$/;

		if (!color.match(hexRegExp) || !background.match(hexRegExp)) {
			return {status: 400, message: "Invalid hex color code."};
		}

		const canvas = new Canvas(500, 100)
			.setColor(background.startsWith("#") ? background : `#${background}`)
			.addRect(0, 0, 500, 100)
			.setColor(color.startsWith("#") ? color : `#${color}`)
			.setTextAlign("center")
			.setTextSize(75)
			.addText(req.query["text"] ? req.query["text"].toUpperCase() : "No Text".toUpperCase(), 250, 80, 460);

		return {buffer: canvas.toBuffer()};
	}
};