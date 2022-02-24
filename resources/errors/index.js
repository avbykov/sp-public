`use strict`;

class ErrorData {

	code;
	message;

	constructor(code, message) {
		this.code = code;
		this.message = message;
	}

	getCode() {
		return this.code;
	}

	getMessage() {
		return this.message;
	}
}

const errorsData = {
	ID_NOT_SPECIFIED: new ErrorData(`RES-001`, `Id not specified`),
	LOCALE_NOT_SPECIFIED: new ErrorData(`RES-002`, `Locale not specified`),
	LOCALE_DOES_NOT_MATCH: new ErrorData(`RES-003`, `Locale does not match required format`),
	SHORT_TEXT_NOT_SPECIFIED: new ErrorData(`RES-004`, `Short text not specified`),
	SHORT_TEXT_LENGTH_EXCEEDED: new ErrorData(`RES-005`, `Short text length exceeded`),
	DESCRIPTION_NOT_SPECIFIED: new ErrorData(`RES-006`, `Description not specified`),
	LONG_TEXT_NOT_SPECIFIED: new ErrorData(`RES-007`, `Long text not specified`),
	IMAGE_NOT_SPECIFIED: new ErrorData(`RES-008`, `Image not specified`),
	SOUND_NOT_SPECIFIED: new ErrorData(`RES-009`, `Sound not specified`)
}

module.exports = errorsData;