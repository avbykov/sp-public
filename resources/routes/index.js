`use strict`;

const express = require(`express`);
const router = express.Router();
const { add, put, get, del } = require(`../controllers`);
const formidable  = require(`formidable`);
const fs = require(`fs`);
const validators = require(`../validators`);
const logger = require(`../logger`).logger;

router.post(`/resource`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale =>
				new formidable.IncomingForm().parse(req, async function (err, fields, files) {
					if (err) {
						internalServerError(res, err);
					} else {
						validate(fields[`description`], validators.descriptionIsSpecified)
							.then(description => add.resource(id, locale, fields[`text`], description, file(files[`image`].filepath), files[`image`].originalFilename, file(files[`sound`].filepath), files[`sound`].originalFilename)
								.then(() => res.sendStatus(201))
								.catch(error => internalServerError(res, `error code ${error.code}`)))
							.catch(err => badRequest(res, err));
					}
				}))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.put(`/text`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => validate(req.body, validators.textIsSpecified, validators.textIsValid)
				.then(text => put.text(id, locale, text)
					.then(() => ok(res, `text of resource ${id} for locale ${locale} updated successfully`))
					.catch(err => internalServerError(res, err)))
				.catch(err => badRequest(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.put(`/description`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => validate(req.body, validators.descriptionIsSpecified)
				.then(description => put.description(id, locale, description)
					.then(result => ok(res, result ? `description of resource ${id} for locale ${locale} updated successfully` : `description of resource ${id} for locale ${locale} was not updated`))
					.catch(err => internalServerError(res, err)))
				.catch(error => badRequest(res, error)))
			.catch(error => badRequest(res, error)))
		.catch(error => badRequest(res, error)));

router.put(`/image`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id =>
			validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
				.then(locale => new formidable.IncomingForm().parse(req, async (err, fields, files) => {
					if (err) {
						internalServerError(res, err);
					} else {
						validate(files[`image`], validators.imageIsSpecified)
							.then(data => put.image(id, locale, `\\x` + fs.readFileSync(data.filepath, `hex`), data.originalFilename)
								.then(result => ok(res, result ? `image of resource ${id} for locale ${locale} updated successfully` : `image of resource ${id} for locale ${locale} was not found for update, please check resource id and locale values`))
								.catch(err => internalServerError(res, err)))
							.catch(err => badRequest(res, err));
					}
				})))
		.catch(err => badRequest(res, err)));

router.put(`/sound`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id =>
			validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
				.then(locale => new formidable.IncomingForm().parse(req, async (err, fields, files) => {
					if (err) {
						internalServerError(res, err);
					} else {
						validate(files[`sound`], validators.imageIsSpecified)
							.then(data => put.sound(id, locale, `\\x` + fs.readFileSync(data.filepath, `hex`), data.originalFilename)
								.then(result => ok(res, result ? `sound of resource ${id} for locale ${locale} updated successfully` : `sound of resource ${id} for locale ${locale} was not found for update, please check resource id and locale values`))
								.catch(err => internalServerError(res, err)))
							.catch(err => badRequest(res, err));
					}
				})))
		.catch(err => badRequest(res, err)));

router.get(`/text`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => get.text(id, locale)
				.then(text => text ? ok(res, text) : notFound(res))
				.catch(err => internalServerError(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.get(`/description`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => get.description(id, locale)
				.then(text => text ? ok(res, text) : notFound(res))
				.catch(err => internalServerError(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.get(`/image`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => get.image(id, locale)
				.then(result => result ? download(res, result) : notFound(res))
				.catch(err => internalServerError(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.get(`/sound`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => get.sound(id, locale)
				.then(result => result ? download(res, result) : notFound(res))
				.catch(err => internalServerError(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.delete(`/resource`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => del.resource(id)
			.then(result => ok(res, result ? `resource ${id} removed successfully` : `resource ${id} was not found for removal, please check resource id and locale values`))
			.catch(err => internalServerError(res, err)))
		.catch(err => badRequest(res, err)));

router.delete(`/locale`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => del.locale(id, locale)
				.then(result => ok(res, result ? `all data of resource ${id} for locale ${locale} removed successfully` : `data of resource ${id} for locale ${locale} was not found for removal, please check resource id and locale values`))
				.catch(err => internalServerError(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.delete(`/text`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => del.text(id, locale)
				.then(result => ok(res, result ? `text of resource ${id} for locale ${locale} removed successfully` : `text of resource ${id} for locale ${locale} was not found for removal, please check resource id and locale values`))
				.catch(err => internalServerError(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.delete(`/image`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => del.image(id, locale)
				.then(result => ok(res, result ? `image of resource ${id} for locale ${locale} removed successfully` : `image of resource ${id} for locale ${locale} was not found for removal, please check resource id and locale values`))
				.catch(err => internalServerError(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

router.delete(`/sound`, async (req, res) =>
	validate(req.query.id, validators.id)
		.then(id => validate(req.query.locale, validators.localeIsSpecified, validators.localeIsValid)
			.then(locale => del.sound(id, locale)
				.then(result => ok(res, result ? `sound of resource ${id} for locale ${locale} removed successfully` : `sound of resource ${id} for locale ${locale} was not found for removal, please check resource id and locale values`))
				.catch(err => internalServerError(res, err)))
			.catch(err => badRequest(res, err)))
		.catch(err => badRequest(res, err)));

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
const badRequest = function (response, error) {
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
const internalServerError = function (response, error) {
	logger.error(error);
	return typeof error !== `object` ? response.status(500).send(error.toString()) : response.status(500).json(error).send();
}

/**
 * Validate value by validators.
 *
 * @param value Value
 * @param validators Validators
 * @returns {Promise<any>} Validation result: input value or error description of first failed validation.
 */
async function validate(value, ...validators) {
	for (const element of [].concat(value)) {
		const validator = validators.find((validator) => !validator.validate(element));
		if (validator) {
			const reason = {
				value: element,
				code: validator.code,
				message: validator.message,
				description: validator.description
			};
			logger.error(reason);
			return Promise.reject(reason);
		}
	}
	return Promise.resolve(value);
}

/**
 * Creates temp file in downloads catalog, fill it in with data from DB, sends the file to client and removes the file.
 *
 * @param response Response object.
 * @param resultSet Result set from DB
 */
async function download(response, resultSet) {
	const fileName = resultSet.name;
	const data = resultSet.data;
	if (fileName && data) {
		const filePath = `downloads/` + fileName;
		fs.writeFile(filePath, data, err => {
			if (err) {
				logger.error(err);
				internalServerError(response, err);
			} else {
				response.download(filePath, fileName);
				response.on(`close`, err => {
					if (err) {
						logger.error(err);
					} else {
						fs.unlink(filePath, err => {
							if (err) {
								logger.error(err);
							}
						});
					}
				});
			}
		});
	} else {
		notFound(response);
	}
}

const file = path => `\\x` + fs.readFileSync(path, `hex`);

module.exports.router = router;