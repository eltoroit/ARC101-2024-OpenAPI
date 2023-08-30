"use strict";

import express from "express";
import swaggerUi from "swagger-ui-express";
import OpenApiValidator from "express-openapi-validator";
import { EmployeesDB } from "./services/employees-database.js";
import { EmployeesController } from "./controllers/employees-controller.js";
import swaggerDocument from "./controllers/employees-controller.json" assert { type: "json" };

const app = express();
const port = 3000;

app.get("/swagger.json", (_req, res) => res.json(swaggerDocument));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use(
	OpenApiValidator.middleware({
		apiSpec: swaggerDocument,
		validateRequests: true, // (default)
		validateResponses: true, // false by default
	})
);

EmployeesController.registerRoutes(app, new EmployeesDB());
app.use((err, _req, res, _next) => {
	console.error(err);
	res.status(err.status || 500).json({
		message: err.message,
		errors: err.errors,
	});
});

app.listen(port);

console.log("Employees API server started on port " + port);
