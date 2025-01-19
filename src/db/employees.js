"use strict";

export class EmployeesDB {
	employees = [
		{
			id: 0,
			lastName: "Al",
			firstName: "Coholic",
			title: "Beverage Manager",
		},
		{
			id: 1,
			lastName: "Juana",
			firstName: "Buy",
			title: "Account Executive",
		},
	];

	getAll() {
		return this.employees;
	}

	get(employeeId) {
		employeeId = +employeeId;
		const employee = this.employees.find((e) => e.id === employeeId);
		if (!employee) throw new Error(`Employee with ID ${employeeId} not found (1)`);
		return employee;
	}

	add(employeeDetails) {
		// Calculate employeeId (max + 1)
		const maximumId = this.employees.map((e) => e.id).reduce((maxId, currentId) => (currentId > maxId ? currentId : maxId));
		const employeeId = maximumId + 1;
		// Add employee
		this.employees.push({
			id: employeeId,
			...employeeDetails,
		});
		return employeeId;
	}

	update(employeeId, employeeDetailsToUpdate) {
		employeeId = +employeeId;
		const employeeIndex = this._findEmployeeById(employeeId);
		this.employees[employeeIndex] = {
			...this.employees[employeeIndex],
			...employeeDetailsToUpdate,
		};
		return this.employees[employeeIndex];
	}

	delete(employeeId) {
		employeeId = +employeeId;
		const employeeIndex = this._findEmployeeById(employeeId);
		this.employees.splice(employeeIndex, 1);
		return { deleted: employeeId };
	}

	_findEmployeeById(employeeId) {
		employeeId = +employeeId;
		const employeeIndex = this.employees.findIndex((e) => e.id === employeeId);
		if (employeeIndex === -1) throw new Error(`Employee with ID ${employeeId} not found (2)`);
		return employeeIndex;
	}
}
