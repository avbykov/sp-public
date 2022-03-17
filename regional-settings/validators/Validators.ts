import { implementation, Validator } from "./Validator.js";
import { errors } from "../errors/Errors.js";
import { Currency } from "../model/Model.js";

const exists: implementation<any> = (value: any) => value !== null && value !== undefined;

export const countryIsSpecified: Validator<string> = new Validator<string>(exists, `Country should be specified`, errors.COUNTRY_NOT_SPECIFIED);
export const countryIsValid: Validator<string> = new Validator<string>((value: string) => /^[A-Z]{2,3}$/.test(value), `Two or three uppercase latin letters`, errors.COUNTRY_INVALID_VALUE);
export const languagesAreSpecified: Validator<string> = new Validator<string>(exists, `Languages should be specified`, errors.LANGUAGE_NOT_SPECIFIED);
export const languageIsValid: Validator<string> = new Validator<string>((value: string) => /^[a-z]{2,3}$/.test(value), `Two or three lowercase latin letters`, errors.LANGUAGE_INVALID_VALUE);
export const charsetIsSpecified: Validator<string> = new Validator<string>(exists, `Charset should be specified`, errors.CHARSET_NOT_SPECIFIED);
export const charsetIsValid: Validator<string> = new Validator<string>((value: string) => /^[a-zA-Z0-9\-]+$/.test(value), `Latin letters and hyphens`, errors.CHARSET_INVALID_VALUE);
export const dateFormatsAreSpecified: Validator<string> = new Validator<string>(exists, `Date Formats should be specified`, errors.DATE_FORMATS_NOT_SPECIFIED);
export const dateFormatIsValid: Validator<string> = new Validator<string>((value: string) => /^([a-zA-Z]{2,4}[.,: -][a-zA-Z]{2,4}[.,: -][a-zA-Z]{2,4})$/.test(value), `Regexp ([a-zA-Z]{2,4}[.,: -][a-zA-Z]{2,4}[.,: -][a-zA-Z]{2,4})`, errors.DATE_FORMAT_INVALID_VALUE);
export const timeFormatsAreSpecified: Validator<string> = new Validator<string>(exists, `Time Formats should be specified`, errors.TIME_FORMATS_NOT_SPECIFIED);
export const timeFormatIsValid: Validator<string> = new Validator<string>((value: string) => /^([a-zA-Z]{2}[.:][a-zA-Z]{2})$/.test(value), `Regexp ([a-zA-Z]{2}[.:][a-zA-Z]{2}`, errors.TIME_FORMAT_INVALID_VALUE);
export const decimalSeparatorIsSpecified: Validator<string> = new Validator<string>(exists, `Decimal Separator should be specified`, errors.DECIMAL_SEPARATOR_NOT_SPECIFIED);
export const decimalSeparatorIsValid: Validator<string> = new Validator<string>((value: string) => /^[.,٫]$/.test(value), `Dot(.), comma (,) or arabic decimal separator (٫)`, errors.DECIMAL_SEPARATOR_INVALID_VALUE);
export const lineDirectionIsSpecified: Validator<string> = new Validator<string>(exists, `Line Direction should be specified`, errors.LINE_DIRECTION_NOT_SPECIFIED);
export const lineDirectionIsValid: Validator<string> = new Validator<string>((value: string) => /^top|bottom|left|right$/.test(value), `One of 'top', 'bottom', 'left', 'right'`, errors.LINE_DIRECTION_INVALID_VALUE);
export const nextLineIsSpecified: Validator<string> = new Validator<string>(exists, `Next Line should be specified`, errors.NEXT_LINE_NOT_SPECIFIED);
export const nextLineIsValid: Validator<string> = new Validator<string>((value: string) => /^top|bottom|left|right$/.test(value), `One of 'top', 'bottom', 'left', 'right'`, errors.NEXT_LINE_INVALID_VALUE);

