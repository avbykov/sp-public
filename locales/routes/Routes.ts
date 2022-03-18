import Router from "express";
import { add, del, exists, get, put } from "../controller/Controller.js";
import * as validators from "../validators/Validators.js";
import { logger } from "../logger/Logger.js";
import { Currency, Direction, Locale } from "../model/Model.js";
import { Validator } from "../validators/Validator.js";


const router = Router();


router.post(`/locale`, async (req, res) => {
		const rs = req.body;
		if (await exists(rs.country)) {
			badRequest(res, `locale for ${rs.country} already exists`);
		} else {
			validate(rs.country, validators.countryIsSpecified, validators.countryIsValid)
				.then((country: string) => validate(rs.languages, validators.languagesAreSpecified, validators.languageIsValid)
					.then((languages: string[]) => validate(rs.charset, validators.charsetIsSpecified, validators.charsetIsValid)
						.then((charset: string) => validate(rs.dateFormats, validators.dateFormatsAreSpecified, validators.dateFormatIsValid)
							.then((dateFormats: string[]) => validate(rs.timeFormats, validators.timeFormatsAreSpecified, validators.timeFormatIsValid)
								.then((timeFormats: string[]) => validate(rs.decimalSeparator, validators.decimalSeparatorIsSpecified, validators.decimalSeparatorIsValid)
									.then((decimalSeparator: string) => validate(rs.currency, validators.currencyIsSpecified, validators.currencyIsValid)
										.then((currency: Currency) => validateOptional(rs.lineDirection, validators.lineDirectionIsValid)
											.then((lineDirection: string) => validateOptional(rs.nextLine, validators.nextLineIsValid)
												.then((nextLine: string) => add.locale([
													country,
													languages,
													charset,
													dateFormats,
													timeFormats,
													currency,
													decimalSeparator,
													Direction[lineDirection as keyof typeof Direction],
													Direction[nextLine as keyof typeof Direction]])
													.then(() => res.sendStatus(201))
													.catch(error => internalServerError(res, `error code ${error.code}`)))
												.catch((error: reason<string>) => badRequest<string>(res, error)))
											.catch((error: reason<string>) => badRequest<string>(res, error)))
										.catch((error: reason<Currency>) => badRequest<Currency>(res, error)))
									.catch((error: reason<string>) => badRequest<string>(res, error)))
								.catch((error: reason<string[]>) => badRequest<string[]>(res, error)))
							.catch((error: reason<string[]>) => badRequest<string[]>(res, error)))
						.catch((error: reason<string>) => badRequest<string>(res, error)))
					.catch((error: reason<string[]>) => badRequest<string[]>(res, error)))
				.catch((error: reason<string>) => badRequest<string>(res, error));
		}
	}
);

