const Endpoint = require("../../classes/Endpoint");
const Jimp = require("jimp");

module.exports = class extends Endpoint {
	constructor(app) {
		super(app);
	}

	async run(req, res) {
		const { url, render = "buffer" } = req.query;
		let { intensity = 128 } = req.query;

		intensity = parseInt(intensity.toString());

		if (isNaN(intensity) || intensity > 256) return {status: 400, message: "Invalid 'intensity' query field. [0 to 256]"};
		if (!url) return {status: 400, message: "Could not find query 'url' in request."};

		try {
			const img = await Jimp.read(url);

			img.resize(128, 128);
			img.color([{ apply: "red", params: [intensity / 4 * 2] }, { apply: "green", params: [intensity / 4 * 2] }]);

			if (render === "base64") {
				const dataURL = await img.getBase64Async(img.getMIME());
				return {dataURL: dataURL};
			} else {
				const buffer = await img.getBufferAsync(img.getMIME());
				return {buffer:buffer};
			}
		} catch (e) {
			return {status: 400, message: "Invalid image URL."};
		}
	}
};