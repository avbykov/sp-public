`use strict`;

class MessageHeader {

	code;
	text;

	constructor(code, text) {
		this.code = code;
		this.text = text;
	}

	get code() {
		return this.code;
	}

	get text() {
		return this.text;
	}
}

class Message {

	header;
	body;

	constructor(header, body) {
		this.header = header;
		this.body = body;
	}

	get header() {
		return this.header;
	}

	get body() {
		return this.body;
	}
}

const messageHeaders = {
	ID_NOT_SPECIFIED: new MessageHeader(`001`, `Id not specified`),
	LOCALE_NOT_SPECIFIED: new MessageHeader(`002`, `Locale not specified`),
	LOCALE_DOES_NOT_MATCH: new MessageHeader(`003`, `Locale does not match required format`),
	SHORT_TEXT_NOT_SPECIFIED: new MessageHeader(`004`, `Short text not specified`),
	SHORT_TEXT_LENGTH_EXCEEDED: new MessageHeader(`005`, `Short text length exceeded`),
	DESCRIPTION_NOT_SPECIFIED: new MessageHeader(`006`, `Description not specified`),
	LONG_TEXT_NOT_SPECIFIED: new MessageHeader(`007`, `Long text not specified`),
	IMAGE_NOT_SPECIFIED: new MessageHeader(`008`, `Image not specified`),
	SOUND_NOT_SPECIFIED: new MessageHeader(`009`, `Sound not specified`)
}

module.exports.headers = messageHeaders;
module.exports.Message = Message;
