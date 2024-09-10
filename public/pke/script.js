import { BigNumber } from "https://cdn.jsdelivr.net/npm/bignumber.js@9.1.2/bignumber.min.mjs";
export default class InputHandler {
	values = {};
	hideSecrets = false;

	constructor() {
		this.values = {
			g2Prime: 1009,
			g2Generator: 11,
		};
	}

	validateInput(name) {
		const input = document.getElementById(name);
		const div = document.getElementById(`${name}.div`);
		const error = document.getElementById(`${name}.error`);
		const number = Number(input.value);

		// Disable all buttons
		Array.from(document.getElementsByTagName("button")).forEach((button) => {
			button.disabled = true;
		});

		// Validate Data
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

		// Clear errors
		error.textContent = "";
		input.classList.remove("invalid");
		div.classList.remove("slds-has-error");
		this.values[name] = number;

		// Enable button
		this.enableButton(name);
	}

	enableButton(name) {
		const isValid = () => {
			const input = document.getElementById(name);
			if (input.validity.valueMissing) return false;
			if (input.validity.rangeUnderflow || input.validity.rangeOverflow) return false;
			return true;
		};

		// Disable all buttons
		Array.from(document.getElementsByTagName("button")).forEach((button) => {
			button.disabled = true;
		});

		// Enable corresponding button
		switch (name) {
			case "g1GuardedValue":
				if (isValid()) {
					document.getElementById("g1Encrypt").disabled = false;
				}
				break;
			case "g1EncryptedValue":
				if (isValid()) {
					document.getElementById("g1Decrypt").disabled = false;
				}
				break;
			case "g2P1_PRIVATE":
				if (isValid()) {
					document.getElementById("g2GenerateP1_PN").disabled = false;
				}
				break;
			case "g2P2_PRIVATE":
				if (isValid()) {
					document.getElementById("g2GenerateP2_PN").disabled = false;
				}
				break;
			case "g2P1_P2_PN":
				if (isValid()) {
					document.getElementById("g2GenerateP1Secret").disabled = false;
				}
				break;
			case "g2P2_P1_PN":
				if (isValid()) {
					document.getElementById("g2GenerateP2Secret").disabled = false;
				}
				break;
			default:
				break;
		}
	}

	initialize() {
		// Inputs
		Array.from(document.getElementsByTagName("input"))
			.filter((input) => input.type === "number" && !input.disabled)
			.forEach((input) => {
				input.addEventListener("input", (element) => {
					this.validateInput(element.target.id);
				});
				input.addEventListener("click", (element) => {
					this.enableButton(element.target.id);
				});
			});

		// Buttons
		Array.from(document.getElementsByTagName("button")).forEach((button) => {
			console.log(button.id);
			button.addEventListener("click", (element) => {
				this[element.target.id]();
			});
		});

		// Toggle
		document.getElementById("showSecrets").addEventListener("click", this.toggleSecrets.bind(this));
	}

	toggleSecrets() {
		this.hideSecrets = !this.hideSecrets;
		this.#showHideSecrets();
	}

	g1Encrypt() {
		const encrypted = (this.values.g1GuardedValue * this.values.g1P1SharedKey).toLocaleString();
		document.getElementById("g1EncryptedResult").value = encrypted;
	}

	g1Decrypt() {
		const decrypted = (this.values.g1EncryptedValue / this.values.g1P2SharedKey).toLocaleString();
		document.getElementById("g1GuardedValueResult").value = decrypted;
	}

	g2GenerateP1_PN() {
		const P1_PN = this.#expMod({ base: this.values.g2Generator, privKey: this.values.g2P1_PRIVATE }).toLocaleString(); // g^P1_PRIVATE mod p
		document.getElementById("g2P1_PN").value = P1_PN;
	}

	g2GenerateP2_PN() {
		const P2_PN = this.#expMod({ base: this.values.g2Generator, privKey: this.values.g2P2_PRIVATE }).toLocaleString(); // g^P2_PRIVATE mod p
		document.getElementById("g2P2_PN").value = P2_PN;
	}

	g2GenerateP1Secret() {
		const p1Secret = this.#expMod({ base: this.values.g2P1_P2_PN, privKey: this.values.g2P1_PRIVATE }).toLocaleString();
		document.getElementById("g2P1Secret").value = p1Secret;
	}

	g2GenerateP2Secret() {
		const p2Secret = this.#expMod({ base: this.values.g2P2_P1_PN, privKey: this.values.g2P2_PRIVATE }).toLocaleString();
		document.getElementById("g2P2Secret").value = p2Secret;
	}

	#expMod({ base, privKey }) {
		const bnBase = new BigNumber(base);
		const bnPOWER = bnBase.exponentiatedBy(privKey);
		const bnPN = bnPOWER.modulo(this.values.g2Prime); // base^PRIVATE mod p
		return bnPN.toNumber();
	}

	#showHideSecrets() {
		document.querySelectorAll(`[data-input="secret"]`).forEach((input) => {
			input.classList[this.hideSecrets ? "remove" : "add"]("secret");
		});
	}
}
