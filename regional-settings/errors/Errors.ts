import { ErrorData } from './ErrorData.js';

const errors = {
	UNKNOWN_PROPERTY: new ErrorData(`REGSET-0000`, `Unknown property specified`),
	COUNTRY_NOT_SPECIFIED: new ErrorData(`REGSET-0001`, `Country not specified`),
	COUNTRY_INVALID_VALUE: new ErrorData(`REGSET-0002`, `Invalid value for Country`),
	LANGUAGE_NOT_SPECIFIED: new ErrorData(`REGSET-0003`, `Language not specified`),
	LANGUAGE_INVALID_VALUE: new ErrorData(`REGSET-0004`, `Invalid value for Language`),
	CHARSET_NOT_SPECIFIED: new ErrorData(`REGSET-0005`, `Charset not specified`),
	CHARSET_INVALID_VALUE: new ErrorData(`REGSET-0006`, `Invalid value for Charset`),
	DATE_FORMATS_NOT_SPECIFIED: new ErrorData(`REGSET-0007`, `Date formats not specified`),
	DATE_FORMAT_INVALID_VALUE: new ErrorData(`REGSET-0008`, `Invalid value for Date Format`),
	TIME_FORMATS_NOT_SPECIFIED: new ErrorData(`REGSET-0009`, `Time formats not specified`),
	TIME_FORMAT_INVALID_VALUE: new ErrorData(`REGSET-0010`, `Invalid value for Time Format`),
	DECIMAL_SEPARATOR_NOT_SPECIFIED: new ErrorData(`REGSET-0010`, `Charset not specified`),
	DECIMAL_SEPARATOR_INVALID_VALUE: new ErrorData(`REGSET-0011`, `Invalid value for Decimal Separator`),
	LINE_DIRECTION_NOT_SPECIFIED: new ErrorData(`REGSET-0012`, `Line Direction not specified`),
	LINE_DIRECTION_INVALID_VALUE: new ErrorData(`REGSET-0013`, `Invalid value for Line Direction`),
	NEXT_LINE_NOT_SPECIFIED: new ErrorData(`REGSET-0014`, `Next Line not specified`),
	NEXT_LINE_INVALID_VALUE: new ErrorData(`REGSET-0015`, `Invalid value for Next Line`),
	CURRENCY_NOT_SPECIFIED: new ErrorData(`REGSET-0016`, `Currency not specified`),
	CURRENCY_INVALID: new ErrorData(`REGSET-0017`, `Invalid value for Currency`),
	CURRENCY_ISO_4217_ALFA_3_NOT_SPECIFIED: new ErrorData(`REGSET-0018`, `ISO 4217 alfa-3 code not specified`),
	CURRENCY_ISO_4217_ALFA_3_INVALID_VALUE: new ErrorData(`REGSET-0019`, `Invalid value for ISO 4217 alfa-3`),
	CURRENCY_ISO_4217_NUMBER_3_NOT_SPECIFIED: new ErrorData(`REGSET-0020`, `ISO 4217 number-3 code not specified`),
	CURRENCY_ISO_4217_NUMBER_3_INVALID_VALUE: new ErrorData(`REGSET-0021`, `Invalid value for ISO 4217 number-3`),
	CURRENCY_SYMBOL_NOT_SPECIFIED: new ErrorData(`REGSET-0022`, `Currency Symbol not specified`),
	CURRENCY_SYMBOL_INVALID_VALUE: new ErrorData(`REGSET-0023`, `Invalid value for Currency Symbol`),
	CURRENCY_DECIMAL_LENGTH_NOT_SPECIFIED: new ErrorData(`REGSET-0024`, `Currency Decimal Length not specified`),
	CURRENCY_DECIMAL_LENGTH_INVALID_VALUE: new ErrorData(`REGSET-0025`, `Invalid value for Currency Decimal Length`)
};

export { errors };