const Endpoint = require("../../classes/Endpoint");
const path = require("path");
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
			const mask = await Jimp.read(path.resolve(path.join(__dirname, "../../assets/img/brand/Hamon--WHITE.jpg")));

			img.resize(128, 128);
			img.mask(mask, 0, 0);

			if (render === "base64") {
				const dataURL = await img.getBase64Async(img.getMIME());
				return {dataURL: dataURL};
			} else {
				const buffer = await img.getBufferAsync(img.getMIME());
				return {buffer:buffer};
			}
		} catch (e) {
			console.log(e);
			return {status: 400, message: "Invalid image URL."};
		}
	}
};