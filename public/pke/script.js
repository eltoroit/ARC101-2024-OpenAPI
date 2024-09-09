import { BigNumber } from "https://cdn.jsdelivr.net/npm/bignumber.js@9.1.2/bignumber.min.mjs";
export default class InputHandler {
	values = {};

	constructor() {
		this.values = {
			g2Prime: 1009,
			g2Generator: 11,
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
			document.getElementById("g2GenerateP2_PN").disabled = true;
			document.getElementById("g2GenerateP1Secret").disabled = true;
			document.getElementById("g2GenerateP2Secret").disabled = true;
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

		switch (name) {
			case "g1GuardedValue":
				document.getElementById("g1Encrypt").disabled = false;
				break;
			case "g1EncryptedValue":
				document.getElementById("g1Decrypt").disabled = false;
				break;
			case "g2P1_PRIVATE":
				document.getElementById("g2GenerateP1_PN").disabled = false;
				break;
			case "g2P2_PRIVATE":
				document.getElementById("g2GenerateP2_PN").disabled = false;
				break;
			case "g2P1_P2_PN":
				document.getElementById("g2GenerateP1Secret").disabled = false;
				break;
			case "g2P2_P1_PN":
				document.getElementById("g2GenerateP2Secret").disabled = false;
				break;
			default:
				break;
		}
	}

	#delay = 100;
	g1Encrypt() {
		const encrypted = this.values.g1GuardedValue * this.values.g1SharedKey;
		const msg = `Please share this value: ${encrypted.toLocaleString()}`;
		document.getElementById("g1EncryptedResult").value = msg;
		setTimeout(() => {
			alert(msg);
		}, this.#delay);
	}

	g1Decrypt() {
		const decrypted = this.values.g1EncryptedValue / this.values.g1SharedKey;
		const msg = `Please share this value: ${decrypted.toLocaleString()}`;
		document.getElementById("g1GuardedValueResult").value = msg;
		setTimeout(() => {
			alert(msg);
		}, this.#delay);
	}

	g2GenerateP1_PN() {
		const P1_PN = this.#expMod({ base: this.values.g2Generator, privKey: this.values.g2P1_PRIVATE }); // g^P1_PRIVATE mod p
		const msg = `Please share this value: ${P1_PN.toLocaleString()}`;
		document.getElementById("g2P1_PN").value = msg;
		setTimeout(() => {
			alert(msg);
		}, this.#delay);
	}

	g2GenerateP2_PN() {
		const P2_PN = this.#expMod({ base: this.values.g2Generator, privKey: this.values.g2P2_PRIVATE }); // g^P2_PRIVATE mod p
		const msg = `Please share this value: ${P2_PN.toLocaleString()}`;
		document.getElementById("g2P2_PN").value = msg;
		setTimeout(() => {
			alert(msg);
		}, this.#delay);
	}

	g2GenerateP1Secret() {
		const p1Secret = this.#expMod({ base: this.values.g2P1_P2_PN, privKey: this.values.g2P1_PRIVATE });
		const msg = `SECRET: ${p1Secret.toLocaleString()}`;
		document.getElementById("g2P1Secret").value = msg;
	}

	g2GenerateP2Secret() {
		const p2Secret = this.#expMod({ base: this.values.g2P2_P1_PN, privKey: this.values.g2P2_PRIVATE });
		const msg = `SECRET: ${p2Secret.toLocaleString()}`;
		document.getElementById("g2P2Secret").value = msg;
	}

	#expMod({ base, privKey }) {
		const bnBase = new BigNumber(base);
		const bnPOWER = bnBase.exponentiatedBy(privKey);
		const bnPN = bnPOWER.modulo(this.values.g2Prime); // base^PRIVATE mod p
		return bnPN.toNumber();
	}
}
