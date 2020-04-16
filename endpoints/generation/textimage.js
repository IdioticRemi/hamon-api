const Endpoint = require("../../classes/Endpoint");
const { Canvas } = require("canvas-constructor");
const fetch = require("node-fetch");

module.exports = class extends Endpoint {
	constructor(app) {
		super(app);
	}

	async run(req, res) {
		const { color = "FFFFFF", text = "No text provided...", url } = req.query;
		const hexRegExp = /#([A-Fa-f0-9]{6})|([A-Fa-f0-9]{6})$/;

		if (!url) return {status: 400, message: "Could not find query 'url' in request."};

		try {
			const result = await fetch(url.toString().replace(/\?size=2048$/g, "?size=128"), { timeout: 2000 });
			if (!result.ok) return {status: 400, message: "Invalid image URL."};
			const img = await result.buffer();

			if (!color.match(hexRegExp) || color.length !== 6) {
				return {status: 400, message: "Invalid hex color code."}
			}

			const canvas = new Canvas(512, 512)
				.addImage(img, 0, 0, 512, 512)
				.setGlobalAlpha(0.75)
				.setColor("#000000")
				.addRect(0, 361, 512, 46)
				.setGlobalAlpha(1)
				.setTextSize(40)
				.setColor(`#${color}`)
				.setTextAlign("center")
				.addText(text, 256, 399, 450);

			return {buffer:canvas.toBuffer()};
		} catch (e) {
			return {status: 400, message: "Invalid image URL."};
		}
	}
};