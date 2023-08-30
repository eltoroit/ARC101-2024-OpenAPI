"use strict";

import { EmployeeNotFoundError } from "./employee-not-found-error.js";

export class EmployeesService {
	employees = [
		{
			id: 0,
			lastName: "Peacock",
			firstName: "Margaret",
			title: "Sales Representative",
		},
		{
			id: 1,
			lastName: "Fuller",
			firstName: "Andrew",
			title: "Vice President, Sales",
		},
	];

	getAll() {
		return this.employees;
	}

	get(employeeId) {
		const employee = this.employees.find((e) => e.id === employeeId);
		if (!employee) throw new EmployeeNotFoundError(employeeId);
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
		const employeeIndex = this._findEmployeeById(employeeId);
		this.employees[employeeIndex] = {
			...this.employees[employeeIndex],
			...employeeDetailsToUpdate,
		};
		return this.employees[employeeIndex];
	}

	delete(employeeId) {
		const employeeIndex = this._findEmployeeById(employeeId);
		this.employees.splice(employeeIndex, 1);
		return { deleted: employeeId };
	}

	_findEmployeeById(employeeId) {
		const employeeIndex = this.employees.findIndex((e) => e.id === employeeId);
		if (employeeIndex === -1) throw new EmployeeNotFoundError(employeeId);
		return employeeIndex;
	}
}
