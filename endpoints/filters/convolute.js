const Endpoint = require("../../classes/Endpoint");
const Jimp = require("jimp");

module.exports = class extends Endpoint {
	constructor(app) {
		super(app);
	}

	async run(req, res) {
		const { url, render = "buffer" } = req.query;

		if (!url) return {status: 400, message: "Could not find query 'url' in request."};

		try {
			const img = await Jimp.read(url);

			img.resize(128, 128);
			img.convolute([[-2, -1, 0], [-1, 1, 1], [0, 1, 2]]);

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