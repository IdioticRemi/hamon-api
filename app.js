const express = require("express");
const cookieParser = require("cookie-parser");
const Cookies = require("cookies");
const OAuth = require("disco-oauth");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");

const SSL = {
	key: fs.readFileSync('./ssl/privatekey.pem'),
	cert: fs.readFileSync('./ssl/certificate.pem')
};

const EventEmitter = require("events").EventEmitter;

const aggregation = require("./aggregation");
const loader = require("./loader");

let oauth = new OAuth("OAuthID", "OAuthSecret");

oauth.setScopes(["identify"]);
oauth.setRedirect("redirectUri (/login)");

mongoose.connect("mongodb://user:password@host/database", {useNewUrlParser: true})
	.then(() => console.log("Connected to MongoDB server!"))
	.catch(err => console.error(err.stack));

class HamonAPI extends aggregation(express, EventEmitter) {
	constructor() {
		super();
		this.oauth = oauth;

		this.UserDB = new mongoose.model("users", new mongoose.Schema({
			token: {type: String, default: null},
			ships: {type: Array, default: []},
			stats: mongoose.Types.ObjectId,
			userID: String
		}));

		this.StatsDB = new mongoose.model("stats", new mongoose.Schema({
			reqs: {
				type: Object, default: {
					last: Date.now()
				}
			},
			last: String
		}));

		this.reqCount = 0;

		this._middlewares = new Map();
		this._endpoints = new Map();
		this._routes = new Map();
		this._events = new Map();
	}
}

const app = new HamonAPI();

app.enable("trust proxy");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(Cookies.express());

app.use("/assets", express.static("assets"));

loader(app).then(() => {
	https.createServer(SSL, app).listen(443, () => app.emit("ready"));
});
