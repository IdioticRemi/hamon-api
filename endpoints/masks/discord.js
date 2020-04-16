const Endpoint = require("../../classes/Endpoint");
const path = require("path");
const Jimp = require("jimp");

module.exports = class extends Endpoint {
	constructor(app) {
		super(app);
	}

	async run(req, res) {
		const { url, render = "buffer", type: ty = 0 } = req.query;

		if (!url) return {status: 400, message: "Could not find query 'url' in request."};

		const type = parseInt(ty.toString());

		if (![0, 1].includes(type)) return {status: 400, message: "Invalid 'type' query in request: 'type' query has to be a number: 0 or 1"};

		try {
			const img = await Jimp.read(url);
			const mask = await Jimp.read(path.resolve(path.join(__dirname, type === 0 ? "../../assets/img/brand/Discord--WHITE-2.jpg" : "../../assets/img/brand/Discord--WHITE.jpg")));
			mask.resize(128, 128);

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