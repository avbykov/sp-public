class ErrorData {

	constructor(private readonly _code: string, private readonly _message: string) {
	}

	get code() {
		return this._code;
	}

	get message() {
		return this._message;
	}
}

export { ErrorData };