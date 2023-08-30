export class EmployeesController {
	static registerRoutes(app, service) {
		app.get("/employees", (_req, res) => res.json(service.getAll()));

		app.post("/employees", (req, res) => {
			const employeeId = service.add(req.body);
			res.json({ id: employeeId });
		});

		app.get("/employees/:employeeId", (req, res) => {
			res.json(service.get(req.params.employeeId));
		});

		app.put("/employees/:employeeId", (req, res) => {
			res.json(service.update(req.params.employeeId, req.body));
		});

		app.delete("/employees/:employeeId", (req, res) => {
			service.delete(req.params.employeeId);
			res.sendStatus(200);
		});
	}
}
