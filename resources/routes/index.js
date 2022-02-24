const express = require(`express`);
const router = express.Router();
const { add, put, get, del } = require(`../controllers`);
const formidable  = require(`formidable`);
const fs = require(`fs`);
const validators = require(`../validators`);
const logger = require(`../logger`).logger;

router.post(`/resource`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => {
        new formidable.IncomingForm().parse(req, async function (err, fields, files) {
            if (err) {
                logger.error(err);
                badRequest(res, err);
            } else {
                validate(fields[`description`], validators.descriptionIsSpecified)
                    .then(function(description) {
                        const text = fields[`text`];
                        const image = files[`image`];
                        const imageContent = `\\x` + fs.readFileSync(image.filepath, `hex`);
                        const sound = files[`sound`];
                        const soundContent = `\\x` + fs.readFileSync(sound.filepath, `hex`);
                        add.resource(id, locale, text, description, imageContent, image.originalFilename, soundContent, sound.originalFilename)
                            .then(() => res.sendStatus(201))
                            .catch(error => internalServerError(res, `error code ${error.code}`))
                    })
                    .catch(err => {
                        const reason = {
                            method: req.method,
                            request: req.query,
                            body: req.body,
                            field: `description`,
                            error: err
                        };
                        logger.error(reason);
                        badRequest(res, err);
                    });
            }
        });
    });
});

router.put(`/text`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => {
        getBodyText(req, validators.shortTextIsSpecified, validators.shortTextIsValid)
            .then(value => {
                try {
                    put.text(id, locale, value);
                    ok(res, `text of resource ${id} for locale ${locale} updated successfully`);
                } catch (err) {
                    logger.error(err);
                    internalServerError(res, err);
                }
            })
            .catch(error => badRequest(res, error));
    });
});

router.put(`/description`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => {
        getBodyText(req, validators.descriptionIsSpecified)
            .then(value => put.description(id, locale, value)
                .then(result => ok(res, result.rowCount === 1 ? `description of resource ${id} for locale ${locale} updated successfully` : `description of resource ${id} for locale ${locale} was not updated`))
                .catch(err => internalServerError(res, err)))
            .catch(error => badRequest(res, error));
    });
});

router.put(`/image`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => {
        new formidable.IncomingForm().parse(req, async function (err, fields, files) {
            if (err) {
                logger.error(err);
                badRequest(res, err);
            } else {
                validate(files[`image`], validators.imageIsSpecified)
                    .then(data => put.image(id, locale, `\\x` + fs.readFileSync(data.filepath, `hex`), data.originalFilename)
                        .then(result => ok(res, result.rowCount === 1 ? `image of resource ${id} for locale ${locale} updated successfully` : `image of resource ${id} for locale ${locale} was not found for update, please check resource id and locale values`))
                        .catch(err => internalServerError(res, err)))
                    .catch(err => badRequest(res, err));
            }
        });
    });
});

router.put(`/sound`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => {
        new formidable.IncomingForm().parse(req, async function (err, fields, files) {
            if (err) {
                logger.error(err);
                badRequest(res, err);
            } else {
                validate(files[`sound`], validators.soundIsSpecified)
                    .then(data => put.sound(id, locale, `\\x` + fs.readFileSync(data.filepath, `hex`), data.originalFilename)
                        .then(result => ok(res, result.rowCount === 1 ? `sound of resource ${id} for locale ${locale} updated successfully` : `sound of resource ${id} for locale ${locale} was not found for update, please check resource id and locale values`))
                        .catch(err => internalServerError(res, err)))
                    .catch(err => badRequest(res, err));
            }
        });
    });
});

router.get(`/text`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => get.text(id, locale)
        .then(text => text ? ok(res, text) : notFound(res))
        .catch(err => internalServerError(res, err)));
});

router.get(`/description`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => get.description(id, locale)
        .then(result => result ? ok(res, result[`description`]) : notFound(res))
        .catch(err => internalServerError(res, err)));
});

router.get(`/image`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => get.image(id, locale)
        .then(resultSet => downloadFromDb(res, resultSet))
        .catch(err => internalServerError(res, err)));
});

router.get(`/sound`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => get.sound(id, locale)
        .then(resultSet => downloadFromDb(res, resultSet))
        .catch(err => internalServerError(res, err)));
});