router.put(`/languages`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => validate(req.query[`value`], validators.languagesAreSpecified, validators.languageIsValid)
			.then((languages: string[]) => put.languages(country, languages)
				.then((result: boolean) =>  result ? ok(res, ``) : notFound(res))
				.catch(error => internalServerError(res, error)))
			.catch((error: reason<string[]>) => badRequest<string[]>(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.put(`/charset`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => validate(req.query[`value`], validators.charsetIsSpecified, validators.charsetIsValid)
			.then((charset: string) => put.charset(country, charset)
				.then((result: boolean) =>  result ? ok(res, ``) : notFound(res))
				.catch(error => internalServerError(res, error)))
			.catch((error: reason<string>) => badRequest<string>(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.put(`/date-formats`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => validate(req.query[`value`], validators.dateFormatsAreSpecified, validators.dateFormatIsValid)
			.then((dateFormats: string[]) => put.dateFormats(country, dateFormats)
				.then((result: boolean) =>  result ? ok(res, ``) : notFound(res))
				.catch(error => internalServerError(res, error)))
			.catch((error: reason<string[]>) => badRequest(res, error)))
		.catch((error: reason<string>) => badRequest(res, error)));

router.put(`/time-formats`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => validate(req.query[`value`], validators.timeFormatsAreSpecified, validators.timeFormatIsValid)
			.then((timeFormats: string[]) => put.timeFormats(country, timeFormats)
				.then((result: boolean) =>  result ? ok(res, ``) : notFound(res))
				.catch(error => internalServerError(res, error)))
			.catch((error: reason<string[]>) => badRequest(res, error)))
		.catch((error: reason<string>) => badRequest(res, error)));

router.put(`/currency`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
	.then((country: string) => validateOptional(req.query.symbol, validators.currencySymbolIsValid)
		.then((symbol: string) => validateOptional(req.query[`decimal-length`], validators.currencyDecimalLengthIsValid)
			.then((decimalLength: number) => validate(req.query[`iso-4217-alfa-3`], validators.currIso4217Alfa3IsSpecified, validators.currIso4217Alfa3IsValid)
				.then((iso4217alfa3: string) => validate(req.query[`iso-4217-number-3`], validators.currIso4217Number3IsSpecified, validators.currIso4217Number3IsValid)
					.then((iso4217number3: string) => put.currency(country, new Currency(symbol, decimalLength, iso4217alfa3, iso4217number3))
						.then((result: boolean) =>  result ? ok(res, ``) : notFound(res))
						.catch(error => internalServerError(res, error)))
					.catch((error: reason<string>) => badRequest<string>(res, error)))
				.catch((error: reason<string>) => badRequest<string>(res, error)))
			.catch((error: reason<number>) => badRequest<number>(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)))
	.catch((error: reason<string>) => badRequest<string>(res, error)));

router.put(`/decimal-separator`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => validate(req.query[`value`], validators.decimalSeparatorIsSpecified, validators.decimalSeparatorIsValid)
			.then((decimalSeparator: string) => put.decimalSeparator(country, decimalSeparator)
				.then((result: boolean) =>  result ? ok(res, ``) : notFound(res))
				.catch((error: reason<number>) => internalServerError(res, error)))
			.catch((error: reason<string>) => badRequest<string>(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.put(`/line-direction`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => validate(req.query[`value`], validators.lineDirectionIsSpecified, validators.lineDirectionIsValid)
			.then((lineDirection: string) => put.lineDirection(country, Direction[lineDirection as keyof typeof Direction])
				.then((result: boolean) =>  result ? ok(res, ``) : notFound(res))
				.catch(error => internalServerError(res, error)))
			.catch((error: reason<string>) => badRequest<string>(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.put(`/next-line`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => validate(req.query[`value`], validators.nextLineIsSpecified, validators.nextLineIsValid)
			.then((nextLine: string) => put.nextLine(country, Direction[nextLine as keyof typeof Direction])
				.then((result: boolean) =>  result ? ok(res, ``) : notFound(res))
				.catch((error: reason<number>) => internalServerError<number>(res, error)))
			.catch((error: reason<string>) => badRequest<string>(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/locale`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.locale(country)
			.then((result: Locale) => result ? ok(res, result) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/languages`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.languages(country)
			.then((result: string[]) => result ? ok(res, {languages: result}) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/charset`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.charset(country)
			.then((result: string) => result ? ok(res, {charset: result}) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/date-formats`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.dateFormats(country)
			.then((result: string[]) => result ? ok(res, {dateFormats: result}) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/time-formats`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.timeFormats(country)
			.then((result: string[]) => result ? ok(res, {timeFormats: result}) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/currency`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.currency(country)
			.then((result: Currency) => result ? ok(res, {currency: result}) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/decimal-separator`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.decimalSeparator(country)
			.then((result: string) => result ? ok(res, {decimalSeparator: result}) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/line-direction`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.lineDirection(country)
			.then((result: Direction) => result ? ok(res, {lineDirection: result}) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.get(`/next-line`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => get.nextLine(country)
			.then((result: Direction) => result ? ok(res, {nextLine: result}) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

router.delete(`/locale`, async (req, res) => validate(req.query[`country`], validators.countryIsSpecified, validators.countryIsValid)
		.then((country: string) => del.locale(country)
			.then((result: number) => result > 0 ? ok(res, `Regional Settings for ${country} removed`) : notFound(res))
			.catch(error => internalServerError(res, error)))
		.catch((error: reason<string>) => badRequest<string>(res, error)));

type reason<T> = {
	value: T,
	code: string,
	message: string,
	description: string
};

/**
 * Validate value by validators.
 * @param value Value
 * @param validators Validators
 * @returns {Promise<T | reason<T>>} Validation result: input value or error description of first failed validation.
 */
async function validate<T>(value: T, ...validators: Validator<T>[]): Promise<T | reason<T>> {
	for (const element of [].concat(value)) {
		const validator: Validator<T> = validators.find((validator: Validator<T>) => !validator.validate(element));
		if (validator) {
			const reason: reason<T> = {
				value: element,
				code: validator.code,
				message: validator.message,
				description: validator.description
			};
			logger.error(reason);
			return Promise.reject<reason<T>>(reason);
		}
	}
	return Promise.resolve<T>(value);
}

async function validateOptional<T>(value: T, ...validators: Validator<T>[]): Promise<T | reason<T>> {
	return value ? validate(value, ...validators) : Promise.resolve(value);
}

/**
 * OK.
 * Set status 200 to response and return value.
 *
 * @param response Response object.
 * @param value Value to be returned.
 */
const ok = function (response, value) {
	return typeof value !== `object` ? response.status(200).send(value.toString()) : response.status(200).json(value).send();
}

/**
 * Bad request.
 * Set status 400 to response and return error.
 *
 * @param response Response object.
 * @param error Error object.
 */
const badRequest = function<T> (response, error: reason<T> | string) {
	logger.error(error);
	return typeof error !== `object` ? response.status(400).send(error.toString()) : response.status(400).json(error).send();
}

/**
 * Not found.
 * Set status 404 to response and return error.
 *
 * @param response Response object.
 */
const notFound = function (response) {
	return response.status(404).send();
}

/**
 * Internal server error.
 * Set status 500 to response and return error.
 *
 * @param response Response object.
 * @param error Error object.
 */
const internalServerError = function<T> (response, error: reason<T> | string) {
	logger.error(error);
	return typeof error !== `object` ? response.status(500).send(error.toString()) : response.status(500).json(error).send();
}

export {router};