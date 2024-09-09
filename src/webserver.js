"use strict";

import http from "http";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { EmployeesDB } from "./db/employees.js";
import OpenApiValidator from "express-openapi-validator";
import { EmployeesController } from "./controllers/employees-controller.js";
import swaggerDocument from "./controllers/employees-controller.json" assert { type: "json" };

export default class Webserver {
	app;
	port;

	async createServer() {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);

		this.app = express();
		this.app.use(express.json());
		this.app.use(express.static(path.join(__dirname, "../public")));
		this.app.set("views", path.join(__dirname, "../views"));
		this.app.set("view engine", "ejs");

		// The order of this is critical
		this._01DefineBasicRoutes();
		this._02InitializeValidatorMiddleware();
		this._03DefineDatabaseRoutes();
		this._04HandleErrors();
		this._05AllowExpressCORS();
		await this._06MakeHTTPServer();
	}

	_01DefineBasicRoutes() {
		// Webservice tester
		this.app.get("/", (req, res) => {
			console.log(`${new Date().toJSON()} GET: /`);
			res.render("pages/home", {
				title: "ARC101 Demo Web App",
				dttm: new Date(),
				pages: [
					{ label: "DTTM", url: "/dttm" },
					{ label: "API Docs", url: "/openApi" },
					{ label: "JSON", url: "/openApi.json" },
					{ label: "Encryption Games - Game #1", url: "/encryptionGamesGame1" },
					{ label: "Encryption Games - Game #2", url: "/encryptionGamesGame2" },
				],
			});
		});
		this.app.get("/dttm", (req, res) => {
			console.log(`${new Date().toJSON()} GET: /dttm`);
			res.json({ date: new Date() });
		});
		this.app.get("/encryptionGamesGame1", (req, res) => {
			console.log(`${new Date().toJSON()} GET: /encryptionGamesGame1`);
			res.render("pages/encryptionGamesGame1", {
				title: "Encryption Games Calculator - Game #1",
				dttm: new Date(),
			});
		});
		this.app.get("/encryptionGamesGame2", (req, res) => {
			console.log(`${new Date().toJSON()} GET: /encryptionGamesGame2`);
			res.render("pages/encryptionGamesGame2", {
				title: "Encryption Games Calculator - Game #2",
				dttm: new Date(),
			});
		});
		this.app.get("/favicon.ico", (req, res) => {
			// 	const favicon = path.join(__dirname, "public", "favicon.ico");
			// 	res.statusCode = 200;
			// 	res.setHeader("Content-Type", "image/x-icon");
			// 	fs.createReadStream(favicon).pipe(res);
			console.log(`${new Date().toJSON()} GET: /favicon.ico`);
			res.status(204).end();
		});

		// HTML page for OpenAPI
		this.app.use("/openApi", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

		// JSON page for OpenAPI
		this.app.get("/openApi.json", (_req, res) => {
			console.log(`${new Date().toJSON()} GET: /openApi.json`);
			res.json(swaggerDocument);
		});
	}

	_02InitializeValidatorMiddleware() {
		this.app.use(
			OpenApiValidator.middleware({
				apiSpec: swaggerDocument,
				validateRequests: true, // (default)
				validateResponses: true, // false by default
			})
		);
	}

	_03DefineDatabaseRoutes() {
		EmployeesController.registerRoutes(this.app, new EmployeesDB());
	}

	_04HandleErrors() {
		this.app.use((err, _req, res, _next) => {
			console.error(err);
			res.status(err.status || 500).json({
				message: err.message,
				errors: err.errors,
			});
		});
	}

	_05AllowExpressCORS() {
		this.app.use((req, res, next) => {
			// console.log("CORS: Web");
			res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
			res.header("Access-Control-Allow-Credentials", "true");
			res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
			res.header("Access-Control-Expose-Headers", "Content-Length");
			res.header("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-Requested-With, Range");
			if (req.method === "OPTIONS") {
				return res.sendStatus(200);
			} else {
				return next();
			}
		});
	}

	_06MakeHTTPServer() {
		return new Promise((resolve, reject) => {
			const httpServer = http.createServer(this.app);
			const HTTP_PORT = process.env.PORT;
			let serverURL = "";
			if (process.env.DYNO) {
				serverURL = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
			} else {
				serverURL = `http://localhost:${HTTP_PORT}`;
			}
			httpServer.listen(HTTP_PORT, () => {
				console.log(`HTTP Server running at: ${serverURL}/`);
				resolve();
			});
		});
	}
}
