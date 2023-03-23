`use strict`;

const {headers, Message} = require(`../messages`);

class Validator {

	implementation;
	message;

	constructor(implementation, messageHeader, description) {
		this.implementation = implementation;
		this.message = new Message(messageHeader, description);
	}

	validate(data) {
		return this.implementation(data);
	}

	get message() {
		return this.message;
	}
}

const validators = {
	id: new Validator(data => typeof data === `string`, headers.ID_NOT_SPECIFIED, `Id should be specified`),
	localeIsSpecified: new Validator(data => typeof data === `string`, headers.LOCALE_NOT_SPECIFIED, `Locale should be specified`),
	localeIsValid: new Validator(data => /^[a-z]{2}_[A-Z]{2}$/.test(data), headers.LOCALE_DOES_NOT_MATCH, `Locale should consist of two lowercase latin letters (language), underscore and two uppercase latin letters (country)`),
	textIsSpecified: new Validator(data => typeof data === `string`, headers.SHORT_TEXT_NOT_SPECIFIED, `Text should be specified`),
	textIsValid: new Validator(data => typeof data === `string` && Buffer.byteLength(data) <= 536870912, headers.SHORT_TEXT_LENGTH_EXCEEDED, `Text should be less than 512Mb`),
	descriptionIsSpecified: new Validator(data => typeof data === `string`, headers.DESCRIPTION_NOT_SPECIFIED, `Description should be specified`),
	imageIsSpecified: new Validator(data => typeof data !== `undefined`, headers.IMAGE_NOT_SPECIFIED, `Image should be specified`),
	soundIsSpecified: new Validator(data => typeof data !== `undefined`, headers.SOUND_NOT_SPECIFIED, `Sound should be specified`)
};

module.exports = validators;
