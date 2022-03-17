import { ErrorData } from '../errors/ErrorData.js';

type implementation<T> = (value: T) => boolean;

class Validator<T> {

	constructor(private readonly _implementation: implementation<T>, private readonly _description: string, private readonly _errorData: ErrorData) {
	}

	validate(data: T): boolean {
		return this._implementation(data);
	}

	get description() {
		return this._description;
	}

	get code() {
		return this._errorData.code;
	}

	get message() {
		return this._errorData.message;
	}
}

export {Validator, implementation};