export const currencyIsSpecified: Validator<Currency> = new Validator<Currency>(exists, `Currency should be specified`, errors.CURRENCY_NOT_SPECIFIED);
export const currencyIsValid: Validator<Currency> = new Validator<Currency>((value: Currency) => {
	return currIso4217Alfa3IsSpecified.validate(value.iso4217alfa3) &&
		currIso4217Alfa3IsValid.validate(value.iso4217alfa3) &&
		currIso4217Number3IsSpecified.validate(value.iso4217number3) &&
		currIso4217Number3IsValid.validate(value.iso4217number3) &&
		(currencySymbolIsSpecified.validate(value.symbol) ? currencySymbolIsValid.validate(value.symbol) : true) &&
		(currencyDecimalLengthIsSpecified.validate(value.decimalLength) ? currencyDecimalLengthIsValid.validate(value.decimalLength.toString()) : true);
}, `Currency value should match the following format:`, errors.CURRENCY_INVALID);
export const currIso4217Alfa3IsSpecified: Validator<string> = new Validator<string>(exists, `ISO 4217 Alfa-3 should be specified`, errors.CURRENCY_ISO_4217_ALFA_3_NOT_SPECIFIED);
export const currIso4217Alfa3IsValid: Validator<string> = new Validator<string>((value: string) => /^[A-Z]{3}$/.test(value), `Three uppercase latin letters`, errors.CURRENCY_ISO_4217_ALFA_3_INVALID_VALUE);
export const currIso4217Number3IsSpecified: Validator<string> = new Validator<string>(exists, `ISO 4217 Number-3 should be specified`, errors.CURRENCY_ISO_4217_NUMBER_3_NOT_SPECIFIED);
export const currIso4217Number3IsValid: Validator<string> = new Validator<string>((value: string) => /^\d{3}$/.test(value), `Three digits`, errors.CURRENCY_ISO_4217_NUMBER_3_INVALID_VALUE);
export const currencySymbolIsSpecified: Validator<string> = new Validator<string>(exists, `Currency Symbol should be specified`, errors.CURRENCY_SYMBOL_NOT_SPECIFIED);
export const currencySymbolIsValid: Validator<string> = new Validator<string>((value: string) => /^[\u00a4\u060b\u0e3f\u002f\u002e\u20bf\u20b5\u00a2\u20a1\u0024\u0434\u0435\u043d\u0438\u20ab\u20ac\u0192\u002c\u20b2\u20b4\u20ad\u010d\u043b\u0432\u20ba\u20a5\u20a6\u20b1\u00a3\u17db\u20bd\u20b9\u20a8\u20aa\u09f3\u20ae\u20a9\u00a5\u0142\u20b3\u20a2\u20b0\u20bb\u20af\u20a0\u20a4\u2133\u20a7\u211b\u20b7\u20b6\u09f2\u09f9\u09fb\u07fe\u07ff\u0bf9\u0af1\u0cb0\u0dbb\u0dd4\ua838\u1e2f\u0046\u0061-\u007a\u0041-\u005a\u0030-\u0039 \u2000-\u200f\u2028-\u202f\u0621-\u0628\u062a-\u063a\u0641-\u0642\u0644-\u0648\u064e-\u0651\u0655\u067e\u0686\u0698\u06a9\u06af\u06be\u06cc\u06f0-\u06f9\u0629\u0643\u0649-\u064b\u064d\u06d5\u0660-\u0669\u005c]{1,5}$/.test(value), `One of official Currency Symbols`, errors.CURRENCY_SYMBOL_INVALID_VALUE);
export const currencyDecimalLengthIsSpecified: Validator<number> = new Validator<number>(exists, `Decimal Length should be specified`, errors.CURRENCY_DECIMAL_LENGTH_NOT_SPECIFIED);
export const currencyDecimalLengthIsValid: Validator<string> = new Validator<string>((value: string) => /^\d+$/.test(value), `Digits`, errors.CURRENCY_DECIMAL_LENGTH_INVALID_VALUE);