const fs = require("fs-nextra");
const path = require("path");

async function processRoutePath(app, route_path, _404 = false) {
	const files = await fs.scan(route_path, { filter: (stats, path) => stats.isFile() && (_404 === true ? path.endsWith("404.js") : path.endsWith('.js')) })
		.catch(err => console.log(err));
	if (!files) return;

	return [...files.keys()].forEach((filepath) => {
		filepath = filepath.replace(/\\/g, "/");

		const paths = filepath.split("/");
		const name = paths[paths.length - 1].split(".")[0];
		const ep = new (require(filepath))(app);

		ep.path = filepath;
		ep.name = name;
		ep.web = ep.web || filepath.substring(route_path.length, filepath.length - 3).replace(/\\/g, "/");

		ep.run();

		app._routes.set(name, ep);

		delete require.cache[require.resolve(filepath)];
	});
}

async function processEndpoints(app, endpoint_path) {
	const files = await fs.scan(endpoint_path, { filter: (stats, path) => stats.isFile() && path.endsWith('.js') })
		.catch(err => console.log(err));
	if (!files) return;

	return [...files.keys()].forEach((filepath) => {
		filepath = filepath.replace(/\\/g, "/");

		const paths = filepath.split("/");
		const name = paths[paths.length - 1].split(".")[0];
		const ep = new (require(filepath))(app);

		ep.path = filepath;
		ep.name = name;
		ep.web = `/api/endpoint/${name}`;

		app._endpoints.set(name, ep);

		delete require.cache[require.resolve(filepath)];
	});
}

async function processEvents(app, event_path) {
	const files = await fs.scan(event_path, { filter: (stats, path) => stats.isFile() && path.endsWith('.js') })
		.catch(err => console.log(err));
	if (!files) return;

	return [...files.keys()].forEach((filepath) => {
		filepath = filepath.replace(/\\/g, "/");

		const paths = filepath.split("/");
		const name = paths[paths.length - 1].split(".")[0];
		const file = new (require(filepath))(app);

		file.path = filepath;
		file.name = name;

		app.on(name, (...args) => file.run(...args));

		app._events.set(name, file);

		delete require.cache[require.resolve(filepath)];
	});
}

async function processMiddlewares(app, event_path) {
	const files = await fs.scan(event_path, { filter: (stats, path) => stats.isFile() && path.endsWith('.js') })
		.catch(err => console.log(err));
	if (!files) return;

	return [...files.keys()].forEach((filepath) => {
		filepath = filepath.replace(/\\/g, "/");

		const paths = filepath.split("/");
		const name = paths[paths.length - 1].split(".")[0];
		const file = new (require(filepath))(app);

		file.path = filepath;
		file.name = name;

		if (file.global === true) app.use((req, res, next) => file.run(req, res, next));

		app._middlewares.set(name, file);

		delete require.cache[require.resolve(filepath)];
	});
}

module.exports = async (app) => {
	app.set("view engine", "ejs");

	await processMiddlewares(app, path.join(__dirname, "./middlewares"));
	await processRoutePath(app, path.join(__dirname, "./routes"));
	await processEndpoints(app, path.join(__dirname, "./endpoints"));
	await processEvents(app, path.join(__dirname, "./events"));

	await processRoutePath(app, path.join(__dirname, "./"), true);
};