router.delete(`/resource`, async (req, res) => {
    getPathVariableValue(req, `id`, validators.id)
        .then(id => del.resource(id)
            .then(somethingRemoved => ok(res, somethingRemoved ? `resource ${id} removed successfully` : `resource ${id} was not found for removal, please check resource id and locale values`))
            .catch(err => internalServerError(res, err)))
        .catch(error => badRequest(res, error));
});

router.delete(`/locale`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => del.locale(id, locale)
        .then(somethingRemoved => ok(res, somethingRemoved ? `all data of resource ${id} for locale ${locale} removed successfully` : `data of resource ${id} for locale ${locale} was not found for removal, please check resource id and locale values`))
        .catch(err => badRequest(res, err)));
});

router.delete(`/text`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => del.text(id, locale)
        .then(entryCount => ok(res, entryCount > 0 ? `text of resource ${id} for locale ${locale} removed successfully` : `text of resource ${id} for locale ${locale} was not found for removal, please check resource id and locale values`))
        .catch(err => badRequest(res, err)));
});

router.delete(`/image`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => del.image(id, locale)
        .then(result => ok(res, result.rowCount === 1 ? `image of resource ${id} for locale ${locale} removed successfully` : `image of resource ${id} for locale ${locale} was not found for removal, please check resource id and locale values`))
        .catch(err => badRequest(res, err)));
});

router.delete(`/sound`, async (req, res) => {
    executeWithValidation(req, res, (id, locale) => del.sound(id, locale)
        .then(result => ok(res, result.rowCount === 1 ? `sound of resource ${id} for locale ${locale} removed successfully` : `sound of resource ${id} for locale ${locale} was not found for removal, please check resource id and locale values`))
        .catch(err => badRequest(res, err)));
});

/**
 * OK.
 * Set status 200 to response and return value.
 *
 * @param response Response object.
 * @param value Value to be returned.
 */
const ok = function (response, value) {
    return response.status(200).send(value.toString());
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
    return response.status(400).send(error.toString());
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
    return response.status(500).send(error.toString());
}

/**
 * Execute function with validation of resource id and locale.
 *
 * @param req Request
 * @param res Response
 * @param cb Callback
 */
function executeWithValidation(req, res, cb) {
    getPathVariableValue(req, `id`, validators.id)
        .then(id => getPathVariableValue(req, `locale`, validators.localeIsSpecified, validators.localeIsValid)
            .then(locale => cb(id, locale))
            .catch(error => badRequest(res, error)))
        .catch(error => badRequest(res, error));
}

/**
 * Returns value of path variable or its validation error.
 *
 * @param request Request
 * @param field Variable name
 * @param validators Validators
 * @returns {Promise<any>} Variable value or error of first failed validation
 */
async function getPathVariableValue(request, field, ...validators) {
    const value = request.query[field];
    return validate(value, ...validators)
        .then(value => Promise.resolve(value))
        .catch(error => {
                const reason = {
                    method: request.method,
                    request: request.query,
                    field: field,
                    error: error
                };
                logger.error(reason);
                return Promise.reject(reason);
            }
        );
}

/**
 * Returns text from request body or its validation error.
 *
 * @param request Request
 * @param validators Validators
 * @returns {Promise<any>} Text or error of first failed validation
 */
async function getBodyText(request, ...validators) {
    return validate(request.body, ...validators)
        .then(value => Promise.resolve(value))
        .catch(err => {
            const reason = {
                method: request.method,
                request: request.query,
                body: request.body,
                error: err
            };
            logger.error(reason);
            return Promise.reject(reason);
        });
}

/**
 * Validate value by validators.
 *
 * @param value Value
 * @param validators Validators
 * @returns {Promise<any>} Validation result: input value or error description of first failed validation.
 */
async function validate(value, ...validators) {
    const validator = validators.find(validator => !validator.validate(value));
    if (validator) {
        const reason = {
            error: {
                value: value,
                code: validator.getCode(),
                message: validator.getMessage(),
                description: validator.getDescription()
            }
        };
        logger.error(reason);
        return Promise.reject(reason);
    } else {
        return Promise.resolve(value);
    }
}

/**
 * Creates temp file in downloads catalog, fill it in with data from DB, sends the file to client and removes the file.
 *
 * @param response Response object.
 * @param resultSet Result set from DB
 */
async function downloadFromDb(response, resultSet) {
    const fileName = resultSet.name;
    const data = resultSet.data;
    if (fileName && data) {
        const filePath = `downloads/` + fileName;
        fs.writeFile(filePath, data, err => {
            if (err) {
                logger.error(err);
                badRequest(response, err);
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

module.exports.router = router;