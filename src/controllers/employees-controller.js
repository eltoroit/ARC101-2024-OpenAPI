export class EmployeesController {
	static registerRoutes(app, service) {
		app.get("/employees", (_req, res) => {
			console.log(`${new Date().toJSON()} GET: /employees`);
			res.json(service.getAll());
		});

		app.post("/employees", (req, res) => {
			console.log(`${new Date().toJSON()} POST: /employees`);
			const employeeId = service.add(req.body);
			res.json({ id: employeeId });
		});

		app.get("/employees/:employeeId", (req, res) => {
			console.log(`${new Date().toJSON()} GET: /employees/${req.params.employeeId}`);
			res.json(service.get(req.params.employeeId));
		});

		app.put("/employees/:employeeId", (req, res) => {
			console.log(`${new Date().toJSON()} PUT: /employees/${req.params.employeeId}`);
			res.json(service.update(req.params.employeeId, req.body));
		});

		app.delete("/employees/:employeeId", (req, res) => {
			console.log(`${new Date().toJSON()} DELETE: /employees/${req.params.employeeId}`);
			service.delete(req.params.employeeId);
			res.sendStatus(200);
		});
	}
}
