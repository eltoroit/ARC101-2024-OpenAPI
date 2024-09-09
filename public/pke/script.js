export default class InputHandler {
	values = {};

	changedInput(name) {
		const input = document.getElementById(name);
		const div = document.getElementById(`${name}.div`);
		const error = document.getElementById(`${name}.error`);
		const number = Number(input.value);

		document.getElementById("g1Encrypt").disabled = true;
		document.getElementById("g1Decrypt").disabled = true;

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

		if (name === "g1Decrypted") {
			document.getElementById("g1Encrypt").disabled = false;
		}
		if (name === "g1Encrypted") {
			document.getElementById("g1Decrypt").disabled = false;
		}
	}

	async g1Encrypt() {
		const encrypted = this.values.g1Decrypted * this.values.g1SharedSecret;
		const msg = `Please share this value: ${encrypted.toLocaleString()}`;
		document.getElementById("g1EncryptedResult").value = msg;
		await navigator.clipboard.writeText(encrypted);
		setTimeout(() => {
			alert(msg);
		}, 10);
	}

	g1Decrypt() {
		const decrypted = this.values.g1Encrypted / this.values.g1SharedSecret;
		const msg = `Please share this value: ${decrypted.toLocaleString()}`;
		document.getElementById("g1DecryptedResult").value = msg;
		setTimeout(() => {
			alert(msg);
		}, 10);
	}
}
