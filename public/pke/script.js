import { BigNumber } from "https://cdn.jsdelivr.net/npm/bignumber.js@9.1.2/bignumber.min.mjs";
export default class InputHandler {
	values = {};

	constructor() {
		this.values = {
			p2Prime: 1009,
			p2Generator: 11,
		};
	}

	changedInput(name) {
		const input = document.getElementById(name);
		const div = document.getElementById(`${name}.div`);
		const error = document.getElementById(`${name}.error`);
		const number = Number(input.value);

		if (name[1] === 1) {
			document.getElementById("g1Encrypt").disabled = true;
			document.getElementById("g1Decrypt").disabled = true;
		} else {
			document.getElementById("g2GenerateP1_PN").disabled = true;
			// document.getElementById("g1Decrypt").disabled = true;
		}

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

		if (name === "g1GuardedValue") {
			document.getElementById("g1Encrypt").disabled = false;
		}
		if (name === "g1EncryptedValue") {
			document.getElementById("g1Decrypt").disabled = false;
		}
		if (name === "g2P1_PRIVATE") {
			document.getElementById("g2GenerateP1_PN").disabled = false;
		}
	}

	async g1Encrypt() {
		const encrypted = this.values.g1GuardedValue * this.values.g1SharedKey;
		const msg = `Please share this value: ${encrypted.toLocaleString()}`;
		document.getElementById("g1EncryptedResult").value = msg;
		await navigator.clipboard.writeText(encrypted);
		alert(msg);
	}

	g1Decrypt() {
		const decrypted = this.values.g1EncryptedValue / this.values.g1SharedKey;
		const msg = `Please share this value: ${decrypted.toLocaleString()}`;
		document.getElementById("g1GuardedValueResult").value = msg;
		setTimeout(() => {
			alert(msg);
		}, 10);
	}

	g2GenerateP1_PN() {
		let bn = new BigNumber(3);
		console.log(bn);
		debugger;
	}
}
