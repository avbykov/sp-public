import pkg from 'mongoose';
import { Currency, Direction, RegionalSettings } from "../../model/Model.js";
import { errors } from "../../errors/Errors.js";
import { ErrorData } from "../../errors/ErrorData.js";
import { Validator } from "../../validators/Validator.js";
import * as validators from "../../validators/Validators.js";
const { Schema, model } = pkg;

function buildMongoValidator<EsType, JsType>(type: EsType,
											 validator: Validator<JsType>,
											 required?: ErrorData): pkg.SchemaDefinitionProperty {
	return {
		type: type,
		required: required ? [true, required.code + `: ` + required.message] : false,
		validate: {
			validator: value => [].concat(value).find(value => !validator.validate(value)),
			message: validator.code + `: ` + validator.message + ` - ` + validator.description
		}
	};
}

const CurrencySchema = new Schema<Currency>({
	iso4217alfa3: buildMongoValidator<StringConstructor, string>(String, validators.currIso4217Alfa3IsValid, errors.CURRENCY_ISO_4217_ALFA_3_INVALID_VALUE),
	iso4217number3: buildMongoValidator<StringConstructor, string>(String, validators.currIso4217Number3IsValid, errors.CURRENCY_ISO_4217_NUMBER_3_INVALID_VALUE),
	symbol: buildMongoValidator<StringConstructor, string>(String, validators.currencySymbolIsValid),
	decimalLength: buildMongoValidator<NumberConstructor, string>(Number, validators.currencyDecimalLengthIsValid)
}, {_id: false});

const RegionalSettingsSchema = new Schema<RegionalSettings>({
	country: buildMongoValidator<StringConstructor, string>(String, validators.countryIsValid, errors.COUNTRY_NOT_SPECIFIED),
	languages: buildMongoValidator<ArrayConstructor, string>(Array, validators.languageIsValid, errors.LANGUAGE_NOT_SPECIFIED),
	charset: buildMongoValidator<StringConstructor, string>(String, validators.charsetIsValid, errors.CHARSET_NOT_SPECIFIED),
	dateFormats: buildMongoValidator<ArrayConstructor, string>(Array, validators.dateFormatIsValid, errors.DATE_FORMATS_NOT_SPECIFIED),
	timeFormats: buildMongoValidator<ArrayConstructor, string>(Array, validators.timeFormatIsValid, errors.TIME_FORMATS_NOT_SPECIFIED),
	currency: CurrencySchema,
	decimalSeparator: buildMongoValidator<StringConstructor, string>(String, validators.decimalSeparatorIsValid, errors.DECIMAL_SEPARATOR_NOT_SPECIFIED),
	lineDirection: <Direction>buildMongoValidator<StringConstructor, string>(String, validators.lineDirectionIsValid),
	nextLine: <Direction>buildMongoValidator<StringConstructor, string>(String, validators.nextLineIsValid)
});

const RegionalSettingsModel = model(`RegionalSettings`, RegionalSettingsSchema, `data`);
RegionalSettingsSchema.loadClass(RegionalSettings);
const CurrencyModel = model(`Currency`, CurrencySchema, `data`);
CurrencySchema.loadClass(Currency);

export {RegionalSettingsModel, CurrencyModel};