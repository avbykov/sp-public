const errorsData = require(`../errors`);

class Validator {

    implementation;
    description;
    errorData;

    constructor(implementation, description, errorData) {
        this.implementation = implementation;
        this.description = description;
        this.errorData = errorData;
    }

    validate(data) {
        return this.implementation(data);
    }

    getCode() {
        return this.errorData.getCode();
    }

    getMessage() {
        return this.errorData.getMessage();
    }

    getDescription() {
        return this.description;
    }
}

const validators = {
    id: new Validator(data => typeof data === `string`, `Id should be specified`, errorsData.ID_NOT_SPECIFIED),
    localeIsSpecified: new Validator(data => typeof data === `string`, `Locale should be specified`, errorsData.LOCALE_NOT_SPECIFIED),
    localeIsValid: new Validator(data => /^[a-z]{2}_[A-Z]{2}$/.test(data), `Locale should consist of two lowercase latin letters (language), underscore and two uppercase latin letters (country)`, errorsData.LOCALE_DOES_NOT_MATCH),
    shortTextIsSpecified: new Validator(data => typeof data === `string`, `Text should be specified`, errorsData.SHORT_TEXT_NOT_SPECIFIED),
    shortTextIsValid: new Validator(data => typeof data === `string`, `Text should be less than 512Mb`, errorsData.SHORT_TEXT_LENGTH_EXCEEDED),
    descriptionIsSpecified: new Validator(data => typeof data === `string`, `Description should be specified`, errorsData.DESCRIPTION_NOT_SPECIFIED),
    imageIsSpecified: new Validator(data => typeof data !== `undefined`, `Image should be specified`, errorsData.IMAGE_NOT_SPECIFIED),
    soundIsSpecified: new Validator(data => typeof data !== `undefined`, `Sound should be specified`, errorsData.SOUND_NOT_SPECIFIED)
};

module.exports = validators;