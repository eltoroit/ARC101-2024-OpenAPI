export default class InputHandler {
	values = {};

	changedInput(name) {
		const input = document.getElementById(name);
		const div = document.getElementById(`${name}.div`);
		const error = document.getElementById(`${name}.error`);
		const number = Number(input.value);

		if (input.validity.valueMissing) {
			error.textContent = "This field is required.";
			input.classList.add("invalid");
			div.classList.add("slds-has-error");
			return false;
		}

		if (input.validity.rangeUnderflow || input.validity.rangeOverflow) {
			error.textContent = "Please enter a valid number.";
			input.classList.add("invalid");
			div.classList.add("slds-has-error");
			return;
		}

		error.textContent = "";
		input.classList.remove("invalid");
		div.classList.remove("slds-has-error");
		this.values[name] = number;
	}

	g1Encrypt() {
		const encrypted = this.values.g1SharedSecret * this.values.g1Value;
		const msg = `Please share this value: ${encrypted.toLocaleString()}`;
		document.getElementById("g1Encrypted").value = msg;
		setTimeout(() => {
			alert(msg);
		}, 10);
	}
}
